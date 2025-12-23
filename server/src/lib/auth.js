import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { toNodeHandler } from "better-auth/node";
import prisma from "./lib/db.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma),
  baseURL: process.env.AUTH_BASE_URL, // https://orbital-d7we.onrender.com
  basePath: "/api/auth",
  trustedOrigins: [process.env.CLIENT_URL],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
});

export const authHandler = toNodeHandler(auth);
