// The academy's courses, shared by the website and the admin CRM so the two lists cannot drift apart.
// feeType is the usual way each group is paid; the CRM uses it as the default when enrolling a student.
export const COURSES = [
  {
    title: "School Tuition",
    text: "Classes 1st–12th in three wings: Junior (1–5), Middle (6–8) and Senior (9–12).",
    items: ["Mathematics", "Science", "English", "Social Science", "Accountancy", "Economics", "Business Studies"],
    feeType: "monthly",
  },
  {
    title: "Spoken English & Personal Growth",
    text: "Speak fluently, present yourself with confidence, and prepare for interviews and English tests.",
    items: ["Spoken English", "Personality Development", "Interview Preparation", "IELTS", "PTE"],
    feeType: "course",
  },
  {
    title: "Computer & Digital Skills",
    text: "Practical computer skills for school, college and work.",
    items: ["Computer Courses", "MS Office", "Advanced Excel", "Tally", "Digital Marketing", "Website Designing"],
    feeType: "course",
  },
] as const;
