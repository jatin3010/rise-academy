"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { COURSES } from "@/lib/courses";
import {
  dateLabel,
  feeStatus,
  localToday,
  monthLabel,
  reminderText,
  rupees,
  waLink,
  welcomeText,
  type Enrollment,
  type FeeStatus,
  type Student,
} from "@/lib/fees";
import { supabase } from "@/lib/supabase";
import { EnrollmentForm, PaymentForm, StudentForm } from "./forms";

type Panel =
  | { kind: "addStudent" }
  | { kind: "editStudent"; student: Student }
  | { kind: "addCourse"; student: Student }
  | { kind: "editCourse"; student: Student; enrollment: Enrollment }
  | { kind: "payment"; student: Student; enrollment: Enrollment }
  | null;

const waButton = "inline-flex h-7 items-center rounded-lg bg-[#00a884] px-2.5 text-xs font-medium text-[#0b141a] hover:opacity-90";

export default function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabase) return <SetupNeeded />;
  if (session === undefined) return <Shell><p className="text-white/60">Loading…</p></Shell>;
  if (!session) return <Login />;
  return <Dashboard email={session.user.email ?? ""} />;
}

function Shell({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">{children}</main>;
}

function SetupNeeded() {
  return (
    <Shell>
      <h1 className="text-2xl font-semibold">Admin is not connected yet</h1>
      <p className="mt-3 max-w-xl text-white/70">
        The student database (Supabase) has not been connected yet. Follow the steps in <code>supabase/README.md</code> in the
        website code, then deploy again.
      </p>
    </Shell>
  );
}

function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    setBusy(true);
    const { error } = await supabase!.auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    setBusy(false);
    if (error) setError(error.message);
  }
  return (
    <Shell>
      <Card className="mx-auto mt-10 max-w-sm gap-4 bg-neutral-900 p-6">
        <h1 className="text-xl font-semibold">Rise Academy admin</h1>
        <form onSubmit={onSubmit} className="grid gap-3">
          <Input name="email" type="email" autoComplete="email" placeholder="Email" required aria-label="Email" />
          <Input name="password" type="password" autoComplete="current-password" placeholder="Password" required aria-label="Password" />
          {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
          <Button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
        </form>
      </Card>
    </Shell>
  );
}

function Dashboard({ email }: { email: string }) {
  const db = supabase!;
  const today = localToday();
  const [students, setStudents] = useState<Student[] | null>(null);
  const [error, setError] = useState("");
  const [panel, setPanel] = useState<Panel>(null);
  const [welcome, setWelcome] = useState<{ name: string; phone: string; courses: string[] } | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [dueOnly, setDueOnly] = useState(false);

  const [version, setVersion] = useState(0);
  const reload = () => setVersion((v) => v + 1);

  // shortcut: loads every student with all fees and payments at once; fine for a few thousand students, page it beyond that.
  useEffect(() => {
    let current = true;
    db.from("students")
      .select("*, enrollments(*, payments(*))")
      .order("name")
      .then(({ data, error }) => {
        if (!current) return;
        if (error) setError(error.message);
        else setStudents(data as Student[]);
      });
    return () => {
      current = false;
    };
  }, [db, version]);

  // Runs a save, then closes the form and reloads; returns the error message for the form to show.
  async function save(work: () => Promise<string | null>) {
    const err = await work();
    if (!err) {
      setPanel(null);
      reload();
    }
    return err;
  }

  async function act(op: PromiseLike<{ error: { message: string } | null }>) {
    const { error } = await op;
    if (error) setError(error.message);
    else reload();
  }

  if (!students) {
    return <Shell>{error ? <p className="text-red-400">{error}</p> : <p className="text-white/60">Loading students…</p>}</Shell>;
  }

  const active = students.filter((s) => s.active);
  const rows = active.flatMap((s) => s.enrollments.filter((e) => e.active).map((e) => ({ s, e, st: feeStatus(e, today) })));
  const overdue = rows.filter((r) => r.st.overdue);
  const overdueStudents = new Set(overdue.map((r) => r.s.id)).size;
  const q = query.toLowerCase();
  const visible = students
    .filter((s) => !q || `${s.name} ${s.phone} ${s.guardian_name ?? ""}`.toLowerCase().includes(q))
    .filter((s) => !category || s.enrollments.some((e) => e.category === category))
    .filter((s) => !dueOnly || s.enrollments.some((e) => e.active && feeStatus(e, today).overdue))
    .sort((a, b) => Number(b.active) - Number(a.active));

  return (
    <Shell>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Rise Academy admin</h1>
          <p className="text-sm text-white/60">Signed in as {email}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setPanel({ kind: "addStudent" })}>+ Add student</Button>
          <Button variant="ghost" onClick={() => db.auth.signOut()}>Sign out</Button>
        </div>
      </header>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300" role="alert">
          {error} <button className="ml-2 underline" onClick={() => setError("")}>Dismiss</button>
        </p>
      )}

      {welcome && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-[#005c4b]/40 px-4 py-3 text-sm" role="status">
          <span>{welcome.name} was added.</span>
          <a className={waButton} href={waLink(welcome.phone, welcomeText(welcome, welcome.courses))} target="_blank" rel="noopener">
            Send welcome on WhatsApp
          </a>
          <button className="ml-auto text-white/60 underline" onClick={() => setWelcome(null)}>Close</button>
        </div>
      )}

      <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Summary">
        <Stat label="Active students" value={active.length} />
        <Stat label="Course enrolments" value={rows.length} />
        <Stat label="Students with fees due" value={overdueStudents} tone={overdueStudents ? "bad" : "good"} />
        <Stat label="Fees overdue" value={rupees(overdue.reduce((n, r) => n + r.st.balance, 0))} tone={overdue.length ? "bad" : "good"} />
      </section>

      <section className="mt-3 grid gap-3 md:grid-cols-3" aria-label="Students by course">
        {COURSES.map((group) => {
          const inGroup = rows.filter((r) => r.e.category === group.title);
          return (
            <Card key={group.title} className="gap-2 p-4">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-semibold">{group.title}</h2>
                <span className="text-2xl font-semibold">{inGroup.length}</span>
              </div>
              <ul className="grid gap-1 text-sm">
                {group.items.map((course) => {
                  const n = inGroup.filter((r) => r.e.course === course).length;
                  return (
                    <li key={course} className={`flex justify-between ${n ? "" : "text-white/40"}`}>
                      <button className="text-left hover:underline" onClick={() => { setCategory(group.title); setQuery(""); }}>
                        {course}
                      </button>
                      <span>{n}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </section>

      <section className="mt-8" aria-label="Students">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            className="h-9 max-w-xs"
            placeholder="Search name, phone, parent"
            aria-label="Search students"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            aria-label="Filter by course group"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All courses</option>
            {COURSES.map((c) => <option key={c.title}>{c.title}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={dueOnly} onChange={(e) => setDueOnly(e.target.checked)} /> Fees due only
          </label>
          <span className="text-sm text-white/50">{visible.length} shown</span>
        </div>

        {students.length === 0 && (
          <p className="mt-6 text-white/60">
            No students yet. Add your first one with “+ Add student”. (If you expected students here, check that your login was
            added as an admin — step 4 in <code>supabase/README.md</code>.)
          </p>
        )}

        <ul className="mt-4 grid gap-3">
          {visible.map((s) => (
            <li key={s.id}>
              <Card className={`gap-3 p-4 ${s.active ? "" : "opacity-60"}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">
                      {s.name} {s.class_level && <span className="font-normal text-white/60">· {s.class_level}</span>}
                      {!s.active && <Badge variant="secondary" className="ml-2">Left</Badge>}
                    </h3>
                    <p className="text-sm text-white/60">
                      {s.guardian_name && `${s.guardian_name} · `}
                      <a className="hover:underline" href={`tel:${s.phone}`}>{s.phone}</a>
                    </p>
                    {s.notes && <p className="mt-1 text-sm text-white/50">{s.notes}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <a
                      className={waButton}
                      href={waLink(s.phone, welcomeText(s, s.enrollments.filter((e) => e.active).map((e) => e.course)))}
                      target="_blank"
                      rel="noopener"
                    >
                      Welcome message
                    </a>
                    <Button size="sm" variant="outline" onClick={() => setPanel({ kind: "addCourse", student: s })}>Add course</Button>
                    <Button size="sm" variant="outline" onClick={() => setPanel({ kind: "editStudent", student: s })}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => act(db.from("students").update({ active: !s.active }).eq("id", s.id))}>
                      {s.active ? "Mark as left" : "Re-join"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => confirm(`Delete ${s.name} and all their fee records? This cannot be undone.`) && act(db.from("students").delete().eq("id", s.id))}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {s.enrollments.map((e) => {
                  const st = feeStatus(e, today);
                  return (
                    <div key={e.id} className={`rounded-lg bg-white/5 p-3 ${e.active ? "" : "opacity-60"}`}>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="secondary">{e.course}</Badge>
                        <span className="text-white/60">{e.category}</span>
                        <span className="text-white/60">
                          · {e.fee_type === "monthly" ? `${rupees(e.fee_amount)}/month, due by day ${e.due_day}` : `${rupees(e.fee_amount)} course, paid ${rupees(st.paid)}`}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
                        <FeeLine e={e} st={st} />
                        <span className="grow" />
                        {e.active && st.balance > 0 && (
                          <a className={waButton} href={waLink(s.phone, reminderText(s, e, st))} target="_blank" rel="noopener">
                            Send fee reminder
                          </a>
                        )}
                        <Button size="sm" onClick={() => setPanel({ kind: "payment", student: s, enrollment: e })}>Record payment</Button>
                        <Button size="sm" variant="outline" onClick={() => setPanel({ kind: "editCourse", student: s, enrollment: e })}>Edit fee</Button>
                        <Button size="sm" variant="ghost" onClick={() => act(db.from("enrollments").update({ active: !e.active }).eq("id", e.id))}>
                          {e.active ? "Stop course" : "Resume"}
                        </Button>
                      </div>
                      {e.payments.length > 0 && (
                        <details className="mt-2 text-sm">
                          <summary className="cursor-pointer text-white/60">Payment history ({e.payments.length})</summary>
                          <ul className="mt-1 grid gap-1">
                            {[...e.payments].sort((a, b) => b.paid_on.localeCompare(a.paid_on)).map((p) => (
                              <li key={p.id} className="flex flex-wrap gap-x-2 text-white/80">
                                <span>{dateLabel(p.paid_on)}</span>
                                <span className="font-medium">{rupees(p.amount)}</span>
                                {p.for_month && <span>for {monthLabel(p.for_month)}</span>}
                                {p.method && <span className="text-white/50">{p.method}</span>}
                                {p.note && <span className="text-white/50">· {p.note}</span>}
                                <button
                                  className="text-red-300 hover:underline"
                                  onClick={() => confirm("Delete this payment?") && act(db.from("payments").delete().eq("id", p.id))}
                                >
                                  delete
                                </button>
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  );
                })}
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {panel && (
        <Modal title={panelTitle(panel)} onClose={() => setPanel(null)}>
          {panel.kind === "addStudent" && (
            <StudentForm
              onCancel={() => setPanel(null)}
              onSave={({ student, enrollment }) =>
                save(async () => {
                  const { data, error } = await db.from("students").insert(student).select("id").single();
                  if (error) return error.message;
                  if (enrollment) {
                    const { error: e2 } = await db.from("enrollments").insert({ ...enrollment, student_id: data.id });
                    if (e2) return `Student saved, but the course was not: ${e2.message}. Use “Add course” on the student.`;
                  }
                  setWelcome({ name: student.name, phone: student.phone, courses: enrollment ? [enrollment.course] : [] });
                  return null;
                })
              }
            />
          )}
          {panel.kind === "editStudent" && (
            <StudentForm
              student={panel.student}
              onCancel={() => setPanel(null)}
              onSave={({ student }) => save(async () => (await db.from("students").update(student).eq("id", panel.student.id)).error?.message ?? null)}
            />
          )}
          {panel.kind === "addCourse" && (
            <EnrollmentForm
              onCancel={() => setPanel(null)}
              onSave={(values) =>
                save(async () => (await db.from("enrollments").insert({ ...values, student_id: panel.student.id })).error?.message ?? null)
              }
            />
          )}
          {panel.kind === "editCourse" && (
            <EnrollmentForm
              enrollment={panel.enrollment}
              onCancel={() => setPanel(null)}
              onSave={(values) => save(async () => (await db.from("enrollments").update(values).eq("id", panel.enrollment.id)).error?.message ?? null)}
            />
          )}
          {panel.kind === "payment" && (
            <PaymentForm
              enrollment={panel.enrollment}
              onCancel={() => setPanel(null)}
              onSave={({ payment, next_due_on }) =>
                save(async () => {
                  const { error } = await db.from("payments").insert({ ...payment, enrollment_id: panel.enrollment.id });
                  if (error) return error.message;
                  if (panel.enrollment.fee_type === "course") {
                    const { error: e2 } = await db.from("enrollments").update({ next_due_on }).eq("id", panel.enrollment.id);
                    if (e2) return `Payment saved, but the next due date was not: ${e2.message}`;
                  }
                  return null;
                })
              }
            />
          )}
        </Modal>
      )}
    </Shell>
  );
}

function panelTitle(panel: NonNullable<Panel>) {
  switch (panel.kind) {
    case "addStudent": return "Add student";
    case "editStudent": return `Edit ${panel.student.name}`;
    case "addCourse": return `Add a course for ${panel.student.name}`;
    case "editCourse": return `Edit ${panel.enrollment.course} fee for ${panel.student.name}`;
    case "payment": return `Record payment: ${panel.student.name}, ${panel.enrollment.course}`;
  }
}

function Stat({ label, value, tone }: { label: string; value: ReactNode; tone?: "good" | "bad" }) {
  const color = tone === "bad" ? "text-red-400" : tone === "good" ? "text-emerald-400" : "";
  return (
    <Card className="gap-1 p-4">
      <span className="text-sm text-white/60">{label}</span>
      <span className={`text-2xl font-semibold ${color}`}>{value}</span>
    </Card>
  );
}

function FeeLine({ e, st }: { e: Enrollment; st: FeeStatus }) {
  if (e.fee_type === "monthly") {
    return st.unpaidMonths.length ? (
      <span className="text-red-400">{rupees(st.balance)} due · {st.unpaidMonths.map(monthLabel).join(", ")}</span>
    ) : (
      <span className="text-emerald-400">Paid up</span>
    );
  }
  if (st.balance === 0) return <span className="text-emerald-400">Fully paid</span>;
  return (
    <span className={st.overdue ? "text-red-400" : "text-amber-300"}>
      {rupees(st.balance)} left{e.next_due_on && ` · ${st.overdue ? "was due" : "next due"} ${dateLabel(e.next_due_on)}`}
    </span>
  );
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    // data-lenis-prevent lets the form scroll on its own instead of the page's smooth scrolling taking the wheel.
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-lenis-prevent
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <Card className="max-h-[90vh] w-full max-w-lg gap-4 overflow-y-auto bg-neutral-900 p-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        {children}
      </Card>
    </div>
  );
}
