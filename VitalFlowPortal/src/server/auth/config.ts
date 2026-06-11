import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "~/server/db";
import { getHisPatientIdByDni } from "~/server/services/his/vitalflow-adapter";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  trustHost: true,
  providers: [
    // GoogleProvider temporarily disabled - will re-enable after testing
    // GoogleProvider({
    //     clientId: process.env.AUTH_GOOGLE_ID,
    //     clientSecret: process.env.AUTH_GOOGLE_SECRET,
    // }),
    
    // Simple Patient Login by DNI
    CredentialsProvider({
        id: "paciente-dni",
        name: "Acceso Paciente (DNI)",
        credentials: {
          dni: { label: "DNI", type: "text", placeholder: "12345678" },
          password: { label: "Contraseña", type: "password" }
        },
        async authorize(credentials) {
            if (!credentials?.dni || !credentials?.password) return null;

            // ONLY ACCEPT PASSWORD "1234" FOR ALL DNIs DURING TESTING
            if (credentials.password !== "1234") {
              console.warn(`[DNI Auth] Invalid password for DNI ${credentials.dni}`);
              return null;
            }

            try {
              const dni = credentials.dni as string;
              const email = `dni-${dni}@pacientes.local`;
              const username = `paciente-${dni}`;
              const DEMO_HIS_ID = "edf33d1d-bf17-41f4-9e40-40c2e21d1eb6"; // fallback demo

              let hisPatientId = DEMO_HIS_ID;
              try {
                const resolvedHisId = await getHisPatientIdByDni(dni);
                if (resolvedHisId) {
                  hisPatientId = resolvedHisId;
                }
              } catch (e) {
                console.warn(`[DNI Auth] HIS lookup failed for DNI ${dni}, using demo fallback`, e);
              }

              // 1. Find or create User using upsert
              const user = await db.user.upsert({
                where: { email },
                update: {},
                create: {
                  email,
                  name: `Paciente ${dni}`,
                  role: "PATIENT",
                  username,
                  password: "1234"
                }
              });
              console.log(`[DNI Auth] User: ${user.id} (${email})`);

              // 2. Find or create Patient linked to HIS
              let patient = await db.patient.findUnique({
                where: { userId: user.id }
              });

              if (!patient) {
                patient = await db.patient.create({
                  data: {
                    userId: user.id,
                    hisId: hisPatientId,
                    dni,
                    onboardingCompleted: true
                  }
                });
                console.log(`[DNI Auth] Created patient for user ${user.id} linked to HIS ${hisPatientId}`);
              } else {
                const shouldUpdate = patient.dni !== dni || patient.hisId !== hisPatientId || !patient.onboardingCompleted;
                if (shouldUpdate) {
                  patient = await db.patient.update({
                    where: { userId: user.id },
                    data: {
                      dni,
                      hisId: hisPatientId,
                      onboardingCompleted: true,
                    },
                  });
                  console.log(`[DNI Auth] Updated patient mapping for user ${user.id} -> HIS ${hisPatientId}`);
                } else {
                  console.log(`[DNI Auth] Patient already exists for user ${user.id}`);
                }
              }

              return {
                id: user.id,
                name: user.name,
                email: user.email,
                image: `https://i.pravatar.cc/150?u=${dni}`
              };
            } catch (e) {
              console.error("[DNI Auth] Error:", e);
              return null;
            }
        }
    }),

    // Demo/Test login (test/test)
    CredentialsProvider({
        id: "demo",
        name: "Acceso Demo",
        credentials: {
          username: { label: "Usuario", type: "text" },
          password: { label: "Contraseña", type: "password" }
        },
        async authorize(credentials) {
            if (!credentials?.username || !credentials?.password) return null;

            if (credentials.username === "test" && credentials.password === "test") {
              return {
                id: "test-user-id",
                name: "Paciente de Prueba",
                email: "test@prm.com",
                image: "https://i.pravatar.cc/150?u=mock"
              };
            }

            try {
              const user = await db.user.findUnique({
                where: { username: credentials.username as string },
                include: { professional: true }
              });

              if (user && user.password === credentials.password) {
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                };
              }
            } catch {
              return null;
            }

            return null;
        }
    }),
  ],
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/auth/signin",
  },
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update every 24h
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub || "test-user-id",
        role: token.role as string,
      },
    }),
  },
} satisfies NextAuthConfig;
