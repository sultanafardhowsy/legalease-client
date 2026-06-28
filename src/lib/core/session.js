import "server-only";
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

const getSessionData = async () => {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }
};

export const getSession = async () => {
  const sessionData = await getSessionData();
  console.log(sessionData,"from session");
  return sessionData?.user || null;
};

// export const getUserToken = async () => {
//   const sessionData = await getSessionData();
//   return sessionData?.session?.token || null;
// };
export const getUserToken = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return session?.session?.token || null;
}


// ✅ JWT for Express backend Bearer auth
export const getUserJWT = async () => {
  try {
    const { data } = await auth.api.getToken({
      headers: await headers(),
    });
    return data?.token || null;
  } catch (error) {
    console.error("Failed to fetch JWT:", error);
    return null;
  }
};

export const getSessionAndToken = async () => {
  const sessionData = await getSessionData();
  return {
    user: sessionData?.user || null,
    token: sessionData?.session?.token || null,
  };
};



export const requireAuth = async () => {
  const user = await getSession();
  if (!user) redirect("/auth/signup");
  return user;
};

// export const requireRole = async (role) => {
//   const user = await requireAuth();
//   const allowedRoles = Array.isArray(role) ? role : [role];
//   if (!allowedRoles.includes(user.role)) redirect("/unauthorized");
//   return user;
// };

// Convenience helpers for your 3 fixed roles
export const requireAdmin = () => requireRole("admin");
export const requireLawyer = () => requireRole(["admin", "lawyer"]);
export const requireClient = () => requireRole(["admin", "client"]);