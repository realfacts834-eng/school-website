"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, type SettingsFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Loader2,
  School,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Palette,
} from "lucide-react";

// ==========================================
// Types
// ==========================================
interface SettingsFormProps {
  settings: Record<string, any> | null;
}

// ==========================================
// SettingsForm Component
// ==========================================
export function SettingsForm({ settings }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(settings?.logo || "");
  const [logoWhite, setLogoWhite] = useState(settings?.logoWhite || "");
  const [favicon, setFavicon] = useState(settings?.favicon || "");
  const [ogImage, setOgImage] = useState(settings?.ogImage || "");
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      schoolName: settings?.schoolName || "",
      tagline: settings?.tagline || "",
      email: settings?.email || "",
      phone: settings?.phone || "",
      altPhone: settings?.altPhone || "",
      whatsapp: settings?.whatsapp || "",
      address: settings?.address || "",
      officeTiming: settings?.officeTiming || "",
      primaryColor: settings?.primaryColor || "#0F172A",
      secondaryColor: settings?.secondaryColor || "#3B82F6",
      accentColor: settings?.accentColor || "#D4AF37",
      facebook: settings?.facebook || "",
      twitter: settings?.twitter || "",
      instagram: settings?.instagram || "",
      youtube: settings?.youtube || "",
      linkedin: settings?.linkedin || "",
      metaTitle: settings?.metaTitle || "",
      metaDescription: settings?.metaDescription || "",
      googleAnalytics: settings?.googleAnalytics || "",
      mapEmbedUrl: settings?.mapEmbedUrl || "",
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        logo,
        logoWhite,
        favicon,
        ogImage,
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Settings saved successfully!");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to save settings");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ============ Branding ============ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <School className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">Branding</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="School Name" placeholder="School name" leftIcon={<School className="h-4 w-4" />} {...register("schoolName")} error={errors.schoolName?.message} disabled={loading} />
          <Input label="Tagline" placeholder="Building Future Leaders" leftIcon={<Globe className="h-4 w-4" />} {...register("tagline")} disabled={loading} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div><label className="text-sm font-medium mb-1.5 block">Logo (Light)</label><ImageUploader onUpload={setLogo} currentImage={logo} /></div>
          <div><label className="text-sm font-medium mb-1.5 block">Logo (Dark)</label><ImageUploader onUpload={setLogoWhite} currentImage={logoWhite} /></div>
        </div>
      </div>

      <div className="border-t" />

      {/* ============ Contact Info ============ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">Contact Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Email" type="email" placeholder="info@school.edu.pk" leftIcon={<Mail className="h-4 w-4" />} {...register("email")} disabled={loading} />
          <Input label="Phone" placeholder="+92 300 1234567" leftIcon={<Phone className="h-4 w-4" />} {...register("phone")} disabled={loading} />
          <Input label="Alt Phone" placeholder="+92 301 7654321" leftIcon={<Phone className="h-4 w-4" />} {...register("altPhone")} disabled={loading} />
          <Input label="WhatsApp" placeholder="+923001234567" leftIcon={<Phone className="h-4 w-4" />} {...register("whatsapp")} disabled={loading} />
        </div>
        <div className="mt-4">
          <Input label="Address" placeholder="Full address" leftIcon={<MapPin className="h-4 w-4" />} {...register("address")} disabled={loading} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Input label="Office Timing" placeholder="Mon-Fri: 8:00 AM - 2:00 PM" leftIcon={<Clock className="h-4 w-4" />} {...register("officeTiming")} disabled={loading} />
          <Input label="Google Maps Embed URL" placeholder="https://maps.google.com/..." {...register("mapEmbedUrl")} disabled={loading} />
        </div>
      </div>

      <div className="border-t" />

      {/* ============ Social Links ============ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Facebook className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">Social Media Links</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Facebook" placeholder="https://facebook.com/..." leftIcon={<Facebook className="h-4 w-4" />} {...register("facebook")} disabled={loading} />
          <Input label="Twitter" placeholder="https://twitter.com/..." leftIcon={<Twitter className="h-4 w-4" />} {...register("twitter")} disabled={loading} />
          <Input label="Instagram" placeholder="https://instagram.com/..." leftIcon={<Instagram className="h-4 w-4" />} {...register("instagram")} disabled={loading} />
          <Input label="YouTube" placeholder="https://youtube.com/..." leftIcon={<Youtube className="h-4 w-4" />} {...register("youtube")} disabled={loading} />
          <Input label="LinkedIn" placeholder="https://linkedin.com/..." leftIcon={<Linkedin className="h-4 w-4" />} {...register("linkedin")} disabled={loading} />
        </div>
      </div>

      <div className="border-t" />

      {/* ============ Appearance ============ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">Appearance</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Primary Color</label>
            <div className="flex items-center gap-2">
              <input type="color" {...register("primaryColor")} className="w-10 h-10 rounded cursor-pointer border" />
              <Input {...register("primaryColor")} disabled={loading} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Secondary Color</label>
            <div className="flex items-center gap-2">
              <input type="color" {...register("secondaryColor")} className="w-10 h-10 rounded cursor-pointer border" />
              <Input {...register("secondaryColor")} disabled={loading} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Accent Color</label>
            <div className="flex items-center gap-2">
              <input type="color" {...register("accentColor")} className="w-10 h-10 rounded cursor-pointer border" />
              <Input {...register("accentColor")} disabled={loading} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t" />

      {/* ============ SEO ============ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">SEO & Analytics</h3>
        </div>
        <Input label="Meta Title" placeholder="School Name - Building Future Leaders" {...register("metaTitle")} disabled={loading} />
        <div className="mt-4">
          <Textarea label="Meta Description" placeholder="Brief description for search engines..." rows={2} {...register("metaDescription")} disabled={loading} />
        </div>
        <div className="mt-4">
          <Input label="Google Analytics ID" placeholder="G-XXXXXXXXXX" {...register("googleAnalytics")} disabled={loading} />
        </div>
      </div>

      {/* ============ Submit ============ */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button type="submit" disabled={loading} size="lg" className="gap-2 min-w-[160px]">
          {loading ? (
            <><Loader2 className="h-5 w-5 animate-spin" />Saving...</>
          ) : (
            <><Save className="h-5 w-5" />Save Settings</>
          )}
        </Button>
      </div>
    </form>
  );
}