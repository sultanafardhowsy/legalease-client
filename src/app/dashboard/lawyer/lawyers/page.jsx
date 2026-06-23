import { Suspense } from "react";
import BrowseLawyersPage from "@/component/BrowseLawyersPage";

export default function DashboardLawyerLawyersPage() {
  return (
    <Suspense fallback={null}>
      <BrowseLawyersPage />
    </Suspense>
  );
}