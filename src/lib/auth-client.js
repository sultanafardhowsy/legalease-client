


import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL, // your Next.js: localhost:3000
});

export const { signIn, signUp, useSession } = authClient;

export const getClientToken = async () => {
  try {
    const res = await authClient.getSession();
    return res?.data?.session?.token ?? null; // returns null if not logged in, no redirect
  } catch {
    return null; // ✅ never throw, never redirect
  }
};
// import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
//   fetchOptions: {
//     onError: (ctx) => {
//       // ✅ prevent better-auth from redirecting on 401
//       if (ctx.response.status === 401) {
//         return;
//       }
//     },
//   },
// });

// export const { signIn, signUp, useSession } = authClient;

// export const getClientToken = async () => {
//   try {
//     const res = await authClient.getSession();
//     return res?.data?.session?.token ?? null;
//   } catch {
//     return null; // ✅ never redirect, just return null
//   }
// };