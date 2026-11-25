// The academy's courses, shared by the website and the admin CRM so the two lists cannot drift apart.
// feeType is the usual way each group is paid; the CRM uses it as the default when enrolling a student.
// slug and heading are for the group's own page (/courses/<slug>/), written the way people search for it.
export const COURSES = [
  {
    slug: "school-tuition",
    title: "School Tuition",
    heading: "School tuition for Classes 1–12 in Sector 110, Gurugram",
    text: "Classes 1st–12th in three wings: Junior (1–5), Middle (6–8) and Senior (9–12).",
    items: ["Mathematics", "Science", "English", "Social Science", "Accountancy", "Economics", "Business Studies"],
    feeType: "monthly",
  },
  {
    slug: "spoken-english",
    title: "Spoken English & Personal Growth",
    heading: "Spoken English, IELTS and PTE classes in Gurugram",
    text: "Speak fluently, present yourself with confidence, and prepare for interviews and English tests.",
    items: ["Spoken English", "Personality Development", "Interview Preparation", "IELTS", "PTE"],
    feeType: "course",
  },
  {
    slug: "computer-courses",
    title: "Computer & Digital Skills",
    heading: "Computer courses in Gurugram: MS Office, Excel, Tally and more",
    text: "Practical computer skills for school, college and work.",
    items: ["Computer Courses", "MS Office", "Advanced Excel", "Tally", "Digital Marketing", "Website Designing"],
    feeType: "course",
  },
] as const;
