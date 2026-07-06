"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, CheckCircle2, User, Mail, Phone, FileText, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ==========================================
// ContactForm Component
// ==========================================
export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        reset();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                Message Sent!
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Thank you for contacting us. We&apos;ll respond within 24 hours.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name & Email Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            label="Full Name"
            placeholder="John Doe"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            disabled={loading}
            {...register("name")}
          />
        </div>
        <div>
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            disabled={loading}
            {...register("email")}
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <Input
          label="Phone Number (Optional)"
          placeholder="+92 300 1234567"
          leftIcon={<Phone className="h-4 w-4" />}
          error={errors.phone?.message}
          disabled={loading}
          {...register("phone")}
        />
      </div>

      {/* Subject */}
      <div>
        <Input
          label="Subject"
          placeholder="What is this regarding?"
          leftIcon={<FileText className="h-4 w-4" />}
          error={errors.subject?.message}
          disabled={loading}
          {...register("subject")}
        />
      </div>

      {/* Message */}
      <div>
        <Textarea
          label="Your Message"
          placeholder="Tell us how we can help you..."
          rows={5}
          error={errors.message?.message}
          disabled={loading}
          {...register("message")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Please be as detailed as possible to help us serve you better.
        </p>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground">
          We respect your privacy and will never share your information.
        </p>
        <Button
          type="submit"
          disabled={loading || !isDirty}
          size="lg"
          className={cn(
            "gap-2 min-w-[180px]",
            loading && "opacity-70"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Sent!
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}