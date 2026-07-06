// ==========================================
// NextAuth Extended Types
// ==========================================
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}

// ==========================================
// Enums
// ==========================================
export type UserRole = "admin" | "editor";

export type AdmissionStatus = "pending" | "approved" | "rejected" | "waitlist";

export type Gender = "Male" | "Female";

export type DeviceType = "desktop" | "mobile" | "tablet" | "unknown";

export type PageType = "website" | "article" | "event";

// ==========================================
// API Response Types
// ==========================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  category?: string;
  fromDate?: string;
  toDate?: string;
}

// ==========================================
// Site Settings
// ==========================================
export interface SiteSettings {
  id: string;
  schoolName: string;
  tagline: string | null;
  logo: string | null;
  logoWhite: string | null;
  favicon: string | null;
  ogImage: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  email: string | null;
  phone: string | null;
  altPhone: string | null;
  whatsapp: string | null;
  address: string | null;
  mapEmbedUrl: string | null;
  officeTiming: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  youtube: string | null;
  linkedin: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  googleAnalytics: string | null;
  updatedAt: Date;
}

// ==========================================
// News
// ==========================================
export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  isPublished: boolean;
  isBreaking: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface NewsFormData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  isPublished?: boolean;
  isBreaking?: boolean;
}

// ==========================================
// Blog
// ==========================================
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  tags: string | null;
  isPublished: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface BlogFormData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string;
  isPublished?: boolean;
}

// ==========================================
// Events
// ==========================================
export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: Date;
  endDate: Date | null;
  time: string | null;
  location: string | null;
  image: string | null;
  isPublished: boolean;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
  };
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time?: string;
  location?: string;
  image?: string;
  isPublished?: boolean;
}

// ==========================================
// Faculty
// ==========================================
export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification: string | null;
  experience: string | null;
  image: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FacultyFormData {
  name: string;
  designation: string;
  qualification?: string;
  experience?: string;
  image?: string;
  bio?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

// ==========================================
// Gallery
// ==========================================
export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  isPublished: boolean;
  images: GalleryImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  albumId: string;
  order: number;
  createdAt: Date;
}

export interface GalleryFormData {
  title: string;
  description?: string;
  coverImage?: string;
  isPublished?: boolean;
}

// ==========================================
// Admissions
// ==========================================
export interface AdmissionApplication {
  id: string;
  studentName: string;
  fatherName: string;
  motherName: string | null;
  dob: Date;
  gender: string;
  applyingClass: string;
  previousSchool: string | null;
  address: string;
  phone: string;
  email: string | null;
  status: AdmissionStatus;
  remarks: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdmissionFormData {
  studentName: string;
  fatherName: string;
  motherName?: string;
  dob: string;
  gender: Gender;
  applyingClass: string;
  previousSchool?: string;
  address: string;
  phone: string;
  email?: string;
}

// ==========================================
// Notice Board
// ==========================================
export interface NoticeItem {
  id: string;
  title: string;
  content: string | null;
  fileUrl: string | null;
  isUrgent: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoticeFormData {
  title: string;
  content?: string;
  fileUrl?: string;
  isUrgent?: boolean;
  isPublished?: boolean;
}

// ==========================================
// Results
// ==========================================
export interface ResultItem {
  id: string;
  title: string;
  class: string;
  examType: string;
  fileUrl: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResultFormData {
  title: string;
  class: string;
  examType: string;
  fileUrl: string;
  isPublished?: boolean;
}

// ==========================================
// Contact
// ==========================================
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ==========================================
// Subscriber
// ==========================================
export interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

// ==========================================
// FAQ
// ==========================================
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FaqFormData {
  question: string;
  answer: string;
  isActive?: boolean;
}

// ==========================================
// Analytics
// ==========================================
export interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  yesterdayViews: number;
  thisMonthViews: number;
  percentChange: string;
  topPages: Array<{ page: string; views: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  countryBreakdown: Array<{ country: string | null; count: number }>;
  chartData: Array<{ date: string; views: number }>;
}

export interface RealtimeStats {
  totalViews: number;
  uniquePages: number;
  uniqueCountries: number;
}

// ==========================================
// Dashboard
// ==========================================
export interface DashboardStats {
  totalNews: number;
  totalEvents: number;
  totalFaculty: number;
  totalAdmissions: number;
  pendingAdmissions: number;
  totalGallery: number;
  totalNotices: number;
  totalSubscribers: number;
  unreadMessages: number;
  recentNews: NewsItem[];
  recentAdmissions: AdmissionApplication[];
  upcomingEvents: EventItem[];
  analytics: AnalyticsData;
}

// ==========================================
// Cloudinary
// ==========================================
export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
  transformation?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  };
}

// ==========================================
// Email
// ==========================================
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailTemplateProps {
  schoolName?: string;
  schoolLogo?: string;
  schoolEmail?: string;
  schoolPhone?: string;
}

// ==========================================
// Component Props
// ==========================================
export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ==========================================
// SEO
// ==========================================
export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: PageType;
  publishedAt?: string;
  author?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export interface SchemaOrg {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}