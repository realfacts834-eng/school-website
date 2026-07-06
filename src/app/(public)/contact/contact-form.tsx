"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
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
        showToast("Message sent!", "success");
        reset();
      } else {
        showToast("Failed!", "error");
      }
    } catch {
      showToast("Error!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Name" {...register("name")} />
      <Input placeholder="Email" {...register("email")} />
      <Input placeholder="Subject" {...register("subject")} />
      <textarea {...register("message")} placeholder="Message" rows={4} className="w-full border rounded-lg p-2" />
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        Send
      </Button>
    </form>
  );
}