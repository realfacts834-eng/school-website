import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { 
        protocol: "https", 
        hostname: "res.cloudinary.com",
        pathname: "/**", // اس سے کلاؤڈینیری کی تمام امیجز بغیر کسی ایرر کے لوڈ ہوں گی
      },
      { 
        protocol: "https", 
        hostname: "images.unsplash.com",
        pathname: "/**", // ان سپلیش کی امیجز کے لیے بھی پاتھ اوپن کر دیا
      },
    ],
    formats: ["image/avif", "image/webp"], // بہترین اسپیڈ اور پرفارمنس کے لیے فارمیٹس
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
