


import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL, // your Next.js: localhost:3000
});

export const { signIn, signUp, useSession } = authClient;

export const getClientToken = async () => {
  const res = await authClient.getSession();
  console.log("authClient.getSession() raw:", JSON.stringify(res)); // ← add this
  return res?.data?.session?.token ?? null;
};