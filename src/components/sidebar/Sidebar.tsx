// "use client"

// import * as React from "react"
// import {
//   AudioWaveform,
//   BookOpen,
//   Bot,
//   Command,
//   Frame,
//   GalleryVerticalEnd,
//   Map,
//   PieChart,
//   Settings2,
//   SquareTerminal,
//   Search,
// } from "lucide-react"

// import { Trans } from "@lingui/react"

// import { NavMain } from "@/components/sidebar/nav-main"
// import { NavProjects } from "@/components/sidebar/nav-projects"
// import { NavUser } from "@/components/sidebar/nav-user"
// import { TeamSwitcher } from "@/components/sidebar/Team-Switcher"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
// } from "@/components/ui/sidebar"
// import { Input } from "@/components/ui/input"

// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   teams: [
//     {
//       name: "Acme Inc",
//       logo: GalleryVerticalEnd,
//       plan: "Enterprise",
//     },
//     {
//       name: "Acme Corp.",
//       logo: AudioWaveform,
//       plan: "Startup",
//     },
//     {
//       name: "Evil Corp.",
//       logo: Command,
//       plan: "Free",
//     },
//   ],
//   navMain: [
//     {
//       title: "Playground",
//       url: "#",
//       icon: SquareTerminal,
//       isActive: true,
//       items: [
//         { title: "Home", url: "/" },
//         { title: "SignUp", url: "/signup" },
//         { title: "Data", url: "/data" },
//         { title: "Inbox", url: "/inbox" },
//         { title: "Calendar", url: "/calendar" },
//       ],
//     },
//     {
//       title: "Models",
//       url: "#",
//       icon: Bot,
//       items: [
//         { title: "Genesis", url: "#" },
//         { title: "Explorer", url: "#" },
//         { title: "Quantum", url: "#" },
//       ],
//     },
//     {
//       title: "Documentation",
//       url: "#",
//       icon: BookOpen,
//       items: [
//         { title: "Introduction", url: "#" },
//         { title: "Get Started", url: "#" },
//         { title: "Tutorials", url: "#" },
//         { title: "Changelog", url: "#" },
//       ],
//     },
//     {
//       title: "Settings",
//       url: "#",
//       icon: Settings2,
//       items: [
//         { title: "General", url: "/chart" },
//         { title: "Team", url: "#" },
//         { title: "Billing", url: "#" },
//         { title: "Limits", url: "#" },
//       ],
//     },
//   ],
//   projects: [
//     { name: "Design Engineering", url: "#", icon: Frame },
//     { name: "Sales & Marketing", url: "#", icon: PieChart },
//     { name: "Travel", url: "#", icon: Map },
//   ],
// }

// export const  AppSidebar =({ ...props }: React.ComponentProps<typeof Sidebar>)=> {
//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         <TeamSwitcher teams={data.teams} />
//       </SidebarHeader>

//       <SidebarContent>


//         <NavMain
//           items={data.navMain.map((section) => ({
//             ...section,
//             title: <Trans id={section.title} />,
//             items: section.items.map((item) => ({
//               ...item,
//               title: <Trans id={item.title} />,
//             })),
//           }))}
//         />

//         <NavProjects
//           projects={data.projects.map((project) => ({
//             ...project,
//             name: project.name,
//           }))}
//         />
//       </SidebarContent>

//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>

//       <SidebarRail />
//     </Sidebar>
//   )
// }







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

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/Team-Switcher";
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
        { title: "ui.Calendar", url: "/calendar" },
      ],
    },
    {
      title: "ui.Models",
      url: "#",
      icon: Bot,
      items: [
        { title: "ui.Genesis", url: "#" },
        { title: "ui.Explorer", url: "#" },
        { title: "ui.Quantum", url: "#" },
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
        { title: "ui.Team", url: "#" },
        { title: "ui.Billing", url: "#" },
        { title: "ui.Limits", url: "#" },
      ],
    },
  ],
  projects: [
    { name: "ui.Design Engineering", url: "#", icon: Frame },
    { name: "ui.Sales & Marketing", url: "#", icon: PieChart },
    { name: "ui.Travel", url: "#", icon: Map },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
