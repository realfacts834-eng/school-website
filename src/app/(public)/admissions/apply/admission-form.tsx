"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { admissionSchema, type AdmissionFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CLASSES, GENDERS } from "@/lib/constants";
import {
  Send,
  Loader2,
  User,
  Users,
  Calendar,
  GraduationCap,
  School,
  Home,
  Phone,
  Mail,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// AdmissionForm Component
// ==========================================
export function AdmissionForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: AdmissionFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.showToast("Application submitted successfully!");
        reset();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 8000);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.showToast(result.message || "Failed to submit. Please try again.");
      }
    } catch {
      toast.showToast("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                Application Submitted!
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Thank you for applying. Our admission team will review your application and contact you within 3-5 working days.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ Student Information ============ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-base font-bold">Student Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Student Name"
            placeholder="Full name of student"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.studentName?.message}
            disabled={loading}
            required
            {...register("studentName")}
          />
          <Input
            label="Father's Name"
            placeholder="Full name of father"
            leftIcon={<Users className="h-4 w-4" />}
            error={errors.fatherName?.message}
            disabled={loading}
            required
            {...register("fatherName")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <Input
            label="Date of Birth"
            type="date"
            leftIcon={<Calendar className="h-4 w-4" />}
            error={errors.dob?.message}
            disabled={loading}
            required
            {...register("dob")}
          />
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Gender <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <select
                {...register("gender")}
                disabled={loading}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 pr-10 text-sm
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue
                  disabled:cursor-not-allowed disabled:opacity-50 appearance-none
                  transition-all duration-200"
              >
                <option value="">Select gender</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {errors.gender?.message && (
              <p className="text-xs text-destructive mt-1">{errors.gender.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Applying For Class <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <select
                {...register("applyingClass")}
                disabled={loading}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 pr-10 text-sm
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue
                  disabled:cursor-not-allowed disabled:opacity-50 appearance-none
                  transition-all duration-200"
              >
                <option value="">Select class</option>
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {errors.applyingClass?.message && (
              <p className="text-xs text-destructive mt-1">{errors.applyingClass.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <Input
            label="Previous School (Optional)"
            placeholder="Name of previous school"
            leftIcon={<School className="h-4 w-4" />}
            disabled={loading}
            {...register("previousSchool")}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t" />

      {/* ============ Contact Information ============ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Phone className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-base font-bold">Contact Information</h3>
        </div>

        <Input
          label="Address"
          placeholder="Full residential address"
          leftIcon={<Home className="h-4 w-4" />}
          error={errors.address?.message}
          disabled={loading}
          required
          {...register("address")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Input
            label="Phone Number"
            placeholder="+92 300 1234567"
            leftIcon={<Phone className="h-4 w-4" />}
            error={errors.phone?.message}
            disabled={loading}
            required
            {...register("phone")}
          />
          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="email@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            disabled={loading}
            {...register("email")}
          />
        </div>
      </div>

      {/* ============ Submit ============ */}
      <div className="border-t pt-6">
        <Button
          type="submit"
          size="lg"
          className="w-full gap-2"
          disabled={loading || !isDirty}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting Application...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Submit Application
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          By submitting this form, you agree to our admission terms and privacy policy.
        </p>
      </div>
    </form>
  );
}