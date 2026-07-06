import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// کلاؤڈ انوائرمنٹ کے لیے آپٹمائزڈ سنگل ٹن پرزما کلائنٹ
const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// لائیو سرور لیس انوائرمنٹ میں میموری لیک سے بچنے کے لیے پروسیس ہینڈلرز صرف سنگل ٹائم رن ہوں گے
if (process.env.NODE_ENV === "production" && !globalForPrisma.prisma) {
  const gracefulShutdown = async () => {
    console.log("🔌 Disconnecting from database...");
    await db.$disconnect();
    process.exit(0);
  };

  // سرور لیس میں یہ صرف ایک بار ہی رجسٹر ہوں گے
  process.removeAllListeners("SIGINT");
  process.removeAllListeners("SIGTERM");
  
  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
}
