import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "./db";

// ==========================================
// TypeScript Types Declaration for NextAuth
// ==========================================
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

// ==========================================
// NextAuth Configuration
// ==========================================
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@school.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Invalid email format");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        try {
          const user = await db.user.findUnique({
            where: { email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              role: true,
              image: true,
            },
          });

          if (!user || !user.password) {
            throw new Error("Invalid email or password");
          }

          if (user.role === "blocked") {
            throw new Error("Account has been blocked. Contact admin.");
          }

          const isValid = await compare(password, user.password);

          if (!isValid) {
            throw new Error("Invalid email or password");
          }

          await db.user.update({
            where: { id: user.id },
            data: { updatedAt: new Date() },
          });

          console.log(`✅ User logged in: ${user.email} (${user.role})`);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role ?? "admin", // ٹائپ سیفٹی کے لیے ڈیفالٹ ویلیو
            image: user.image,
          };
        } catch (error) {
          if (error instanceof Error && error.message.includes("Invalid")) {
            throw error;
          }
          console.error("❌ Auth error:", error);
          throw new Error("Authentication failed. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }

      if (trigger === "update" && session) {
        token.role = session.user.role;
        token.email = session.user.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async signIn({ user }) {
      if (user.role !== "admin" && user.role !== "editor") {
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, ...message) {
      console.error("🔴 NextAuth Error:", code, ...message);
    },
    warn(code, ...message) {
      console.warn("🟡 NextAuth Warning:", code, ...message);
    },
    debug(code, ...message) {
      if (process.env.NODE_ENV === "development") {
        console.log("🔵 NextAuth Debug:", code, ...message);
      }
    },
  },
});
