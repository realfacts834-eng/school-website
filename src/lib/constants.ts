// ==========================================
// Static Constants - جو کبھی نہیں بدلیں گی
// ==========================================

// نیویگیشن لنکس (سٹرکچر fixed ہے)
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { 
    label: "About", 
    href: "/about",
  },
  { 
    label: "Academics", 
    href: "/academics",
    dropdown: [
      { label: "Curriculum", href: "/academics#curriculum" },
      { label: "Examinations", href: "/academics#examinations" },
      { label: "Results", href: "/results" },
    ],
  },
  { 
    label: "Admissions", 
    href: "/admissions",
    dropdown: [
      { label: "How to Apply", href: "/admissions" },
      { label: "Fee Structure", href: "/admissions#fees" },
      { label: "Apply Online", href: "/admissions/apply" },
    ],
  },
  { label: "Faculty", href: "/faculty" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Notice Board", href: "/notice-board" },
  { label: "Contact", href: "/contact" },
];

// ایڈمن سائڈبار
export const ADMIN_SIDEBAR = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "News", href: "/admin/news", icon: "Newspaper" },
  { label: "Blog", href: "/admin/blog", icon: "PenSquare" },
  { label: "Events", href: "/admin/events", icon: "CalendarDays" },
  { label: "Gallery", href: "/admin/gallery", icon: "Image" },
  { label: "Faculty", href: "/admin/faculty", icon: "Users" },
  { label: "Admissions", href: "/admin/admissions", icon: "FileText" },
  { label: "Notice Board", href: "/admin/notice-board", icon: "ClipboardList" },
  { label: "Results", href: "/admin/results", icon: "Award" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

// کلاسیں (fixed)
export const CLASSES = [
  "Play Group", "Nursery", "KG",
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "F.Sc Pre-Medical", "F.Sc Pre-Engineering", "ICS", "FA",
] as const;

// امتحان کی اقسام
export const EXAM_TYPES = [
  "Monthly Test", "Mid Term", "Final Term", "Pre-Board", "Board Exam",
] as const;

// جنڈر
export const GENDERS = ["Male", "Female"] as const;

// ایڈمیشن سٹیٹس
export const ADMISSION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  WAITLIST: "waitlist",
} as const;

// یوزر رولز
export const USER_ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
} as const;

// API روٹس
export const API_ROUTES = {
  NEWS: "/api/news",
  EVENTS: "/api/events",
  FACULTY: "/api/faculty",
  ADMISSIONS: "/api/admissions",
  GALLERY: "/api/gallery",
  NOTICES: "/api/notices",
  RESULTS: "/api/results",
  CONTACT: "/api/contact",
  SETTINGS: "/api/settings",
  SUBSCRIBE: "/api/subscribe",
  UPLOAD: "/api/upload",
} as const;

// فائل اپلوڈ لمٹس
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  MAX_IMAGES_PER_ALBUM: 50,
} as const;

// پیجینیشن
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  ADMIN_PER_PAGE: 15,
} as const;

// ڈیفالٹ سائٹ کا نام (صرف fallback)
export const DEFAULT_SITE_NAME = "Afridi Model School & College";