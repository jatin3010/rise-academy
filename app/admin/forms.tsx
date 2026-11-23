"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COURSES } from "@/lib/courses";
import {
  feeStatus,
  localToday,
  monthLabel,
  nextMonths,
  normalizePhone,
  paidFor,
  rupees,
  type Enrollment,
  type Student,
} from "@/lib/fees";

export type StudentValues = Pick<Student, "name" | "phone" | "guardian_name" | "class_level" | "notes">;
export type EnrollmentValues = Pick<
  Enrollment,
  "category" | "course" | "fee_type" | "fee_amount" | "due_day" | "next_due_on" | "started_on"
>;
export type PaymentValues = { amount: number; paid_on: string; for_month: string | null; method: string; note: string | null };
// Each form hands its values to the page, which saves them and returns an error message or null.
type Save<T> = (values: T) => Promise<string | null>;

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const text = (f: FormData, name: string) => String(f.get(name) ?? "").trim();

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Label className="grid gap-1.5 font-normal text-white/70">
      {label}
      {children}
    </Label>
  );
}

function useSubmit<T>(read: (f: FormData) => T | string, save: Save<T>) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = read(new FormData(event.currentTarget));
    if (typeof values === "string") return setError(values);
    setBusy(true);
    setError((await save(values)) ?? "");
    setBusy(false);
  }
  return { error, busy, onSubmit };
}

function Footer({ error, busy, label, onCancel }: { error: string; busy: boolean; label: string; onCancel: () => void }) {
  return (
    <>
      {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={busy}>{busy ? "Saving…" : label}</Button>
      </div>
    </>
  );
}

function readEnrollment(f: FormData): EnrollmentValues | string {
  const fee_type = text(f, "fee_type") === "monthly" ? "monthly" : "course";
  const fee_amount = Number(text(f, "fee_amount"));
  if (!Number.isInteger(fee_amount) || fee_amount < 0) return "Enter the fee in whole rupees.";
  const due_day = fee_type === "monthly" ? Number(text(f, "due_day")) : null;
  if (due_day !== null && !(Number.isInteger(due_day) && due_day >= 1 && due_day <= 28)) return "The due day must be from 1 to 28.";
  return {
    category: text(f, "category"),
    course: text(f, "course"),
    fee_type,
    fee_amount,
    due_day,
    next_due_on: fee_type === "course" ? text(f, "next_due_on") || null : null,
    started_on: text(f, "started_on") || localToday(),
  };
}

function EnrollmentFields({ enrollment }: { enrollment?: Enrollment }) {
  const [category, setCategory] = useState<string>(enrollment?.category ?? COURSES[0].title);
  const [feeType, setFeeType] = useState<string>(enrollment?.fee_type ?? COURSES[0].feeType);
  const group = COURSES.find((c) => c.title === category);
  return (
    <>
      <Field label="Course group">
        <select
          name="category"
          value={category}
          className={selectClass}
          onChange={(e) => {
            setCategory(e.target.value);
            setFeeType(COURSES.find((c) => c.title === e.target.value)?.feeType ?? "course");
          }}
        >
          {COURSES.map((c) => <option key={c.title}>{c.title}</option>)}
        </select>
      </Field>
      <Field label="Course">
        {/* key resets the choice when the group changes */}
        <select key={category} name="course" defaultValue={enrollment?.course} className={selectClass}>
          {group?.items.map((item) => <option key={item}>{item}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Fee type">
          <select name="fee_type" value={feeType} onChange={(e) => setFeeType(e.target.value)} className={selectClass}>
            <option value="monthly">Monthly</option>
            <option value="course">Course fee</option>
          </select>
        </Field>
        <Field label={feeType === "monthly" ? "Fee per month (₹)" : "Total course fee (₹)"}>
          <Input name="fee_amount" type="number" inputMode="numeric" min={0} step={1} required defaultValue={enrollment?.fee_amount} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {feeType === "monthly" ? (
          <Field label="Fee due on day (1–28)">
            <Input name="due_day" type="number" min={1} max={28} required defaultValue={enrollment?.due_day ?? 5} />
          </Field>
        ) : (
          <Field label="Next instalment due">
            <Input name="next_due_on" type="date" defaultValue={enrollment?.next_due_on ?? ""} />
          </Field>
        )}
        <Field label="Started on">
          <Input name="started_on" type="date" required defaultValue={enrollment?.started_on ?? localToday()} />
        </Field>
      </div>
    </>
  );
}

export function StudentForm({
  student,
  onSave,
  onCancel,
}: {
  student?: Student;
  onSave: Save<{ student: StudentValues; enrollment: EnrollmentValues | null }>;
  onCancel: () => void;
}) {
  const { error, busy, onSubmit } = useSubmit((f) => {
    const values: StudentValues = {
      name: text(f, "name"),
      phone: text(f, "phone"),
      guardian_name: text(f, "guardian_name") || null,
      class_level: text(f, "class_level") || null,
      notes: text(f, "notes") || null,
    };
    if (!values.name) return "Enter the student's name.";
    if (!normalizePhone(values.phone)) return "Enter a valid 10-digit Indian mobile number.";
    const enrollment = student ? null : readEnrollment(f);
    if (typeof enrollment === "string") return enrollment;
    return { student: values, enrollment };
  }, onSave);

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field label="Student name *">
        <Input name="name" required autoFocus defaultValue={student?.name} />
      </Field>
      <Field label="WhatsApp number *">
        <Input name="phone" type="tel" inputMode="tel" required placeholder="98765 43210" defaultValue={student?.phone} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Parent / guardian">
          <Input name="guardian_name" defaultValue={student?.guardian_name ?? ""} />
        </Field>
        <Field label="Class (school tuition)">
          <Input name="class_level" placeholder="e.g. Class 8" defaultValue={student?.class_level ?? ""} />
        </Field>
      </div>
      {!student && <EnrollmentFields />}
      <Field label="Notes">
        <textarea name="notes" rows={2} defaultValue={student?.notes ?? ""} className={`${selectClass} h-auto py-1.5`} />
      </Field>
      <Footer error={error} busy={busy} label={student ? "Save changes" : "Add student"} onCancel={onCancel} />
    </form>
  );
}

export function EnrollmentForm({
  enrollment,
  onSave,
  onCancel,
}: {
  enrollment?: Enrollment;
  onSave: Save<EnrollmentValues>;
  onCancel: () => void;
}) {
  const { error, busy, onSubmit } = useSubmit(readEnrollment, onSave);
  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <EnrollmentFields enrollment={enrollment} />
      <Footer error={error} busy={busy} label={enrollment ? "Save changes" : "Add course"} onCancel={onCancel} />
    </form>
  );
}

export function PaymentForm({
  enrollment,
  onSave,
  onCancel,
}: {
  enrollment: Enrollment;
  onSave: Save<{ payment: PaymentValues; next_due_on: string | null }>;
  onCancel: () => void;
}) {
  const today = localToday();
  const monthly = enrollment.fee_type === "monthly";
  const status = feeStatus(enrollment, today);
  // Unpaid or part-paid months first (oldest first), then the next few months for fees paid in advance.
  const left = (m: string) => enrollment.fee_amount - paidFor(enrollment, m);
  const months = [...new Set([...status.unpaidMonths, ...nextMonths(today, 3)])].filter((m) => left(m) > 0);

  const { error, busy, onSubmit } = useSubmit((f) => {
    const amount = Number(text(f, "amount"));
    if (!Number.isInteger(amount) || amount <= 0) return "Enter the amount paid in whole rupees.";
    const for_month = monthly ? text(f, "for_month") || null : null;
    if (monthly && !for_month) return "Choose the month this payment is for.";
    return {
      payment: { amount, paid_on: text(f, "paid_on") || today, for_month, method: text(f, "method"), note: text(f, "note") || null },
      next_due_on: monthly ? null : text(f, "next_due_on") || null,
    };
  }, onSave);

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Amount paid (₹)">
          <Input
            name="amount"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            required
            autoFocus
            defaultValue={monthly ? (months[0] ? left(months[0]) : enrollment.fee_amount) : status.balance || undefined}
          />
        </Field>
        <Field label="Paid on">
          <Input name="paid_on" type="date" required defaultValue={today} />
        </Field>
      </div>
      {monthly ? (
        <Field label="For month">
          <select name="for_month" className={selectClass}>
            {months.map((m) => (
              <option key={m} value={m}>
                {monthLabel(m)}
                {left(m) < enrollment.fee_amount && ` (${rupees(left(m))} left)`}
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <Field label="Next instalment due (leave empty if fully paid)">
          <Input name="next_due_on" type="date" defaultValue={enrollment.next_due_on ?? ""} />
        </Field>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Paid by">
          <select name="method" className={selectClass}>
            {["Cash", "UPI", "Bank transfer", "Cheque", "Other"].map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Note">
          <Input name="note" placeholder="Receipt no., etc." />
        </Field>
      </div>
      <Footer error={error} busy={busy} label="Record payment" onCancel={onCancel} />
    </form>
  );
}
