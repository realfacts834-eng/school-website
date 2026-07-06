import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// ==========================================
// Seed Data
// ==========================================
const SAMPLE_NEWS = [
  {
    title: "Annual Sports Day 2026",
    slug: "annual-sports-day-2026",
    content: "<p>Our annual sports day was a huge success with students participating in various events.</p>",
    excerpt: "Students showcase their athletic talents at the annual sports day.",
    isPublished: true,
    isBreaking: false,
  },
  {
    title: "Board Exam Results - 100% Pass Rate",
    slug: "board-exam-results-2026",
    content: "<p>We are proud to announce that our students achieved a 100% pass rate in the board examinations.</p>",
    excerpt: "Students achieve outstanding results in board examinations.",
    isPublished: true,
    isBreaking: true,
  },
  {
    title: "New Computer Lab Inaugurated",
    slug: "new-computer-lab-2026",
    content: "<p>A state-of-the-art computer lab has been inaugurated to enhance digital learning.</p>",
    excerpt: "State-of-the-art computer lab opens for students.",
    isPublished: true,
    isBreaking: false,
  },
];

const SAMPLE_EVENTS = [
  {
    title: "Parent-Teacher Meeting",
    slug: "parent-teacher-meeting-2026",
    description: "Quarterly parent-teacher meeting to discuss student progress.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    time: "10:00 AM - 2:00 PM",
    location: "School Auditorium",
    isPublished: true,
  },
  {
    title: "Science Exhibition",
    slug: "science-exhibition-2026",
    description: "Students will showcase their science projects and innovations.",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    time: "9:00 AM - 3:00 PM",
    location: "School Hall",
    isPublished: true,
  },
  {
    title: "Annual Prize Distribution",
    slug: "annual-prize-distribution-2026",
    description: "Annual prize distribution ceremony for outstanding students.",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    time: "11:00 AM - 1:00 PM",
    location: "School Ground",
    isPublished: true,
  },
];

const SAMPLE_FACULTY = [
  {
    name: "Dr. Sarah Ahmed",
    designation: "Principal",
    qualification: "Ph.D. in Education",
    experience: "20+ years",
    bio: "A visionary leader dedicated to educational excellence.",
    isActive: true,
    order: 1,
  },
  {
    name: "Mr. Muhammad Khan",
    designation: "Vice Principal",
    qualification: "M.Phil. in Mathematics",
    experience: "15+ years",
    bio: "Experienced educator with a passion for mathematics.",
    isActive: true,
    order: 2,
  },
  {
    name: "Ms. Fatima Ali",
    designation: "Head of Science Department",
    qualification: "M.Sc. in Physics",
    experience: "12+ years",
    bio: "Dedicated science educator fostering curiosity in students.",
    isActive: true,
    order: 3,
  },
  {
    name: "Mr. Hassan Raza",
    designation: "English Teacher",
    qualification: "M.A. in English Literature",
    experience: "10+ years",
    bio: "Passionate about developing strong communication skills.",
    isActive: true,
    order: 4,
  },
  {
    name: "Ms. Ayesha Noor",
    designation: "Computer Science Teacher",
    qualification: "M.Sc. in Computer Science",
    experience: "8+ years",
    bio: "Preparing students for the digital future.",
    isActive: true,
    order: 5,
  },
  {
    name: "Mr. Kamran Yousaf",
    designation: "Sports Director",
    qualification: "M.A. in Physical Education",
    experience: "15+ years",
    bio: "Promoting physical fitness and sportsmanship.",
    isActive: true,
    order: 6,
  },
];

const SAMPLE_NOTICES = [
  {
    title: "School Reopening - New Academic Year",
    content: "School will reopen for the new academic year on August 1, 2026. All students must report in proper uniform.",
    isUrgent: true,
    isPublished: true,
  },
  {
    title: "Fee Submission Deadline",
    content: "The last date for fee submission for the first term is July 25, 2026. Late fee will be charged after the deadline.",
    isUrgent: true,
    isPublished: true,
  },
  {
    title: "Summer Vacation Schedule",
    content: "Summer vacations will be from June 15 to July 31, 2026. Summer camp registration is open.",
    isUrgent: false,
    isPublished: true,
  },
  {
    title: "PTM Schedule - Class 9 & 10",
    content: "Parent-Teacher Meeting for classes 9 and 10 will be held on Saturday, 10:00 AM to 1:00 PM.",
    isUrgent: false,
    isPublished: true,
  },
];

const SAMPLE_FAQS = [
  {
    question: "What are the school timings?",
    answer: "School timings are Monday to Friday, 8:00 AM to 2:00 PM. Friday timings are 8:00 AM to 12:30 PM.",
    order: 1,
    isActive: true,
  },
  {
    question: "How can I apply for admission?",
    answer: "You can apply online through our admissions page at afridischool.edu.pk/admissions/apply or visit the school office during working hours.",
    order: 2,
    isActive: true,
  },
  {
    question: "What documents are required for admission?",
    answer: "Required documents include: Birth certificate, previous school report card (if applicable), 2 passport-size photographs, father/mother CNIC copies, and a medical fitness certificate.",
    order: 3,
    isActive: true,
  },
  {
    question: "What is the fee structure?",
    answer: "Fee structure varies by class level. Please visit our admissions page or contact the school office for detailed fee information.",
    order: 4,
    isActive: true,
  },
  {
    question: "Do you offer scholarships?",
    answer: "Yes, we offer merit-based and need-based scholarships. Students with outstanding academic performance or exceptional talents may apply for scholarships.",
    order: 5,
    isActive: true,
  },
  {
    question: "Is transportation available?",
    answer: "Yes, we provide transportation facilities on selected routes across the city. Contact the transport department for route details and fees.",
    order: 6,
    isActive: true,
  },
  {
    question: "What extracurricular activities do you offer?",
    answer: "We offer a wide range of activities including sports (cricket, football, basketball), debate club, science club, art and craft, music, and community service programs.",
    order: 7,
    isActive: true,
  },
  {
    question: "How can I track my child's progress?",
    answer: "Parents can track their child's progress through our online portal, regular parent-teacher meetings, and monthly progress reports.",
    order: 8,
    isActive: true,
  },
];

// ==========================================
// Main Seed Function
// ==========================================
async function main() {
  console.log("🌱 Starting database seeding...\n");

  // ==========================================
  // 1. Create Admin User
  // ==========================================
  console.log("👤 Creating admin user...");
  const password = await hash("admin123", 12);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@afridischool.edu.pk" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@afridischool.edu.pk",
      password,
      role: "admin",
    },
  });
  console.log(`   ✅ Admin: ${admin.email} (password: admin123)`);

  // Create Editor User
  const editorPassword = await hash("editor123", 12);
  const editor = await prisma.user.upsert({
    where: { email: "editor@afridischool.edu.pk" },
    update: {},
    create: {
      name: "Content Editor",
      email: "editor@afridischool.edu.pk",
      password: editorPassword,
      role: "editor",
    },
  });
  console.log(`   ✅ Editor: ${editor.email} (password: editor123)\n`);

  // ==========================================
  // 2. Create Site Settings
  // ==========================================
  console.log("⚙️  Creating site settings...");
  const settings = await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      schoolName: "Afridi Model School & College",
      tagline: "Building Future Leaders",
      primaryColor: "#0F172A",
      secondaryColor: "#3B82F6",
      accentColor: "#D4AF37",
      email: "info@afridischool.edu.pk",
      phone: "+92 300 1234567",
      altPhone: "+92 301 7654321",
      whatsapp: "+923001234567",
      address: "123 Main Road, Peshawar, KPK, Pakistan",
      officeTiming: "Mon-Fri: 8:00 AM - 2:00 PM",
      facebook: "https://facebook.com/afridischool",
      twitter: "https://twitter.com/afridischool",
      instagram: "https://instagram.com/afridischool",
      youtube: "https://youtube.com/@afridischool",
      linkedin: "https://linkedin.com/school/afridischool",
      metaTitle: "Afridi Model School & College - Building Future Leaders",
      metaDescription: "Afridi Model School & College is a premier educational institution in Peshawar dedicated to academic excellence, character building, and holistic development of students.",
    },
  });
  console.log(`   ✅ Settings: ${settings.schoolName}\n`);

  // ==========================================
  // 3. Create Sample News
  // ==========================================
  console.log("📰 Creating sample news...");
  for (const news of SAMPLE_NEWS) {
    await prisma.news.create({
      data: {
        ...news,
        authorId: admin.id,
      },
    });
  }
  console.log(`   ✅ ${SAMPLE_NEWS.length} news articles created\n`);

  // ==========================================
  // 4. Create Sample Events
  // ==========================================
  console.log("📅 Creating sample events...");
  for (const event of SAMPLE_EVENTS) {
    await prisma.event.create({
      data: {
        ...event,
        authorId: admin.id,
      },
    });
  }
  console.log(`   ✅ ${SAMPLE_EVENTS.length} events created\n`);

  // ==========================================
  // 5. Create Sample Faculty
  // ==========================================
  console.log("👨‍🏫 Creating sample faculty...");
  for (const faculty of SAMPLE_FACULTY) {
    await prisma.faculty.create({
      data: faculty,
    });
  }
  console.log(`   ✅ ${SAMPLE_FACULTY.length} faculty members created\n`);

  // ==========================================
  // 6. Create Sample Notices
  // ==========================================
  console.log("📋 Creating sample notices...");
  for (const notice of SAMPLE_NOTICES) {
    await prisma.notice.create({
      data: notice,
    });
  }
  console.log(`   ✅ ${SAMPLE_NOTICES.length} notices created\n`);

  // ==========================================
  // 7. Create Sample FAQs
  // ==========================================
  console.log("❓ Creating sample FAQs...");
  for (const faq of SAMPLE_FAQS) {
    await prisma.faq.create({
      data: faq,
    });
  }
  console.log(`   ✅ ${SAMPLE_FAQS.length} FAQs created\n`);

  // ==========================================
  // Summary
  // ==========================================
  console.log("=".repeat(50));
  console.log("🎉 Database seeding completed successfully!");
  console.log("=".repeat(50));
  console.log("\n📋 Login Credentials:");
  console.log("   Admin:  admin@afridischool.edu.pk / admin123");
  console.log("   Editor: editor@afridischool.edu.pk / editor123");
  console.log("\n🚀 Run 'npm run dev' to start the application.\n");
}

// ==========================================
// Execute Seed
// ==========================================
main()
  .catch((e) => {
    console.error("\n❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });