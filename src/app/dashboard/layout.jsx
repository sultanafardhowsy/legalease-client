import DashboardNavbar from "@/component/dashboard/DashBoardNavBar";
import DashBoardSideBar from "@/component/dashboard/DashBoardSideBar";
import { getSession } from "@/lib/core/session";

export default async function DashboardLayout({ children }) {
  const user = await getSession();

  return (
    <div className="flex min-h-screen bg-background">
      <DashBoardSideBar user={user} />

      <div className="flex flex-1 flex-col min-w-0">
        <DashboardNavbar />

        <main className="flex-1 overflow-x-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}