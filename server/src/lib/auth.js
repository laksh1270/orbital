import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { deviceAuthorization } from "better-auth/plugins";
import prisma from "./db.js";

export const auth = betterAuth({
  // ✅ Database
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // ✅ MUST be backend URL (Render in prod, localhost in dev)
  baseURL: process.env.AUTH_BASE_URL,

  // ✅ DO NOT CHANGE
  basePath: "/api/auth",

  // ✅ Frontend URL (Vercel)
  trustedOrigins: [process.env.CLIENT_URL],

  // ✅ GitHub OAuth
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },

  // ✅ Device flow plugin
  plugins: [
    deviceAuthorization({
      expiresIn: "30m",
      interval: "5s",
    }),
  ],

  // ✅ Helpful for debugging
  logger: {
    level: "debug",
  },
});
