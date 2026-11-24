"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { COURSES } from "@/lib/courses";
import type { Student } from "@/lib/fees";
import { parseCsv, planImport, TEMPLATE_HEADERS, type ImportPlan, type Sheet } from "@/lib/import";

export function saveFile(blob: Blob, name: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 10_000); // freeing it at once can cancel the download in Safari/Firefox
}

// Downloads an empty sheet with the right headings; Excel opens .csv files directly.
const downloadTemplate = () => saveFile(new Blob([`﻿${TEMPLATE_HEADERS.join(",")}\r\n`], { type: "text/csv" }), "rise-academy-students.csv");

// Every sheet of a workbook (registers are often kept one sheet per class); a CSV file is a single sheet.
async function readSheets(file: File): Promise<Sheet[]> {
  if (file.name.toLowerCase().endsWith(".csv")) return [{ data: parseCsv(await file.text()) }];
  const { default: readExcelFile } = await import("read-excel-file/universal"); // downloaded only when someone imports
  return readExcelFile(file);
}

export function ImportForm({
  existing,
  onImport,
  onCancel,
}: {
  existing: Student[];
  onImport: (students: ImportPlan["students"]) => Promise<string | null>;
  onCancel: () => void;
}) {
  const [plan, setPlan] = useState<ImportPlan | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPlan(null);
    setError("");
    if (!file) return;
    try {
      setPlan(planImport(await readSheets(file), existing));
    } catch {
      setError("Could not read this file. Save it from Excel as .xlsx or .csv and try again.");
    }
  }

  async function onConfirm() {
    if (!plan) return;
    setBusy(true);
    setError((await onImport(plan.students)) ?? "");
    setBusy(false);
  }

  const courses = plan?.students.reduce((n, s) => n + s.enrollments.length, 0) ?? 0;
  const rows = (n: number) => `${n} ${n === 1 ? "row" : "rows"}`;

  return (
    <div className="grid gap-4 text-sm">
      <p className="leading-relaxed text-white/70">
        Upload an Excel (.xlsx) or CSV file with <strong className="text-white">one row per student per course</strong>. Required
        columns: <strong className="text-white">Name, Phone, Course, Fee amount</strong>. Optional: Parent, Class, Fee type
        (Monthly or Course), Due day, Next due date, Start date (DD/MM/YYYY) and Notes.
      </p>
      <details className="text-white/70">
        <summary className="cursor-pointer">Course names to use</summary>
        <ul className="mt-2 grid gap-1">
          {COURSES.map((group) => (
            <li key={group.title}>
              <span className="text-white">{group.title}:</span> {group.items.join(", ")}
            </li>
          ))}
        </ul>
      </details>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={downloadTemplate}>Download blank template</Button>
        <input
          type="file"
          accept=".xlsx,.csv"
          aria-label="Excel or CSV file"
          onChange={onFile}
          className="text-sm text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-neutral-900"
        />
      </div>

      {plan && (
        <div className="grid gap-2 rounded-xl bg-white/5 p-3" role="status">
          <p>
            <strong>{plan.students.length}</strong> students ({courses} courses) ready to import.
          </p>
          {plan.skipped > 0 && <p className="text-white/60">{rows(plan.skipped)} skipped: already in the CRM.</p>}
          {plan.errors.length > 0 && (
            <div className="text-amber-300">
              <p>{rows(plan.errors.length)} can&apos;t be imported. Fix them in the sheet and upload it again, or import the rest now:</p>
              <ul className="mt-1 max-h-40 list-disc overflow-y-auto pl-5">
                {plan.errors.map((e) => (
                  <li key={`${e.sheet}-${e.row}`}>
                    {e.sheet ? `${e.sheet}, row` : "Row"} {e.row}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-red-400" role="alert">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="button" disabled={!plan?.students.length || busy} onClick={onConfirm}>
          {busy ? "Importing…" : `Import ${plan?.students.length ?? 0} students`}
        </Button>
      </div>
    </div>
  );
}
