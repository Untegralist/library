import { NextAuthOptions, getServerSession } from "next-auth"; // ← Added getServerSession here
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.id || !credentials?.password) {
          return null;
        }

        const writer = await prisma.writer.findUnique({
          where: { id: credentials.id },
        });

        if (writer && writer.password === credentials.password) {
          return { id: writer.id, name: writer.id };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

// Helper function to get current user
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}