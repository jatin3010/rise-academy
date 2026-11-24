// Turns rows from an uploaded Excel/CSV sheet into students and courses for the CRM, with a reason for every row it
// cannot use. Pure functions (no browser or database), tested in import.test.mjs.
import { COURSES } from "./courses.ts";
import { localToday, normalizePhone, studentKey as key, type EnrollmentValues, type Student, type StudentValues } from "./fees.ts";

export type Cell = string | number | boolean | Date | null | undefined;
export type ImportPlan = {
  students: { student: StudentValues & { id: string }; enrollments: (EnrollmentValues & { student_id: string })[] }[];
  errors: { row: number; message: string }[];
  skipped: number; // rows for students already in the CRM
};

// The columns of the blank template; headers are matched loosely, so "Mobile" or "Father name" also work.
export const TEMPLATE_HEADERS = ["Name", "Phone", "Parent", "Class", "Course", "Fee type", "Fee amount", "Due day", "Next due date", "Start date", "Notes"];

const COLUMNS = {
  name: ["name", "studentname", "student"],
  phone: ["phone", "mobile", "whatsapp", "phonenumber", "mobilenumber", "whatsappnumber", "contact"],
  parent: ["parent", "guardian", "parentname", "guardianname", "fathername", "mothername"],
  class: ["class", "classlevel", "grade", "standard"],
  course: ["course", "subject", "coursename"],
  feeType: ["feetype", "type", "paymenttype"],
  fee: ["feeamount", "fee", "fees", "amount", "totalfee", "monthlyfee"],
  dueDay: ["dueday", "feedueday"],
  nextDue: ["nextduedate", "nextdue", "duedate", "nextinstalment", "nextinstallment"],
  start: ["startdate", "startedon", "joiningdate", "joined", "admissiondate", "dateofjoining"],
  notes: ["notes", "note", "remarks", "comments"],
} as const;
const REQUIRED = { name: "Name", phone: "Phone", course: "Course", fee: "Fee amount" } as const; // field → template heading

// Excel dates have no time zone; the reader gives them as UTC midnight, so read the UTC day (correct in any time zone).
const utcDay = (d: Date) => d.toISOString().slice(0, 10);
const text = (cell: Cell) => (cell instanceof Date ? utcDay(cell) : String(cell ?? "")).trim();

// Accepts Excel dates, 'YYYY-MM-DD', and the Indian 'DD/MM/YYYY' (also with - or .); returns 'YYYY-MM-DD' or null.
export function parseDate(cell: Cell): string | null {
  if (cell instanceof Date) return utcDay(cell);
  if (typeof cell === "number" && cell > 20000) return utcDay(new Date(Date.UTC(1899, 11, 30) + cell * 86400000)); // Excel day count
  const s = text(cell);
  let y: number, m: number, d: number;
  let match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  else if ((match = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/))) {
    [d, m, y] = [Number(match[1]), Number(match[2]), Number(match[3])];
    if (y < 100) y += 2000;
  } else return null;
  const date = new Date(y, m - 1, d);
  return date.getMonth() === m - 1 && date.getDate() === d ? localToday(date) : null;
}

export function planImport(rows: Cell[][], existing: Pick<Student, "name" | "phone">[]): ImportPlan {
  const plan: ImportPlan = { students: [], errors: [], skipped: 0 };
  const header = (rows[0] ?? []).map((h) => text(h).toLowerCase().replace(/[^a-z]/g, ""));
  const col = Object.fromEntries(
    Object.entries(COLUMNS).map(([field, names]) => [field, header.findIndex((h) => (names as readonly string[]).includes(h))]),
  ) as Record<keyof typeof COLUMNS, number>;
  const missing = Object.entries(REQUIRED).filter(([field]) => col[field as keyof typeof COLUMNS] < 0);
  if (missing.length) {
    plan.errors.push({ row: 1, message: `Missing column: ${missing.map(([, heading]) => heading).join(", ")}. Use the template's headings.` });
    return plan;
  }

  const known = new Set(existing.map((s) => key(s.name, s.phone)));
  const byStudent = new Map<string, ImportPlan["students"][number]>();
  const today = localToday();

  rows.slice(1).forEach((row, i) => {
    const rowNo = i + 2; // as Excel numbers rows: the heading is row 1
    const get = (field: keyof typeof COLUMNS) => (col[field] >= 0 ? row[col[field]] : null);
    if (row.every((cell) => text(cell) === "")) return;
    const fail = (message: string) => plan.errors.push({ row: rowNo, message });

    const name = text(get("name"));
    const phone = text(get("phone"));
    if (!name) return fail("Name is empty.");
    if (!normalizePhone(phone)) return fail(`"${phone || "(empty)"}" is not a valid 10-digit Indian mobile number.`);
    if (known.has(key(name, phone))) return void plan.skipped++;

    const courseName = text(get("course")).toLowerCase();
    const group = COURSES.find((g) => g.items.some((item) => item.toLowerCase() === courseName));
    const course = group?.items.find((item) => item.toLowerCase() === courseName);
    if (!group || !course) return fail(`Unknown course "${text(get("course"))}". Use a course name exactly as listed.`);

    const typeText = text(get("feeType")).toLowerCase();
    const fee_type = /month/.test(typeText) ? "monthly" : /course|one|total|instal|install/.test(typeText) ? "course" : group.feeType;
    if (!text(get("fee"))) return fail("Fee amount is empty."); // a blank cell would otherwise read as a ₹0 (free) course
    const fee_amount = Number(text(get("fee")).replace(/[₹,\s]|rs\.?/gi, ""));
    if (!Number.isInteger(fee_amount) || fee_amount < 0) return fail(`Fee amount "${text(get("fee"))}" must be a whole number of rupees.`);

    const dueText = text(get("dueDay"));
    const due_day = fee_type === "monthly" ? (dueText ? Number(dueText) : 5) : null;
    if (due_day !== null && !(Number.isInteger(due_day) && due_day >= 1 && due_day <= 28)) return fail(`Due day "${dueText}" must be from 1 to 28.`);
    const nextDueCell = get("nextDue");
    const next_due_on = fee_type === "course" && text(nextDueCell) ? parseDate(nextDueCell) : null;
    if (fee_type === "course" && text(nextDueCell) && !next_due_on) return fail(`Next due date "${text(nextDueCell)}" is not a date (use DD/MM/YYYY).`);
    const startCell = get("start");
    const started_on = text(startCell) ? parseDate(startCell) : today;
    if (!started_on) return fail(`Start date "${text(startCell)}" is not a date (use DD/MM/YYYY).`);

    // Several rows for the same student (same name and phone) become one student with several courses.
    const k = key(name, phone);
    let entry = byStudent.get(k);
    if (!entry) {
      entry = {
        student: {
          id: crypto.randomUUID(),
          name,
          phone,
          guardian_name: text(get("parent")) || null,
          class_level: text(get("class")) || null,
          notes: text(get("notes")) || null,
        },
        enrollments: [],
      };
      byStudent.set(k, entry);
      plan.students.push(entry);
    }
    entry.enrollments.push({ student_id: entry.student.id, category: group.title, course, fee_type, fee_amount, due_day, next_due_on, started_on });
  });
  return plan;
}

// Minimal CSV reader (quotes, commas and line breaks inside quotes, Excel's BOM) for sheets saved as .csv.
export function parseCsv(input: string): string[][] {
  const textIn = input.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const endField = () => {
    row.push(field);
    field = "";
  };
  for (let i = 0; i < textIn.length; i++) {
    const ch = textIn[i];
    if (quoted) {
      if (ch !== '"') {
        field += ch;
      } else if (textIn[i + 1] === '"') {
        field += '"'; // "" inside quotes is a literal quote
        i++;
      } else {
        quoted = false;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      endField();
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && textIn[i + 1] === "\n") i++;
      endField();
      rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field || row.length) {
    endField();
    rows.push(row);
  }
  return rows;
}
