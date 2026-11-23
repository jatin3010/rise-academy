"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import ScrollExpand from "@/components/ScrollExpand";
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
import { GLASS_CARD } from "@/lib/styles";
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
// Panels fade and rise in one after another; motion-safe keeps them still for people who prefer reduced motion.
const rise = "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 duration-500 fill-mode-both";
const lift = "transition hover:-translate-y-0.5 hover:bg-white/[0.14]";
const stagger = (i: number) => ({ animationDelay: `${Math.min(i, 8) * 60}ms` });

export default function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  // True from pressing "Sign in" until the opening animation ends, so the login screen stays up while it plays.
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabase) return <SetupNeeded />;
  if (session === undefined) return <Shell><p className="text-white/60">Loading…</p></Shell>;
  if (!session || entering) return <Login onEnter={setEntering} />;
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

const NARROW = "(max-width: 640px)";
const subscribeNarrow = (onChange: () => void) => {
  const query = window.matchMedia(NARROW);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useNarrow = () => useSyncExternalStore(subscribeNarrow, () => window.matchMedia(NARROW).matches, () => false);

// The site's video plays in a rounded window behind the login card. After a correct sign-in the card fades,
// the video expands to full screen with "Welcome back", then the dashboard takes over.
function Login({ onEnter }: { onEnter: (entering: boolean) => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const narrow = useNarrow();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    onEnter(true);
    const { error } = await supabase!.auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error) {
      setBusy(false);
      setError(error.message);
      onEnter(false);
      return;
    }
    setOpen(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => onEnter(false), reduce ? 0 : 1400);
  }

  return (
    <main className="relative h-svh w-full overflow-hidden">
      {/* shortcut: relative media URLs, same limit as in layout.tsx */}
      <ScrollExpand
        mediaType="video"
        src="hero.mp4"
        poster="hero.jpg"
        progress={open ? 1 : 0}
        startWidth={narrow ? 92 : 52}
        startHeight={narrow ? 78 : 70}
        startRadius={28}
        mediaZoom={1.2}
        scrollDistance={0}
        holdDistance={0}
        smoothing={0.25}
        overlayScrim={0.8}
      >
        {/* The shadow keeps the text readable over the bright mist in the middle of the video. */}
        <div className="[text-shadow:0_2px_20px_rgb(0_0_0/0.7)]">
          <p className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">Welcome back</p>
          <p className="mt-2 text-white/85">Opening your dashboard…</p>
        </div>
      </ScrollExpand>
      <div
        className={`absolute inset-0 grid place-items-center p-4 transition duration-500 ${open ? "pointer-events-none scale-95 opacity-0" : ""}`}
      >
        <Card className={`w-[min(22rem,80vw)] gap-4 bg-black/35 p-6 ${GLASS_CARD} ${rise}`}>
          <div>
            <h1 className="text-xl font-semibold">Rise Academy admin</h1>
            <p className="text-sm text-white/60">Sign in to manage students and fees</p>
          </div>
          <form onSubmit={onSubmit} className="grid gap-3">
            <Input name="email" type="email" autoComplete="email" placeholder="Email" required aria-label="Email" />
            <Input name="password" type="password" autoComplete="current-password" placeholder="Password" required aria-label="Password" />
            {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
            <Button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
          </form>
        </Card>
      </div>
    </main>
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

  // Leaving stops every current course first, so no monthly fees build up after the student left.
  async function markLeft(s: Student) {
    const { error } = await db.from("enrollments").update({ active: false, ended_on: today }).eq("student_id", s.id).eq("active", true);
    if (error) return setError(error.message);
    await act(db.from("students").update({ active: false }).eq("id", s.id));
  }

  if (!students) {
    return <Shell>{error ? <p className="text-red-400">{error}</p> : <p className="text-white/60">Loading students…</p>}</Shell>;
  }

  const active = students.filter((s) => s.active);
  const all = students.flatMap((s) => s.enrollments.map((e) => ({ s, e, st: feeStatus(e, today) })));
  const rows = all.filter((r) => r.s.active && r.e.active); // current enrolments, for the course counts
  const overdue = all.filter((r) => r.st.overdue); // includes stopped courses: money owed from before they stopped
  const overdueStudents = new Set(overdue.map((r) => r.s.id)).size;
  const q = query.toLowerCase();
  const visible = students
    .filter((s) => !q || `${s.name} ${s.phone} ${s.guardian_name ?? ""}`.toLowerCase().includes(q))
    .filter((s) => !category || s.enrollments.some((e) => e.category === category))
    .filter((s) => !dueOnly || s.enrollments.some((e) => feeStatus(e, today).overdue))
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
        <div className={`mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-[#005c4b]/40 px-4 py-3 text-sm backdrop-blur-lg ${rise}`} role="status">
          <span>{welcome.name} was added.</span>
          <a className={waButton} href={waLink(welcome.phone, welcomeText(welcome, welcome.courses))} target="_blank" rel="noopener">
            Send welcome on WhatsApp
          </a>
          <button className="ml-auto text-white/60 underline" onClick={() => setWelcome(null)}>Close</button>
        </div>
      )}

      <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Summary">
        <Stat i={0} label="Active students" value={active.length} />
        <Stat i={1} label="Course enrolments" value={rows.length} />
        <Stat i={2} label="Students with fees due" value={overdueStudents} tone={overdueStudents ? "bad" : "good"} />
        <Stat
          i={3}
          label="Fees overdue"
          value={overdue.reduce((n, r) => n + r.st.balance, 0)}
          format={rupees}
          tone={overdue.length ? "bad" : "good"}
        />
      </section>

      <section className="mt-3 grid gap-3 md:grid-cols-3" aria-label="Students by course">
        {COURSES.map((group, gi) => {
          const inGroup = rows.filter((r) => r.e.category === group.title);
          const counts = group.items.map((course) => [course, inGroup.filter((r) => r.e.course === course).length] as const);
          const most = Math.max(1, ...counts.map(([, n]) => n));
          return (
            <Card key={group.title} className={`gap-2 p-4 ${GLASS_CARD} ${rise} ${lift}`} style={stagger(gi + 4)}>
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-semibold">{group.title}</h2>
                <span className="text-2xl font-semibold"><CountUp value={inGroup.length} /></span>
              </div>
              <ul className="grid gap-1.5 text-sm">
                {counts.map(([course, n]) => (
                  <li key={course} className={n ? "" : "text-white/40"}>
                    <div className="flex justify-between">
                      <button className="text-left hover:underline" onClick={() => { setCategory(group.title); setQuery(""); }}>
                        {course}
                      </button>
                      <span>{n}</span>
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-white/10" aria-hidden>
                      <div className="h-full origin-left rounded-full bg-white/60 motion-safe:animate-grow-x" style={{ width: `${(n / most) * 100}%` }} />
                    </div>
                  </li>
                ))}
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
          {visible.map((s, i) => (
            <li key={s.id} className={rise} style={stagger(i)}>
              <Card className={`gap-3 p-4 ${GLASS_CARD} ${lift} ${s.active ? "" : "opacity-60"}`}>
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
                    {s.active ? (
                      <Button size="sm" variant="ghost" onClick={() => markLeft(s)}>Mark as left</Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => act(db.from("students").update({ active: true }).eq("id", s.id))}>
                        Re-join
                      </Button>
                    )}
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
                        {e.ended_on && <span className="text-white/60">· stopped {dateLabel(e.ended_on)}</span>}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
                        <FeeLine e={e} st={st} />
                        <span className="grow" />
                        {st.balance > 0 && (
                          <a className={waButton} href={waLink(s.phone, reminderText(s, e, st))} target="_blank" rel="noopener">
                            Send fee reminder
                          </a>
                        )}
                        <Button size="sm" onClick={() => setPanel({ kind: "payment", student: s, enrollment: e })}>Record payment</Button>
                        <Button size="sm" variant="outline" onClick={() => setPanel({ kind: "editCourse", student: s, enrollment: e })}>Edit fee</Button>
                        {/* No "Resume": restarting after a gap would charge the gap months. Use "Add course" instead. */}
                        {e.active && (
                          <Button size="sm" variant="ghost" onClick={() => act(db.from("enrollments").update({ active: false, ended_on: today }).eq("id", e.id))}>
                            Stop course
                          </Button>
                        )}
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

function Stat({
  i,
  label,
  value,
  format,
  tone,
}: {
  i: number;
  label: string;
  value: number;
  format?: (n: number) => string;
  tone?: "good" | "bad";
}) {
  const color = tone === "bad" ? "text-red-400" : tone === "good" ? "text-emerald-400" : "";
  return (
    <Card className={`gap-1 p-4 ${GLASS_CARD} ${rise} ${lift}`} style={stagger(i)}>
      <span className="text-sm text-white/60">{label}</span>
      <span className={`text-2xl font-semibold tabular-nums ${color}`}>
        <CountUp value={value} format={format} />
      </span>
    </Card>
  );
}

// Counts up to the value (and from the old value when it changes); jumps straight there for reduced motion.
function CountUp({ value, format = String }: { value: number; format?: (n: number) => string }) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const start = from.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const began = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const t = reduce ? 1 : Math.min(1, (now - began) / 800);
      const n = Math.round(start + (value - start) * (1 - (1 - t) ** 3));
      from.current = n;
      setShown(n);
      if (t < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{format(shown)}</>;
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
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-lenis-prevent
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <Card
        className={`max-h-[90vh] w-full max-w-lg gap-4 overflow-y-auto bg-neutral-900/75 p-6 ${GLASS_CARD} backdrop-blur-xl motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:slide-in-from-bottom-2 duration-300`}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        {children}
      </Card>
    </div>
  );
}
