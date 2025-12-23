import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // ✅ Backend URL (Render)
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,

  plugins: [
    deviceAuthorizationClient(),
  ],
});
