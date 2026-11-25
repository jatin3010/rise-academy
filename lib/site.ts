import { COURSES } from "./courses.ts";

// A file in public/, under the GitHub Pages base path ("/rise-academy"; empty locally).
export const asset = (file: string) => `${process.env.BASE_PATH}/${file}`;

// Public address of the site (canonical URL, share previews, structured data, sitemap). Change here for a custom domain.
export const SITE_URL = "https://jatin3010.github.io/rise-academy/";
// The picture shown when a page is shared on WhatsApp, Facebook and so on (public/og.jpg).
export const OG_IMAGE = { url: "og.jpg", width: 1200, height: 630, alt: "Rise Academy courses banner with phone number and address" };
export const PHONE = "+917042481547";
export const PHONE_DISPLAY = "070424 81547";
export const WHATSAPP = "https://wa.me/917042481547";
export const ADDRESS = "A-117, Bajghera Rd, New Palam Vihar, Block B, Chowk, Sector 110, Gurugram, Haryana 122017";
export const MAPS_QUERY = "Rise+Academy+New+Palam+Vihar+Gurugram";
// Google rating; update both when the Google listing changes.
export const RATING = "4.9";
export const REVIEW_COUNT = 1001;
// The academy's UPI ID for fees (like "riseacademy@okaxis"). While empty, fee reminders don't mention UPI.
export const UPI_ID = "";

// Real Google reviews only, word for word with the reviewer's name as shown on Google; `course` is the course page
// (lib/courses.ts) it also appears on.
export const REVIEWS = [
  {
    name: "Shashwat Savarn",
    course: "school-tuition",
    text: "Rise Academy in New Palam Vihar provides an excellent learning environment with dedicated and approachable faculty. The teachers focus on building strong core concepts and ensure no student is left behind during doubt-clearing sessions.",
  },
  {
    name: "Vinit Rana",
    course: "spoken-english",
    text: "Best spoken English coaching center in Gurgaon. No doubt guys, this is the best place for improvement of overall English and personality development. And Ravil sir is definitely the best mentor of my life.",
  },
  {
    name: "Sanjay Vashist",
    course: "spoken-english",
    text: "I joined the academy to improve my English speaking and communication skills, and I have seen a noticeable improvement in my confidence and fluency.",
  },
];

// Only facts from the Google listing and the academy's banners; no fees or batch times, which we don't know yet.
// The home page shows them all; each course page picks the ones that fit.
export const FAQ = {
  courses: ["What courses does Rise Academy offer?", COURSES.map(({ title, items }) => `${title}: ${items.join(", ")}`).join(". ") + "."],
  classes: ["Which school classes do you teach?", "All classes from 1st to 12th, in three wings: Junior (Classes 1–5), Middle (Classes 6–8) and Senior (Classes 9–12)."],
  where: ["Where is Rise Academy in Gurugram?", `${ADDRESS}. Google Maps plus code: G25G+V9 Gurugram.`],
  timings: ["What are the timings?", `The academy is open until 10 PM. Call ${PHONE_DISPLAY} to ask about batch timings.`],
  ielts: ["Do you coach for IELTS and PTE?", "Yes. IELTS and PTE preparation is part of the Spoken English & Personal Growth programme."],
  join: ["How do I join?", `Call ${PHONE_DISPLAY} or send a WhatsApp message to the same number.`],
} satisfies Record<string, [string, string]>;

// Video reviews in public/reviews/: review-N.mp4 (compressed from the originals), review-N.webp (a frame used as its
// cover) and review-N.vtt (English captions; review 3 is spoken in Hindi, so its captions are a translation). Shown in "What students and parents say", in this order.
export const REVIEW_VIDEOS = [1, 2, 3];

export const YOUTUBE ="https://www.youtube.com/@Riseacademyenglish";

// The academy's Instagram profile as the app showed it on 25 Nov 2026. The numbers and bio don't update themselves:
// copy them from the app now and then. public/instagram/ holds the profile photo (profile.webp) and the first four
// story highlight covers (highlight-1…4.webp, in the order below), cut from a screenshot of the profile.
export const INSTAGRAM = {
  handle: "riseacademyenglish",
  url: "https://www.instagram.com/riseacademyenglish/",
  name: "Rise Academy",
  category: "Education",
  bio: ["🎓 Educator | Entrepreneur", "🚀 Founder — Rise Academy", "🌱 Founder — UniKids School", "🏆 8.5 IELTS | 🎓 Delhi University Alumni"],
  stats: [
    [277, "posts"],
    [994, "followers"],
    [324, "following"],
  ] as const,
  highlights: ["New Joiners", "Be Fit", "Family", "Faculties"],
};
// Real class videos from Rise Academy's YouTube only: the video id (the 11 characters after "watch?v=", "youtu.be/" or
// "shorts/" in its link) and a short title. The first is shown large. The "Inside our classes" section and its menu
// link stay hidden while empty.
export const VIDEOS: { id: string; title: string }[] = [
  { id: "otpJTtVt_34", title: "Sentence starters every English speaker should know" },
  { id: "3ScxaQTAc5Y", title: "Subject–verb agreement: the full chapter in one class" },
  { id: "6Qjb3TuPw1g", title: "Top 100 idioms and phrases for SSC CGL 2026 and CUET" },
  { id: "oTGJlZsUFpw", title: "Figures of speech for SSC CGL 2026 and CUET English" },
  { id: "S8ioBIN3x4w", title: "How to crack any job interview" },
];
