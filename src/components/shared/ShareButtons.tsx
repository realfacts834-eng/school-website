"use client";

import {
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
  Share2,
  MessageCircle,
  Send,
  Mail,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// Types
// ==========================================
interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
  className?: string;
  variant?: "inline" | "dropdown" | "floating";
  showLabel?: boolean;
  platforms?: ("facebook" | "twitter" | "linkedin" | "whatsapp" | "email" | "copy")[];
}

// ==========================================
// Share Platform Config
// ==========================================
const sharePlatforms = {
  facebook: {
    label: "Facebook",
    icon: Facebook,
    color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  twitter: {
    label: "Twitter",
    icon: Twitter,
    color: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin,
    color: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]",
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  whatsapp: {
    label: "WhatsApp",
    icon: MessageCircle,
    color: "hover:bg-[#25D366]/10 hover:text-[#25D366]",
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  },
  email: {
    label: "Email",
    icon: Mail,
    color: "hover:bg-muted hover:text-foreground",
    getUrl: (url: string, title: string, description?: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent((description || "") + "\n\n" + url)}`,
  },
  copy: {
    label: "Copy Link",
    icon: Link2,
    color: "hover:bg-muted hover:text-foreground",
    getUrl: (url: string) => url,
  },
};

// ==========================================
// ShareButtons Component
// ==========================================
export function ShareButtons({
  title,
  url,
  description,
  className,
  variant = "inline",
  showLabel = false,
  platforms = ["facebook", "twitter", "linkedin", "whatsapp", "copy"],
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nativeShared, setNativeShared] = useState(false);

  // Copy to clipboard
  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  // Native Web Share API
  const nativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
        setNativeShared(true);
        setTimeout(() => setNativeShared(false), 2000);
      } catch {
        // User cancelled
      }
    }
  }, [title, description, url]);

  // Handle share click
  const handleShare = (platform: keyof typeof sharePlatforms) => {
    if (platform === "copy") {
      copyLink();
      return;
    }

    const shareUrl = sharePlatforms[platform].getUrl(url, title, description);
    
    if (platform === "email") {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    }
    
    setDropdownOpen(false);
  };

  // Render share button
  const renderShareButton = (platform: keyof typeof sharePlatforms) => {
    const config = sharePlatforms[platform];
    const isCopied = platform === "copy" && copied;

    return (
      <button
        key={platform}
        onClick={() => handleShare(platform)}
        className={cn(
          "inline-flex items-center gap-2 p-2 rounded-lg transition-all duration-200",
          "text-muted-foreground",
          config.color,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue"
        )}
        title={config.label}
        aria-label={`Share on ${config.label}`}
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <config.icon className="h-4 w-4" />
        )}
        {showLabel && (
          <span className="text-xs font-medium">
            {isCopied ? "Copied!" : config.label}
          </span>
        )}
      </button>
    );
  };

  // Floating variant
  if (variant === "floating") {
    return (
      <div className={cn("fixed right-4 top-1/2 -translate-y-1/2 z-40", className)}>
        <div className="flex flex-col gap-1 bg-background/80 backdrop-blur-sm border border-border rounded-xl p-1.5 shadow-lg">
          {platforms.map(renderShareButton)}
          
          {/* Native Share (Mobile) */}
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              onClick={nativeShare}
              className={cn(
                "inline-flex items-center gap-2 p-2 rounded-lg transition-all duration-200",
                "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title="Share"
            >
              {nativeShared ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Dropdown variant
  if (variant === "dropdown") {
    return (
      <div className={cn("relative", className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 bg-background border border-border rounded-xl shadow-xl p-2 z-50 min-w-[160px]"
            >
              {platforms.map((platform) => {
                const config = sharePlatforms[platform];
                const isCopied = platform === "copy" && copied;

                return (
                  <button
                    key={platform}
                    onClick={() => handleShare(platform)}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors",
                      "hover:bg-muted"
                    )}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <config.icon className="h-4 w-4" />
                    )}
                    {isCopied ? "Copied!" : config.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {showLabel && (
        <span className="text-xs text-muted-foreground mr-1 font-medium">
          Share:
        </span>
      )}
      {platforms.map(renderShareButton)}
    </div>
  );
}