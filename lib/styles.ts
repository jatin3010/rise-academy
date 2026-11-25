import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Shared look: glass panels, and the saffron call-to-action (brand colours in app/globals.css).
export const GLASS = "rounded-2xl bg-white/10 p-5 backdrop-blur-lg sm:p-6";
export const CTA = "bg-saffron-strong text-white transition-colors hover:bg-saffron-deep";
// The site's two big link buttons: the dark call-to-action and a glass one.
const BIG = "h-11 rounded-full px-6 text-sm font-medium";
export const CTA_BUTTON = cn(buttonVariants(), BIG, "text-white", CTA);
export const GLASS_BUTTON = cn(buttonVariants({ variant: "ghost" }), BIG, "bg-white/10 backdrop-blur-lg hover:bg-white/20");
// For shadcn Cards, which already have the white/10 fill: rounder corners plus the blur that makes them glass.
export const GLASS_CARD = "rounded-2xl backdrop-blur-lg";
