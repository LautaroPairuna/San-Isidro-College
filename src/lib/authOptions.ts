// src/lib/authOptions.ts
import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

/**
 * Credenciales del admin: ahora salen del entorno, no del código.
 *
 * `ADMIN_PASSWORD_HASH` es el hash bcrypt de la contraseña, nunca la contraseña
 * en texto plano. Para generarlo:
 *
 *   node -e "console.log(require('bcrypt').hashSync('LA_CONTRASEÑA', 10))"
 *
 * La validación se hace al momento de iniciar sesión y no al importar el
 * módulo: si tirara al importar, cualquier build o página pública que arrastre
 * este archivo se caería por una variable que solo hace falta para el login.
 */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim() ?? "";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH?.trim() ?? "";

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
        if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
          // NextAuth le devuelve al navegador un error genérico, así que la
          // causa real queda en el log del servidor: si no, un deploy sin las
          // variables se ve igual que una contraseña equivocada.
          console.error(
            "[auth] Falta configurar ADMIN_EMAIL y/o ADMIN_PASSWORD_HASH: nadie puede entrar al administrador"
          );
          throw new Error("El acceso al administrador no está configurado");
        }
        if (!credentials?.email || !credentials.password) {
          throw new Error("Faltan credenciales");
        }
        if (
          credentials.email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()
        ) {
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
  secret: process.env.NEXTAUTH_SECRET,
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
