// Run with: npm test  (Node 24 loads the .ts file directly)
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCsv, parseDate, planImport, TEMPLATE_HEADERS } from "./import.ts";

const sheet = (...rows) => [TEMPLATE_HEADERS, ...rows];
// Name, Phone, Parent, Class, Course, Fee type, Fee amount, Due day, Next due date, Start date, Notes
const asha = ["Asha Sharma", 9876543210, "Mr. Sharma", "Class 8", "Mathematics", "", 1500, "", "", "01/04/2026", ""];

test("a good row becomes a student with one course, using the course group's usual fee type", () => {
  const plan = planImport(sheet(asha), []);
  assert.deepEqual(plan.errors, []);
  assert.equal(plan.students.length, 1);
  const { student, enrollments } = plan.students[0];
  assert.equal(student.phone, "9876543210"); // a number cell from Excel is kept as text
  assert.deepEqual(enrollments, [
    { student_id: student.id, category: "School Tuition", course: "Mathematics", fee_type: "monthly", fee_amount: 1500, due_day: 5, next_due_on: null, started_on: "2026-04-01" },
  ]);
});

test("two rows for the same student become one student with two courses", () => {
  const plan = planImport(sheet(asha, ["asha sharma", "098765 43210", "", "", "science", "Monthly", "₹1,200", 10, "", "", ""]), []);
  assert.equal(plan.students.length, 1);
  assert.deepEqual(plan.students[0].enrollments.map((e) => [e.course, e.fee_amount, e.due_day]), [["Mathematics", 1500, 5], ["Science", 1200, 10]]);
});

test("course fees take a next due date; students already in the CRM are skipped", () => {
  const rahul = ["Rahul Verma", "98111 22233", "", "", "IELTS", "Course fee", "12,000", "", "15-05-2026", "", "Batch B"];
  const plan = planImport(sheet(rahul, asha), [{ name: "Asha Sharma", phone: "+91 98765 43210" }]);
  assert.equal(plan.skipped, 1);
  assert.equal(plan.students.length, 1);
  assert.deepEqual(plan.students[0].enrollments[0].next_due_on, "2026-05-15");
  assert.equal(plan.students[0].enrollments[0].due_day, null);
});

test("bad rows are reported with their Excel row number, good rows still import", () => {
  const plan = planImport(sheet(asha, ["Ravi", "12345", ...asha.slice(2)], ["Neha", "9811111111", "", "", "Karate", "", 500], ["Om", "9822222222", "", "", "Tally", "monthly", 900, 31]), []);
  assert.equal(plan.students.length, 1);
  assert.deepEqual(plan.errors.map((e) => e.row), [3, 4, 5]);
  assert.match(plan.errors[1].message, /Unknown course "Karate"/);
});

test("missing required columns stop the import with a clear message", () => {
  const plan = planImport([["Name", "Phone"], ["Asha", "9876543210"]], []);
  assert.equal(plan.students.length, 0);
  assert.match(plan.errors[0].message, /^Missing column: Course, Fee amount\./);
});

test("dates: Excel dates, Excel day numbers, DD/MM/YYYY and YYYY-MM-DD; impossible dates rejected", () => {
  assert.equal(parseDate(new Date(Date.UTC(2026, 3, 1))), "2026-04-01"); // how the Excel reader returns date cells
  assert.equal(parseDate(46113), "2026-04-01"); // Excel's day count for 1 Apr 2026
  assert.equal(parseDate("1/4/26"), "2026-04-01");
  assert.equal(parseDate("2026-04-01"), "2026-04-01");
  assert.equal(parseDate("31/02/2026"), null);
  assert.equal(parseDate("next week"), null);
});

test("CSV: quotes, commas and line breaks inside quotes, Excel's BOM", () => {
  assert.deepEqual(parseCsv('﻿Name,Notes\r\n"Asha, S.","said ""hi""\nthere"\r\n'), [
    ["Name", "Notes"],
    ["Asha, S.", 'said "hi"\nthere'],
  ]);
});
