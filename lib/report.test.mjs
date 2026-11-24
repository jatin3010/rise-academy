// Run with: npm test  (Node 24 loads the .ts file directly)
import { test } from "node:test";
import assert from "node:assert/strict";
import { yearReport } from "./report.ts";

const pay = (amount, paid_on, for_month = null) => ({ id: paid_on, enrollment_id: "e", amount, paid_on, for_month, method: "Cash", note: null });
const enr = (o) => ({ id: "e", student_id: "s", category: "School Tuition", course: "Mathematics", fee_type: "monthly", fee_amount: 1500, due_day: 5, next_due_on: null, started_on: "2026-01-10", ended_on: null, active: true, payments: [], ...o });
const students = [
  { id: "s1", name: "Asha", phone: "9876543210", guardian_name: "Mr. Sharma", class_level: "Class 8", notes: null, active: true, created_at: "2026-01-10",
    enrollments: [enr({ payments: [pay(1500, "2026-01-12", "2026-01-01"), pay(1500, "2026-02-03", "2026-02-01"), pay(1500, "2025-12-30", "2026-03-01")] })] },
  { id: "s2", name: "Rahul", phone: "9811122233", guardian_name: null, class_level: null, notes: "Batch B", active: false, created_at: "2026-01-01",
    enrollments: [enr({ course: "IELTS", category: "Spoken English & Personal Growth", fee_type: "course", fee_amount: 12000, due_day: null, next_due_on: "2026-02-01", started_on: "2026-01-05", active: false, payments: [pay(5000, "2026-01-05")] })] },
];
const [monthly, payments, people] = yearReport(students, 2026, "2026-03-20");
const values = (row) => row.map((c) => (c && typeof c === "object" && "value" in c ? c.value : c));

test("monthly sheet: 12 months of the year and a total, other years left out", () => {
  assert.equal(monthly.data.length, 14); // heading, Jan–Dec, total
  assert.deepEqual(values(monthly.data[1]), ["Jan 2026", 6500, 2]);
  assert.deepEqual(values(monthly.data[2]), ["Feb 2026", 1500, 1]);
  assert.deepEqual(values(monthly.data[13]), ["Total 2026", 8000, 3]); // the Dec 2025 payment is not in 2026
});

test("payments sheet: in date order, dates at UTC midnight, course fees marked", () => {
  assert.deepEqual(payments.data.slice(1).map((r) => r[2]), ["Rahul", "Asha", "Asha"]);
  assert.equal(payments.data[1][0].value.toISOString(), "2026-01-05T00:00:00.000Z");
  assert.equal(payments.data[1][9], "Course fee");
  assert.equal(payments.data[2][9], "Jan 2026");
});

test("students sheet: paid this year, paid in all, overdue and unpaid months", () => {
  const asha = values(people.data[1]);
  assert.equal(asha[4], "Active");
  assert.equal(asha[6], "Mathematics: ₹1,500/month");
  assert.deepEqual(asha.slice(7, 12), [3000, 4500, 0, 0, null]); // Jan–Mar are paid (March in advance, last December)
  const rahul = values(people.data[2]);
  assert.equal(rahul[4], "Left");
  assert.deepEqual(rahul.slice(7, 12), [5000, 5000, 7000, 7000, null]); // the instalment was due 1 Feb
  assert.equal(rahul[12], "Batch B");
});
