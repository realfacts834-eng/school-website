import { z } from "zod";

// ==========================================
// ہیلپر - فون نمبر ریجیکس
// ==========================================
const phoneRegex = /^(\+92|0)?3\d{2}\d{7}$/;
const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

// ==========================================
// کانٹیکٹ فارم
// ==========================================
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .regex(phoneRegex, "Please enter a valid Pakistani phone number")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject must be less than 100 characters")
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .trim(),
});

// ==========================================
// ایڈمشن فارم
// ==========================================
export const admissionSchema = z.object({
  studentName: z
    .string()
    .min(2, "Student name must be at least 2 characters")
    .max(50, "Student name must be less than 50 characters")
    .trim(),
  fatherName: z
    .string()
    .min(2, "Father name must be at least 2 characters")
    .max(50, "Father name must be less than 50 characters")
    .trim(),
  motherName: z
    .string()
    .max(50, "Mother name must be less than 50 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const d = new Date(date);
      const now = new Date();
      const age = now.getFullYear() - d.getFullYear();
      return age >= 3 && age <= 25;
    }, "Student age must be between 3 and 25 years"),
  gender: z.enum(["Male", "Female"], {
    required_error: "Please select gender",
  }),
  applyingClass: z
    .string()
    .min(1, "Please select a class"),
  previousSchool: z
    .string()
    .max(100, "School name must be less than 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters")
    .trim(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Please enter a valid Pakistani phone number (e.g., 03001234567)"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100)
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal("")),
});

// ==========================================
// نیوز / بلاگ فارم
// ==========================================
export const newsSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),
  excerpt: z
    .string()
    .max(300, "Excerpt must be less than 300 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  featuredImage: z
    .string()
    .regex(urlRegex, "Invalid image URL")
    .optional()
    .or(z.literal("")),
  isPublished: z.boolean().default(false),
  isBreaking: z.boolean().default(false),
});

// ==========================================
// بلاگ فارم
// ==========================================
export const blogSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),
  excerpt: z
    .string()
    .max(300, "Excerpt must be less than 300 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  featuredImage: z
    .string()
    .regex(urlRegex, "Invalid image URL")
    .optional()
    .or(z.literal("")),
  tags: z
    .string()
    .max(200)
    .trim()
    .optional()
    .or(z.literal("")),
  isPublished: z.boolean().default(false),
});

// ==========================================
// ایونٹ فارم
// ==========================================
export const eventSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters")
    .trim(),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), 
      "Event date cannot be in the past"),
  endDate: z
    .string()
    .optional()
    .or(z.literal("")),
  time: z
    .string()
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(200, "Location must be less than 200 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  image: z
    .string()
    .regex(urlRegex, "Invalid image URL")
    .optional()
    .or(z.literal("")),
  isPublished: z.boolean().default(false),
});

// ==========================================
// فیکلٹی فارم
// ==========================================
export const facultySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation must be less than 100 characters")
    .trim(),
  qualification: z
    .string()
    .max(200, "Qualification must be less than 200 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  experience: z
    .string()
    .max(100, "Experience must be less than 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  image: z
    .string()
    .regex(urlRegex, "Invalid image URL")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100)
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(phoneRegex, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
});

// ==========================================
// گیلری فارم
// ==========================================
export const gallerySchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  coverImage: z
    .string()
    .regex(urlRegex, "Invalid image URL")
    .optional()
    .or(z.literal("")),
  isPublished: z.boolean().default(false),
});

// ==========================================
// سیٹنگز فارم
// ==========================================
export const settingsSchema = z.object({
  schoolName: z
    .string()
    .min(2, "School name must be at least 2 characters")
    .max(100, "School name must be less than 100 characters")
    .trim(),
  tagline: z
    .string()
    .max(200, "Tagline must be less than 200 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100)
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(phoneRegex, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  altPhone: z
    .string()
    .regex(phoneRegex, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  whatsapp: z
    .string()
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(200, "Address must be less than 200 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color code")
    .optional()
    .or(z.literal("")),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color code")
    .optional()
    .or(z.literal("")),
  accentColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color code")
    .optional()
    .or(z.literal("")),
  facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
  youtube: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  googleAnalytics: z.string().optional().or(z.literal("")),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
});

// ==========================================
// نوٹس فارم
// ==========================================
export const noticeSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  content: z
    .string()
    .max(1000, "Content must be less than 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  fileUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
  isUrgent: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

// ==========================================
// ریزلٹ فارم
// ==========================================
export const resultSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  class: z
    .string()
    .min(1, "Class is required"),
  examType: z
    .string()
    .min(1, "Exam type is required"),
  fileUrl: z
    .string()
    .min(1, "File is required")
    .url("Invalid file URL"),
  isPublished: z.boolean().default(false),
});

// ==========================================
// سبسکرائب فارم
// ==========================================
export const subscribeSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100)
    .trim()
    .toLowerCase(),
});

// ==========================================
// ایف اے کیو فارم
// ==========================================
export const faqSchema = z.object({
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(300, "Question must be less than 300 characters")
    .trim(),
  answer: z
    .string()
    .min(10, "Answer must be at least 10 characters")
    .max(1000, "Answer must be less than 1000 characters")
    .trim(),
  isActive: z.boolean().default(true),
});

// ==========================================
// لاگ ان فارم
// ==========================================
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

// ==========================================
// پاسورڈ چینج فارم
// ==========================================
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be less than 50 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// ==========================================
// ٹائپ ایکسپورٹ
// ==========================================
export type ContactFormData = z.infer<typeof contactSchema>;
export type AdmissionFormData = z.infer<typeof admissionSchema>;
export type NewsFormData = z.infer<typeof newsSchema>;
export type BlogFormData = z.infer<typeof blogSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type FacultyFormData = z.infer<typeof facultySchema>;
export type GalleryFormData = z.infer<typeof gallerySchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type NoticeFormData = z.infer<typeof noticeSchema>;
export type ResultFormData = z.infer<typeof resultSchema>;
export type SubscribeFormData = z.infer<typeof subscribeSchema>;
export type FaqFormData = z.infer<typeof faqSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;