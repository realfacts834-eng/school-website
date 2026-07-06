"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { admissionSchema, type AdmissionFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, CheckCircle } from "lucide-react";

export function AdmissionForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
  });

  const onSubmit = async (data: AdmissionFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        reset();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 8000);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground">We will contact you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Student Name *</label>
          <Input placeholder="Full name" {...register("studentName")} />
          {errors.studentName && <p className="text-xs text-red-500 mt-1">{errors.studentName.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Father Name *</label>
          <Input placeholder="Father's full name" {...register("fatherName")} />
          {errors.fatherName && <p className="text-xs text-red-500 mt-1">{errors.fatherName.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Date of Birth *</label>
          <Input type="date" {...register("dob")} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Gender *</label>
          <select {...register("gender")} className="w-full h-10 rounded-lg border px-3 text-sm bg-background">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Class *</label>
          <Input placeholder="e.g. Class 5" {...register("applyingClass")} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Previous School</label>
        <Input placeholder="Previous school name" {...register("previousSchool")} />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Address *</label>
        <Input placeholder="Full address" {...register("address")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Phone *</label>
          <Input placeholder="+92 300 1234567" {...register("phone")} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <Input placeholder="email@example.com" {...register("email")} />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        {loading ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}