// The yearly Excel report: fees month by month, every payment, and each student's details and dues. A pure function
// (no browser), tested in report.test.mjs; the dashboard writes its result to .xlsx with write-excel-file.
import { feeStatus, monthLabel, nextMonths, rupees, type Student } from "./fees.ts";

const bold = (value: string | number) => ({ value, fontWeight: "bold" as const });
const money = (value: number) => ({ value, format: "#,##0" });
// The library counts days from the UTC time, so a date at UTC midnight lands on the right day in any time zone.
const day = (date: string) => ({ value: new Date(`${date}T00:00:00Z`), type: Date, format: "dd/mm/yyyy" });
const widths = (...w: number[]) => w.map((width) => ({ width }));

export function yearReport(students: Student[], year: number, today: string) {
  const payments = students
    .flatMap((s) => s.enrollments.flatMap((e) => e.payments.filter((p) => p.paid_on.startsWith(`${year}-`)).map((p) => ({ s, e, p }))))
    .sort((a, b) => a.p.paid_on.localeCompare(b.p.paid_on) || a.s.name.localeCompare(b.s.name));
  const sum = (list: typeof payments) => list.reduce((n, { p }) => n + p.amount, 0);
  const months = nextMonths(`${year}-01-01`, 12).map((month) => [month, payments.filter(({ p }) => p.paid_on.slice(0, 7) === month.slice(0, 7))] as const);

  return [
    {
      sheet: "Monthly",
      columns: widths(14, 18, 10),
      stickyRowsCount: 1,
      data: [
        [bold("Month"), bold("Fees received (₹)"), bold("Payments")],
        ...months.map(([month, list]) => [monthLabel(month), money(sum(list)), list.length]),
        [bold(`Total ${year}`), { ...money(sum(payments)), fontWeight: "bold" as const }, bold(payments.length)],
      ],
    },
    {
      sheet: "Payments",
      columns: widths(12, 10, 22, 14, 18, 10, 20, 26, 12, 12, 10, 24),
      stickyRowsCount: 1,
      data: [
        ["Date", "Month", "Student", "Phone", "Parent", "Class", "Course", "Course group", "Amount (₹)", "For month", "Paid by", "Note"].map(bold),
        ...payments.map(({ s, e, p }) => [
          day(p.paid_on),
          monthLabel(`${p.paid_on.slice(0, 7)}-01`),
          s.name,
          s.phone,
          s.guardian_name,
          s.class_level,
          e.course,
          e.category,
          money(p.amount),
          p.for_month ? monthLabel(p.for_month) : e.fee_type === "course" ? "Course fee" : null,
          p.method,
          p.note,
        ]),
      ],
    },
    {
      sheet: "Students",
      columns: widths(22, 14, 18, 10, 8, 12, 40, 14, 14, 12, 14, 30, 30),
      stickyRowsCount: 1,
      data: [
        ["Name", "Phone", "Parent", "Class", "Status", "Started", "Courses and fees", `Paid in ${year} (₹)`, "Paid in all (₹)", "Overdue (₹)", "Balance left (₹)", "Months unpaid", "Notes"].map(bold),
        ...students.map((s) => {
          const fees = s.enrollments.map((e) => ({ e, st: feeStatus(e, today) }));
          const started = s.enrollments.map((e) => e.started_on).sort()[0];
          return [
            s.name,
            s.phone,
            s.guardian_name,
            s.class_level,
            s.active ? "Active" : "Left",
            started ? day(started) : null,
            fees.map(({ e }) => `${e.course}: ${rupees(e.fee_amount)}${e.fee_type === "monthly" ? "/month" : " course"}${e.active ? "" : " (stopped)"}`).join("; ") || null,
            money(sum(payments.filter((x) => x.s === s))),
            money(fees.reduce((n, { st }) => n + st.paid, 0)),
            money(fees.reduce((n, { st }) => n + (st.overdue ? st.balance : 0), 0)),
            money(fees.reduce((n, { st }) => n + st.balance, 0)),
            fees.flatMap(({ e, st }) => st.unpaidMonths.map((m) => `${e.course} ${monthLabel(m)}`)).join(", ") || null,
            s.notes,
          ];
        }),
      ],
    },
  ];
}
