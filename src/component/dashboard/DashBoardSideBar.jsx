

import { getSession } from "@/lib/core/session";
import { LayoutSideContentLeft, Bell, Envelope, Gear, House, Magnifier, Person, Briefcase } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { Bookmark, Building, CreditCard, FileText, LayoutDashboard, Search, Settings, Users } from "lucide-react";
import Link from "next/link";
import logo from "@/asset/logo.png";
import Image from "next/image";
export async function DashBordSideBar() {

  const user = await getSession()

  const client = [
    { icon: LayoutDashboard, href: "/dashboard/client", label: "Dashboard" },
    { icon: Bookmark, href: "/dashboard/client/hiring-history", label: "Hiring History" },
    { icon: Person, href: "/dashboard/client/profile", label: "Profile" },
     { icon: Users, href: "/dashboard/client/comments", label: "My Reviews" },
  ];

  const lawyer = [
    { icon: House, href: "/dashboard/lawyer", label: "Home" },
    { icon: Magnifier, href: "/dashboard/lawyer/hiringhistory", label: "Hiring History" },
    //{ icon: Bell, href: "/dashboard/recruiter/jobs/new", label: "Post a job" },
    //{ icon: Briefcase, href: "/dashboard/recruiter/company", label: "Company" },
    { icon: Person, href: "/dashboard/lawyer/manage-legal-profile", label: "Profile" },
    //{ icon: Gear, href: "/dashboard/recruiter/settings", label: "Settings" },
  ];

  const admin = [
    { icon: LayoutDashboard, href: "/dashboard/admin", label: "Dashboard" },
    { icon: Users, href: "/dashboard/admin/users", label: "Users" },
    { icon: Building, href: "/dashboard/admin/companies", label: "Companies" },
    { icon: Briefcase, href: "/dashboard/admin/jobs", label: "Jobs" },
    { icon: CreditCard, href: "/dashboard/admin/payments", label: "Payments" },
    { icon: Gear, href: "/dashboard/admin/settings", label: "Settings" },
  ];

  const navLinksMap = {
    client: client,
    lawyer: lawyer,
    admin: admin
  }

  const navItems = navLinksMap[user?.role || 'client']

  const navContent = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href || "#"}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
        >
          <item.icon className="size-5 text-muted" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
  return (
    <>

      <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
        <Image
          src={logo}
          alt="LegalEase"
          width={140}
          height={40}
          className="w-auto h-auto"
          priority
        />
        {navContent}
      </aside>
      <Drawer>
        <Button className="lg:hidden" variant="secondary">
          <LayoutSideContentLeft />
          Sidebar
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading>Navigation</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                {navContent}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}