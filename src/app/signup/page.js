export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import SignUpPage from "@/component/SignUp";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-content2">
        <p className="text-default-500">Loading...</p>
      </div>
    }>
      <SignUpPage />
    </Suspense>
  );
}