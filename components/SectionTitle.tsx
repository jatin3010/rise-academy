// A section's small label above its heading, used on every public page.
export default function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-3 mb-8 text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">{title}</h2>
    </>
  );
}
