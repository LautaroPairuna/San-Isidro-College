// src/lib/authOptions.ts
import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const ADMIN_EMAIL = "admin@sanisidro.com";
// Contraseña sin hashear: 3steb@n_S4n_!sidr0
const ADMIN_PASSWORD_HASH =
  "$2b$10$5MFadA1FGZNMaN86ZFjniOuxD2240JuNHk8veGL4cRysiZqvRiDLW";

// El diablo tioooo

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Administrador",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Faltan credenciales");
        }
        if (credentials.email !== ADMIN_EMAIL) {
          throw new Error("Email incorrecto");
        }
        const isValid = await bcrypt.compare(
          credentials.password,
          ADMIN_PASSWORD_HASH
        );
        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }
        return { id: "1", name: "Admin", email: credentials.email };
      },
    }),
  ],
  pages: { signIn: "/admin/auth" },
  secret: "temporal-dev-secret",
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.email = user.email;
      return token;
    },
    async session({ session, token }) {
      if (token.email) session.user!.email = token.email as string;
      return session;
    },
  },
};
