import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"
import { plugin } from "postcss";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL // Use your actual domain in production
})

plugins :[
jwtClient()
]

// Export the helpers from the specific instance above
export const { signIn, signUp, useSession } = authClient;


