// A file in public/, under the GitHub Pages base path ("/rise-academy"; empty locally).
export const asset = (file: string) => `${process.env.BASE_PATH}/${file}`;

// Public address of the site (canonical URL, share previews, structured data). Change here for a custom domain.
export const SITE_URL = "https://jatin3010.github.io/rise-academy/";
export const PHONE = "+917042481547";
export const PHONE_DISPLAY = "070424 81547";
export const WHATSAPP = "https://wa.me/917042481547";
// Google rating; update both when the Google listing changes.
export const RATING = "4.9";
export const REVIEW_COUNT = 1001;

// Video reviews in public/reviews/: review-N.mp4 (compressed from the originals) and review-N.jpg (a frame used as its
// cover). Shown in "What students and parents say", in this order.
export const REVIEW_VIDEOS = [1, 2, 3];

export const YOUTUBE ="https://www.youtube.com/@Riseacademyenglish";
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
