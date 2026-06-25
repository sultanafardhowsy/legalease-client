import "server-only";
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

export const getSession = async () => {
  try {
    // 1. Await the headers and pass them to the API handler
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    // 2. Return the user object if the session exists, otherwise return null
    return sessionData?.user || null;
  } catch (error) {
    console.error("Failed to fetch user session:", error);
    return null;
  }
};


export const requireRole =async(role) =>{
const user = await getSession()
if(!user){
redirect('/auth/signup')
}
if(user.role !== role){
 return redirect('/unauthorized')
}
return user;
}