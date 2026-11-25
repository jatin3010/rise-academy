// Fee rules and WhatsApp messages for the admin CRM. Pure functions (no browser or database), tested in fees.test.mjs.
// Dates are 'YYYY-MM-DD' strings in the academy's local time, so month maths never shifts across time zones.
import { PHONE_DISPLAY, UPI_ID } from "./site.ts";

export type Payment = {
  id: string;
  enrollment_id: string;
  amount: number;
  paid_on: string;
  for_month: string | null; // monthly fees: first day of the month this payment covers
  method: string | null;
  note: string | null;
};

export type Enrollment = {
  id: string;
  student_id: string;
  category: string;
  course: string;
  fee_type: "monthly" | "course";
  fee_amount: number; // rupees: per month, or the whole course
  due_day: number | null; // monthly: day of the month the fee is due (1–28)
  next_due_on: string | null; // course: date the next instalment is due
  started_on: string;
  ended_on: string | null; // set when the course stops; monthly fees are not owed after it
  active: boolean;
  payments: Payment[];
};

export type Student = {
  id: string;
  name: string;
  phone: string;
  guardian_name: string | null;
  class_level: string | null;
  notes: string | null;
  active: boolean;
  created_at: string;
  enrollments: Enrollment[];
};

// What the add/edit forms and the Excel import save for a student and for one of their courses.
export type StudentValues = Pick<Student, "name" | "phone" | "guardian_name" | "class_level" | "notes">;
export type EnrollmentValues = Pick<
  Enrollment,
  "category" | "course" | "fee_type" | "fee_amount" | "due_day" | "next_due_on" | "started_on"
>;

export type FeeStatus ={ balance: number; overdue: boolean; unpaidMonths: string[]; paid: number };

export const localToday = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// n months as 'YYYY-MM-01', starting `from` months after this one (0 = this month, -6 = six months ago).
export function nextMonths(today: string, n: number, from = 0): string[] {
  const [y, m] = today.split("-").map(Number);
  return Array.from({ length: n }, (_, i) => {
    const total = m - 1 + from + i;
    return `${y + Math.floor(total / 12)}-${String((((total % 12) + 12) % 12) + 1).padStart(2, "0")}-01`;
  });
}

// For the dashboard charts: per month ('YYYY-MM-01'), students with a course running in it and fees received in it.
export function monthlyTotals(students: Student[], months: string[]) {
  const payments = students.flatMap((s) => s.enrollments.flatMap((e) => e.payments));
  return months.map((month) => {
    const last = `${month.slice(0, 8)}31`; // every date in the month sorts at or before 'YYYY-MM-31'
    const studying = students.filter((s) => s.enrollments.some((e) => e.started_on <= last && (!e.ended_on || e.ended_on >= month))).length;
    const collected = payments.reduce((sum, p) => (p.paid_on.slice(0, 7) === month.slice(0, 7) ? sum + p.amount : sum), 0);
    return { month, studying, collected };
  });
}

export const dateLabel = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const monthLabel = (month: string) =>
  new Date(`${month}T00:00:00`).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

// Months a monthly fee is owed for, as 'YYYY-MM-01'. The joining month is owed from the day the student starts;
// every later month once its due day has arrived.
export function dueMonths(startedOn: string, dueDay: number, today: string): string[] {
  if (startedOn > today) return [];
  const months: string[] = [];
  let [y, m] = startedOn.split("-").map(Number);
  const [ty, tm, td] = today.split("-").map(Number);
  while (y < ty || (y === ty && m <= tm)) {
    const key = `${y}-${String(m).padStart(2, "0")}-01`;
    const isStartMonth = months.length === 0;
    const isCurrentMonth = y === ty && m === tm;
    if (isStartMonth || !isCurrentMonth || td >= dueDay) months.push(key);
    m += 1;
    if (m > 12) [y, m] = [y + 1, 1];
  }
  return months;
}

// Total recorded for one month of a monthly fee; a month is paid only once this reaches the fee (part-payments add up).
export const paidFor = (e: Enrollment, month: string) =>
  e.payments.reduce((sum, p) => (p.for_month === month ? sum + p.amount : sum), 0);

// Months a monthly payment can be for: unpaid or part-paid ones (oldest first), then the next few for paying in
// advance; only months the course runs in (a new fee that starts in January takes no December payment).
export function payableMonths(e: Enrollment, today: string): string[] {
  const months = [...new Set([...feeStatus(e, today).unpaidMonths, ...nextMonths(today, 3)])];
  const first = `${e.started_on.slice(0, 7)}-01`;
  return months.filter((m) => paidFor(e, m) < e.fee_amount && m >= first && (!e.ended_on || m <= e.ended_on));
}

export function feeStatus(e: Enrollment, today: string): FeeStatus {
  const paid = e.payments.reduce((sum, p) => sum + p.amount, 0);
  if (e.fee_type === "monthly") {
    const until = e.ended_on && e.ended_on < today ? e.ended_on : today;
    const unpaidMonths = dueMonths(e.started_on, e.due_day ?? 1, until).filter((m) => paidFor(e, m) < e.fee_amount);
    const balance = unpaidMonths.reduce((sum, m) => sum + e.fee_amount - paidFor(e, m), 0);
    return { balance, overdue: unpaidMonths.length > 0, unpaidMonths, paid };
  }
  const balance = Math.max(0, e.fee_amount - paid);
  const overdue = balance > 0 && e.next_due_on !== null && e.next_due_on <= today;
  return { balance, overdue, unpaidMonths: [], paid };
}

// Why a payment can't be recorded, or null when it can. Never more than is owed: ₹3,000 recorded against one ₹1,500
// month would leave the next month looking unpaid.
export function paymentProblem(e: Enrollment, amount: number, forMonth: string | null, today: string): string | null {
  if (e.fee_type === "monthly") {
    if (!forMonth) return payableMonths(e, today).length ? "Choose the month this payment is for." : "Every month of this course is already paid.";
    const left = e.fee_amount - paidFor(e, forMonth);
    return amount > left
      ? `${rupees(amount)} is more than the ${rupees(left)} left for ${monthLabel(forMonth)}. Record the rest as a second payment for the next month.`
      : null;
  }
  const { balance } = feeStatus(e, today);
  if (amount <= balance) return null;
  return balance
    ? `${rupees(amount)} is more than the ${rupees(balance)} left on this course. If the course fee changed, use “Edit fee” first.`
    : "This course is already fully paid.";
}

// A new monthly fee starts after the last month already charged or paid for (paid in advance included); those
// months keep the old fee. Returns the update that ends the current course and the new course to add, or null when
// there is nothing to split (course stopped, not monthly, or the fee unchanged): then the edit just updates it.
export function changeMonthlyFee(e: Enrollment, values: EnrollmentValues, today: string) {
  if (!e.active || e.fee_type !== "monthly" || values.fee_type !== "monthly" || values.fee_amount === e.fee_amount) return null;
  const last = [`${today.slice(0, 7)}-01`, ...e.payments.map((p) => p.for_month ?? "")].sort().at(-1)!;
  const [y, m] = last.split("-").map(Number);
  const [next] = nextMonths(last, 1, 1);
  return {
    end: { active: false, ended_on: localToday(new Date(y, m, 0)) }, // last day of that month
    // Starting on the due day makes the first new month owed from its due day, like every other month.
    add: { ...values, started_on: `${next.slice(0, 8)}${String(values.due_day ?? 1).padStart(2, "0")}` },
  };
}

// WhatsApp wants the full international number without '+'. Accepts how numbers are usually typed in India.
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return null;
}

// One student = same name (any case, extra spaces) and same mobile number (however it was typed). Used by the add
// form and the Excel import to spot students already in the CRM.
export const studentKey = (name: string, phone: string) => `${name.trim().toLowerCase().replace(/\s+/g, " ")}|${normalizePhone(phone)}`;

export const waLink =(phone: string, text: string) =>
  `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;

const SIGN_OFF = `\n\nTeam Rise Academy\nSector 110, Gurugram · ${PHONE_DISPLAY}`;

export function welcomeText(s: Pick<Student, "name">, courses: string[]) {
  const enrolled = courses.length ? ` You are now enrolled in ${courses.join(", ")}.` : "";
  return `Namaste ${s.name}! 🙏\n\nWelcome to Rise Academy.${enrolled} We are happy to have you with us.\n\nFor any question, call or WhatsApp us on this number.${SIGN_OFF}`;
}

// For a number left in the website's "Get a call back" form.
export const callbackText = `Namaste! This is Rise Academy. You asked us to call you back from our website. When is a good time to talk?${SIGN_OFF}`;

// upi: the academy's UPI ID; a plain ID to copy, because WhatsApp doesn't make upi:// payment links tappable.
export function reminderText(s: Pick<Student, "name">, e: Enrollment, status: FeeStatus, upi = UPI_ID) {
  const what =
    e.fee_type === "monthly"
      ? `the ${e.course} fee of ${rupees(status.balance)} for ${status.unpaidMonths.map(monthLabel).join(", ")}`
      : `the remaining ${e.course} course fee of ${rupees(status.balance)}`;
  const pay = upi ? ` or by UPI to ${upi} (${rupees(status.balance)})` : "";
  return `Namaste ${s.name},\n\nThis is a gentle reminder from Rise Academy that ${what} is due. Please pay at the academy${pay} at your convenience. If you have already paid, please ignore this message.\n\nThank you! 🙏${SIGN_OFF}`;
}
