import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { useState } from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/Team-Switcher";
import { SecondarySidebar } from "@/components/sidebar/SidebarSubmenu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "ui.Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "ui.Enterprise",
    },
    {
      name: "ui.Acme Corp",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "ui.Evil Corp",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "ui.Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "ui.Home", url: "/" },
        { title: "ui.Sign Up", url: "/signup" },
        { title: "ui.Data", url: "/data" },
        { title: "ui.Inbox", url: "/inbox" },
        { title: "User", url: "/user" },

        { title: "ui.Calendar", url: "/calendar" },
      ],
    },
    {
      title: "ui.Models",
      url: "#",
      icon: Bot,
      items: [
        { title: "ui.Genesis", url: "/kanban" },
        { title: "ui.Chart", url: "/chart" },
        { title: "ui.Quantum", url: "#" },
        { title: "Event", url: "/event" },
      ],
    },
    {
      title: "ui.Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "ui.Introduction", url: "#" },
        { title: "ui.Get Started", url: "#" },
        { title: "ui.Tutorials", url: "#" },
        { title: "ui.Changelog", url: "#" },
      ],
    },
    {
      title: "ui.Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "ui.General", url: "#" },
        { title: "Company", url: "/companymanagement" },
        { title: "ui.Billing", url: "/billing" },
        { title: "Queries", url: "/queries" },
      ],
    },
  ],
  projects: [
    { name: "ui.Design Engineering", url: "#", icon: Frame },
    { name: "ui.Sales & Marketing", url: "#", icon: PieChart },
    { name: "ui.Travel", url: "#", icon: Map },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [collapsed, setCollapsed] = useState(false);

  const handleItemSelect = (slug: string) => {
    if (slug === "genesis") {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} onCollapseChange={setCollapsed} {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={data.navMain} onItemSelect={handleItemSelect} />
          <NavProjects projects={data.projects} />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
      {collapsed && <SecondarySidebar />}
    </div>
  );
}
