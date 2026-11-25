// Run with: npm test  (Node 24 loads the .ts file directly)
import { test } from "node:test";
import assert from "node:assert/strict";
import { changeMonthlyFee, dueMonths, feeStatus, monthlyTotals, nextMonths, normalizePhone, payableMonths, paymentProblem, reminderText, studentKey, waLink, welcomeText } from "./fees.ts";

test("the same student is recognised however the name and number were typed", () => {
  assert.equal(studentKey(" Asha  Sharma ", "098765 43210"), studentKey("asha sharma", "+91 98765-43210"));
  assert.notEqual(studentKey("Asha Sharma", "9876543210"), studentKey("Asha Sharma", "9876543211"));
});

test("advance months roll over the year, both ways", () => {
  assert.deepEqual(nextMonths("2026-11-23", 3), ["2026-11-01", "2026-12-01", "2027-01-01"]);
  assert.deepEqual(nextMonths("2026-02-10", 3, -2), ["2025-12-01", "2026-01-01", "2026-02-01"]);
});

const monthly = (over = {}) => ({
  id: "e1", student_id: "s1", category: "School Tuition", course: "Mathematics", fee_type: "monthly",
  fee_amount: 1500, due_day: 5, next_due_on: null, started_on: "2026-01-20", ended_on: null, active: true, payments: [], ...over,
});
const pay = (amount, for_month = null) => ({ id: "p", enrollment_id: "e1", amount, paid_on: "2026-01-20", for_month, method: null, note: null });

test("dashboard charts: students studying and fees received per month", () => {
  const students = [
    { enrollments: [monthly({ payments: [pay(1500, "2026-01-01"), { ...pay(1500, "2026-02-01"), paid_on: "2026-02-28" }] })] }, // from 20 Jan
    { enrollments: [monthly({ started_on: "2025-12-01", ended_on: "2026-01-31", payments: [] })] }, // left at the end of Jan
    { enrollments: [monthly({ started_on: "2026-03-01" })] }, // joins in March
  ];
  assert.deepEqual(monthlyTotals(students, nextMonths("2026-03-15", 3, -2)), [
    { month: "2026-01-01", studying: 2, collected: 1500 },
    { month: "2026-02-01", studying: 1, collected: 1500 },
    { month: "2026-03-01", studying: 2, collected: 0 },
  ]);
});

test("monthly: joining month is owed at once, later months from their due day", () => {
  assert.deepEqual(dueMonths("2026-01-20", 5, "2026-03-04"), ["2026-01-01", "2026-02-01"]);
  assert.deepEqual(dueMonths("2026-01-20", 5, "2026-03-05"), ["2026-01-01", "2026-02-01", "2026-03-01"]);
  assert.deepEqual(dueMonths("2026-03-02", 5, "2026-03-02"), ["2026-03-01"]);
  assert.deepEqual(dueMonths("2026-04-01", 5, "2026-03-31"), []);
  assert.deepEqual(dueMonths("2025-12-10", 1, "2026-01-01"), ["2025-12-01", "2026-01-01"]);
});

test("monthly: balance counts only months with no payment", () => {
  const s = feeStatus(monthly({ payments: [pay(1500, "2026-02-01")] }), "2026-03-04");
  assert.deepEqual(s.unpaidMonths, ["2026-01-01"]);
  assert.equal(s.balance, 1500);
  assert.equal(s.overdue, true);
  assert.equal(feeStatus(monthly({ payments: [pay(1500, "2026-01-01"), pay(1500, "2026-02-01")] }), "2026-03-04").overdue, false);
});

test("monthly: a part-paid month stays due for the rest", () => {
  const part = feeStatus(monthly({ payments: [pay(500, "2026-01-01")] }), "2026-01-25");
  assert.deepEqual(part.unpaidMonths, ["2026-01-01"]);
  assert.equal(part.balance, 1000);
  const full = feeStatus(monthly({ payments: [pay(500, "2026-01-01"), pay(1000, "2026-01-01")] }), "2026-01-25");
  assert.equal(full.overdue, false);
});

test("monthly: no new dues after the course stops, old dues stay", () => {
  const stopped = monthly({ active: false, ended_on: "2026-02-03" }); // stopped before Feb's due day
  assert.deepEqual(feeStatus(stopped, "2026-06-20").unpaidMonths, ["2026-01-01"]);
  const paid = monthly({ active: false, ended_on: "2026-02-10", payments: [pay(1500, "2026-01-01"), pay(1500, "2026-02-01")] });
  assert.equal(feeStatus(paid, "2026-06-20").balance, 0);
});

test("course fee: balance is fee minus payments, overdue only after the next due date", () => {
  const e = monthly({ fee_type: "course", fee_amount: 10000, due_day: null, next_due_on: "2026-03-01", payments: [pay(4000)] });
  assert.deepEqual(feeStatus(e, "2026-02-28"), { balance: 6000, overdue: false, unpaidMonths: [], paid: 4000 });
  assert.equal(feeStatus(e, "2026-03-01").overdue, true);
  assert.equal(feeStatus({ ...e, payments: [pay(10000)] }, "2026-04-01").overdue, false);
  assert.equal(feeStatus({ ...e, payments: [pay(12000)] }, "2026-04-01").balance, 0);
});

test("phone numbers are normalised for WhatsApp, junk is rejected", () => {
  assert.equal(normalizePhone("070424 81547"), "917042481547");
  assert.equal(normalizePhone("+91 70424-81547"), "917042481547");
  assert.equal(normalizePhone("7042481547"), "917042481547");
  assert.equal(normalizePhone("12345"), null);
  assert.equal(normalizePhone("1234567890"), null);
});

test("reminder names the unpaid months and amount", () => {
  const e = monthly();
  const text = reminderText({ name: "Asha" }, e, feeStatus(e, "2026-02-05"));
  assert.match(text, /₹3,000 for Jan 2026, Feb 2026/);
  assert.ok(waLink("7042481547", text).startsWith("https://wa.me/917042481547?text=Namaste%20Asha"));
  assert.doesNotMatch(text, /UPI/); // no UPI ID set yet
  const withUpi = reminderText({ name: "Asha" }, e, feeStatus(e, "2026-02-05"), "rise@okaxis");
  assert.match(withUpi, /pay at the academy or by UPI to rise@okaxis \(₹3,000\) at your convenience/);
});

test("a new monthly fee starts after the months already charged or paid; old months keep the old fee", () => {
  // Paid Jan-Nov 2026 at 1,500, and December in advance; the fee goes up to 1,800 on 24 Nov.
  const months = nextMonths("2026-01-01", 12);
  const old = monthly({ started_on: "2026-01-02", payments: months.map((m) => pay(1500, m)) });
  const { end, add } = changeMonthlyFee(old, { ...old, fee_amount: 1800 }, "2026-11-24");
  assert.deepEqual(end, { active: false, ended_on: "2026-12-31" });
  assert.equal(add.started_on, "2027-01-05");
  const later = "2027-02-10";
  assert.equal(feeStatus({ ...old, ...end }, later).balance, 0); // nothing re-priced
  assert.deepEqual(feeStatus(monthly({ ...add, payments: [] }), later).unpaidMonths, ["2027-01-01", "2027-02-01"]);
  assert.equal(feeStatus(monthly({ ...add, payments: [] }), later).balance, 3600);
  // Nothing paid ahead: the new fee starts next month.
  assert.equal(changeMonthlyFee(monthly(), { ...monthly(), fee_amount: 1800 }, "2026-11-24").add.started_on, "2026-12-05");
});

test("the welcome message only names courses when there are some", () => {
  assert.match(welcomeText({ name: "Asha" }, ["Mathematics"]), /enrolled in Mathematics\. We are happy/);
  assert.doesNotMatch(welcomeText({ name: "Asha" }, []), /enrolled in/);
});

test("a stopped course, a non-monthly fee or an unchanged fee is edited in place, never split", () => {
  // Left on 3 Sep with nothing due: correcting the fee must not move the end date or start a new course.
  const left = monthly({ started_on: "2026-06-02", ended_on: "2026-09-03", active: false, payments: ["2026-06-01", "2026-07-01", "2026-08-01"].map((m) => pay(1500, m)) });
  assert.equal(changeMonthlyFee(left, { ...left, fee_amount: 1600 }, "2026-11-24"), null);
  assert.equal(changeMonthlyFee(monthly(), { ...monthly(), due_day: 10 }, "2026-11-24"), null);
  assert.equal(changeMonthlyFee(monthly(), { ...monthly(), fee_type: "course", fee_amount: 9000 }, "2026-11-24"), null);
});

test("payable months: unpaid and part-paid first, then advance months, never after the course ends", () => {
  const e = monthly({ started_on: "2026-09-01", payments: [pay(1500, "2026-09-01"), pay(500, "2026-10-01")] });
  assert.deepEqual(payableMonths(e, "2026-11-24"), ["2026-10-01", "2026-11-01", "2026-12-01", "2027-01-01"]);
  // The two halves of a fee change: the old fee ends 31 Dec, the new one starts 5 Jan; each takes only its own months.
  assert.deepEqual(payableMonths({ ...e, active: false, ended_on: "2026-12-31" }, "2026-11-24"), ["2026-10-01", "2026-11-01", "2026-12-01"]);
  assert.deepEqual(payableMonths(monthly({ fee_amount: 1800, started_on: "2027-01-05" }), "2026-11-24"), ["2027-01-01"]);
});

test("a payment is never more than what is owed for its month or course", () => {
  const today = "2026-11-24";
  const month = monthly({ started_on: "2026-09-01", payments: [pay(1500, "2026-09-01"), pay(500, "2026-10-01")] });
  assert.equal(paymentProblem(month, 1000, "2026-10-01", today), null); // exactly what's left
  assert.equal(paymentProblem(month, 1500, "2026-12-01", today), null); // a month in advance
  assert.match(paymentProblem(month, 3000, "2026-10-01", today), /^₹3,000 is more than the ₹1,000 left for Oct 2026\./);
  assert.equal(paymentProblem(month, 1500, null, today), "Choose the month this payment is for.");

  const course = monthly({ fee_type: "course", fee_amount: 12000, due_day: null, payments: [pay(5000)] });
  assert.equal(paymentProblem(course, 7000, null, today), null);
  assert.match(paymentProblem(course, 8000, null, today), /^₹8,000 is more than the ₹7,000 left on this course\./);
  assert.equal(paymentProblem({ ...course, payments: [pay(12000)] }, 500, null, today), "This course is already fully paid.");
});
