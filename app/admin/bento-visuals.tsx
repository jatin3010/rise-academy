"use client";

// Rise Academy content for the MagicBento cards. Each visual reuses MagicBento's own CSS classes, so its built-in
// animations (line draw, growing bars, ticking steps, hub links, switches) still play — with our data instead of its demo.
import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  DatabaseLockedIcon,
  LanguageSkillIcon,
  LaptopIcon,
  LockPasswordIcon,
  Mic01Icon,
  Mortarboard01Icon,
  Tick02Icon,
  Xls01Icon,
} from "@hugeicons/core-free-icons";
import { monthLabel, rupees } from "@/lib/fees";

const vars = (v: Record<string, string | number>) => v as CSSProperties;
const short = (month: string) => monthLabel(month).split(" ")[0];

// Smooth line through the points. shortcut: drawn on a fixed 230×64 canvas that the svg stretches to the card (close to
// its real size, so the line stays ~1.6px); measure the plot like MagicBento's own chart if cards get much bigger.
const W = 230;
const H = 64;
function linePath(values: number[]) {
  const top = Math.max(1, ...values);
  const pts = values.map((v, i) => [(i / Math.max(1, values.length - 1)) * W, H - 4 - (v / top) * (H - 12)]);
  return pts.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x},${y}`;
    const [px, py] = pts[i - 1];
    const mx = (px + x) / 2;
    return `${d} C${mx},${py} ${mx},${y} ${x},${y}`;
  }, "");
}

export function StudentTrend({ months }: { months: { month: string; studying: number }[] }) {
  const now = months[months.length - 1].studying;
  const change = now - months[months.length - 2].studying;
  const line = linePath(months.map((m) => m.studying));
  return (
    <div className="magic-bento__chart" title={months.map((m) => `${short(m.month)}: ${m.studying}`).join(" · ")}>
      <div className="magic-bento__figure">
        <span className="magic-bento__figure-value">{now} studying</span>
        <span className="magic-bento__figure-note">{change >= 0 ? `+${change}` : change} since {short(months[months.length - 2].month)}</span>
      </div>
      <div className="magic-bento__plot">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <path className="magic-bento__chart-area" d={`${line} L${W},${H} L0,${H} Z`} />
          <path className="magic-bento__chart-line" d={line} pathLength={1} />
        </svg>
      </div>
    </div>
  );
}

export function FeeBars({ months }: { months: { month: string; collected: number }[] }) {
  const top = Math.max(...months.map((m) => m.collected));
  const now = months[months.length - 1];
  return (
    <div className="magic-bento__bars">
      <div className="magic-bento__figure">
        <span className="magic-bento__figure-value">{rupees(now.collected)}</span>
        <span className="magic-bento__figure-note">collected in {short(now.month)}</span>
      </div>
      <div className="magic-bento__bars-plot">
        {months.map((m, i) => (
          <span
            key={m.month}
            className="magic-bento__bar"
            title={`${monthLabel(m.month)}: ${rupees(m.collected)}`}
            data-peak={top > 0 && m.collected === top ? "" : undefined}
            style={vars({ "--h": top ? m.collected / top : 0, "--i": i })}
          />
        ))}
      </div>
    </div>
  );
}

// The welcome message as the newest student receives it on WhatsApp.
export function WelcomePreview({ name, text }: { name: string; text: string }) {
  return (
    <div className="magic-bento__collab magic-bento__well">
      <span className="magic-bento__doc-title">WhatsApp · {name}</span>
      <p className="crm-bento__bubble">{text}</p>
    </div>
  );
}

const IMPORT_STEPS = [
  ["Read the sheet", ".xlsx or .csv"],
  ["Check every row", "phone, course, fee"],
  ["Preview", "ready · skipped"],
  ["Add to the CRM", "one click"],
];

export function ImportSteps() {
  return (
    <div className="magic-bento__flow" style={vars({ "--n": IMPORT_STEPS.length })}>
      <div className="magic-bento__flow-trigger magic-bento__tile">
        <span className="magic-bento__flow-glyph">
          <HugeiconsIcon icon={Xls01Icon} size={15} strokeWidth={1.8} />
        </span>
        <span className="magic-bento__flow-copy">
          <span className="magic-bento__flow-name">Student register.xlsx</span>
          <span className="magic-bento__flow-meta">Name, Phone, Course, Fee amount</span>
        </span>
      </div>
      <ol className="magic-bento__steps magic-bento__well">
        <span className="magic-bento__rail" aria-hidden="true">
          <span className="magic-bento__rail-fill" />
        </span>
        {IMPORT_STEPS.map(([label, note], i) => (
          <li key={label} className="magic-bento__step" style={vars({ "--i": i })}>
            <span className="magic-bento__status">
              <span className="magic-bento__pending" />
              <span className="magic-bento__spinner" />
              <span className="magic-bento__done">
                <HugeiconsIcon icon={Tick02Icon} size={11} strokeWidth={2.6} />
              </span>
            </span>
            {label}
            <span className="magic-bento__step-time">{note}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// The academy in the middle, linked to its course families (hover a node for its name).
const GROUP_NODES = [
  { icon: Book02Icon, title: "School Tuition", x: "17%", y: "24%" },
  { icon: Mic01Icon, title: "Spoken English & Personal Growth", x: "83%", y: "24%" },
  { icon: LanguageSkillIcon, title: "IELTS & PTE", x: "17%", y: "78%" },
  { icon: LaptopIcon, title: "Computer & Digital Skills", x: "83%", y: "78%" },
];

export function CourseHub() {
  return (
    <div className="magic-bento__hub">
      <svg className="magic-bento__hub-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {GROUP_NODES.map((n) => (
          <line key={n.x + n.y} x1={parseFloat(n.x)} y1={parseFloat(n.y)} x2="50" y2="51" pathLength={1} />
        ))}
      </svg>
      {GROUP_NODES.map((n, i) => (
        <span key={`packet-${i}`} className="magic-bento__packet" style={vars({ "--x": n.x, "--y": n.y, "--i": i })} />
      ))}
      {GROUP_NODES.map((n, i) => (
        <span
          key={n.x + n.y}
          className="magic-bento__hub-node magic-bento__tile"
          title={n.title}
          style={vars({ "--x": n.x, "--y": n.y, "--s": "26px", "--i": i + 1 })}
        >
          <HugeiconsIcon icon={n.icon} size={14} strokeWidth={1.8} />
        </span>
      ))}
      <span className="magic-bento__hub-node magic-bento__tile" title="Rise Academy" style={vars({ "--x": "50%", "--y": "51%", "--s": "34px", "--i": 0 })}>
        <HugeiconsIcon icon={Mortarboard01Icon} size={17} strokeWidth={1.8} />
      </span>
    </div>
  );
}

const LOCKS = [
  { icon: LockPasswordIcon, label: "Admin password login" },
  { icon: DatabaseLockedIcon, label: "Data locked to admins" },
];

export function AdminLock() {
  return (
    <div className="magic-bento__shield">
      {LOCKS.map((l, i) => (
        <div key={l.label} className="magic-bento__setting magic-bento__tile">
          <HugeiconsIcon icon={l.icon} size={14} strokeWidth={1.8} />
          <span className="magic-bento__setting-label">{l.label}</span>
          <span className="magic-bento__switch" style={vars({ "--i": i })} />
        </div>
      ))}
    </div>
  );
}
