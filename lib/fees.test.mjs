// Run with: npm test  (Node 24 loads the .ts file directly)
import { test } from "node:test";
import assert from "node:assert/strict";
import { dueMonths, feeStatus, nextMonths, normalizePhone, reminderText, waLink } from "./fees.ts";

test("advance months roll over the year", () => {
  assert.deepEqual(nextMonths("2026-11-23", 3), ["2026-11-01", "2026-12-01", "2027-01-01"]);
});

const monthly = (over = {}) => ({
  id: "e1", student_id: "s1", category: "School Tuition", course: "Mathematics", fee_type: "monthly",
  fee_amount: 1500, due_day: 5, next_due_on: null, started_on: "2026-01-20", ended_on: null, active: true, payments: [], ...over,
});
const pay = (amount, for_month = null) => ({ id: "p", enrollment_id: "e1", amount, paid_on: "2026-01-20", for_month, method: null, note: null });

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
});
