// A section heading, slightly narrowed (Anek's width axis) so it reads as a heading rather than large body text.
// The small gold label above it is only for facts the heading doesn't say (a rating, a handle, who someone is).
export default function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <>
      {eyebrow && <p className="text-sm font-medium text-gold">{eyebrow}</p>}
      <h2 className="mt-2 mb-8 text-3xl font-semibold leading-[1.1] tracking-tight font-stretch-semi-condensed sm:text-4xl">
        {title}
      </h2>
    </>
  );
}
