import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SettingsForm } from "./settings-form";
import { db } from "@/lib/db";
import { cache } from "react";
import { Settings, Globe, Palette, Mail, Phone, MapPin } from "lucide-react";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Settings",
};

// ==========================================
// Data Fetching
// ==========================================
const getSettings = cache(async () => {
  try {
    return await db.siteSetting.findFirst();
  } catch {
    return null;
  }
});

// ==========================================
// Admin Settings Page Component
// ==========================================
export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage school information and website settings
        </p>
      </div>

      {/* Quick Info */}
      {settings && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Globe className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">School</p>
              <p className="text-sm font-semibold truncate">{settings.schoolName}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Mail className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-semibold truncate">{settings.email || "-"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Phone className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-semibold truncate">{settings.phone || "-"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="h-5 w-5 text-red-600 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm font-semibold truncate">{settings.address ? "Set" : "-"}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Form */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            Site Settings
          </CardTitle>
          <CardDescription>
            Update your school information, contact details, and appearance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}