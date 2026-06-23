import { Suspense } from "react";
import BrowseLawyersPage from "@/component/BrowseLawyersPage";

export default function DashboardAdminLawyersPage() {
  return (
    <Suspense fallback={null}>
      <BrowseLawyersPage />
    </Suspense>
  );
}