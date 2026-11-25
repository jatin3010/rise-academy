import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Stars({ className }: { className?: string }) {
  return (
    <span className={cn("flex gap-0.5 text-primary", className)} role="img" aria-label="5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="size-4 fill-current" aria-hidden />
      ))}
    </span>
  );
}
