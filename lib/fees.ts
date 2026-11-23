// Fee rules and WhatsApp messages for the admin CRM. Pure functions (no browser or database), tested in fees.test.mjs.
// Dates are 'YYYY-MM-DD' strings in the academy's local time, so month maths never shifts across time zones.

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

export type FeeStatus = { balance: number; overdue: boolean; unpaidMonths: string[]; paid: number };

export const localToday = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// This month and the next n-1, as 'YYYY-MM-01' (for recording advance monthly payments).
export function nextMonths(today: string, n: number): string[] {
  const [y, m] = today.split("-").map(Number);
  return Array.from({ length: n }, (_, i) => {
    const total = m - 1 + i;
    return `${y + Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}-01`;
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

// WhatsApp wants the full international number without '+'. Accepts how numbers are usually typed in India.
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return null;
}

export const waLink = (phone: string, text: string) =>
  `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;

const SIGN_OFF = "\n\nTeam Rise Academy\nSector 110, Gurugram · 070424 81547";

export function welcomeText(s: Pick<Student, "name">, courses: string[]) {
  return `Namaste ${s.name}! 🙏\n\nWelcome to Rise Academy. You are now enrolled in ${courses.join(", ")}. We are happy to have you with us.\n\nFor any question, call or WhatsApp us on this number.${SIGN_OFF}`;
}

export function reminderText(s: Pick<Student, "name">, e: Enrollment, status: FeeStatus) {
  const what =
    e.fee_type === "monthly"
      ? `the ${e.course} fee of ${rupees(status.balance)} for ${status.unpaidMonths.map(monthLabel).join(", ")}`
      : `the remaining ${e.course} course fee of ${rupees(status.balance)}`;
  return `Namaste ${s.name},\n\nThis is a gentle reminder from Rise Academy that ${what} is due. Please pay at the academy at your convenience. If you have already paid, please ignore this message.\n\nThank you! 🙏${SIGN_OFF}`;
}
