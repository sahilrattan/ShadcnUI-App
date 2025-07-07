"use client";

import { Routes, Route } from "react-router-dom";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NavigationMenuBar } from "./components/NavigationMenu";

import Inbox from "./components/Inbox";
import Home from "./routes/home";
import SignUpForm from "./modules/auth/signUp";
import SignInForm from "./modules/auth/signIn";

import UserTable from "./components/user/UserTable";
import Settings from "./routes/settings";
import Account from "./components/Account";
import { Calendar1 } from "./components/Calendar";
// import Chart from "./components/Chart";
import { Toaster } from "./components/ui/sonner";
import KanbanBoard from "./components/kanban/KanbanBoard";
import OrgChart from "./components/OrganisationChart";
import { InvoiceForm } from "./components/InvoiceForm";
import { PushManager } from "./components/PushManager";
import TicketingSystem from "./components/TicketManagement";
import ProfilePage from "./components/ProfilePage";
import SidebarSubmenu from "./components/sidebar/SidebarSubmenu";
const localeMessages = {
  en: () => import("@/locales/en/messages.js"),
  hi: () => import("@/locales/hi/messages.js"),
  de: () => import("@/locales/de/messages.js"),
};

export default function App() {
  const [isLocaleReady, setIsLocaleReady] = useState(false);

  useEffect(() => {
    const loadPreferredLocale = async () => {
      const savedLang = localStorage.getItem("lang") || "en";
      setIsLocaleReady(false);
      try {
        const module = await localeMessages[savedLang]();
        const messages = module.messages || module.default;
        i18n.load(savedLang, messages);
        i18n.activate(savedLang);
      } catch (error) {
        console.error(`Failed to load locale ${savedLang}:`, error);
        const fallback = await localeMessages["en"]();
        i18n.load("en", fallback.messages || fallback.default);
        i18n.activate("en");
      } finally {
        setIsLocaleReady(true);
      }
    };

    loadPreferredLocale();
  }, []);

  if (!isLocaleReady) {
    return <div>Loading translations...</div>;
  }

  return (
    <I18nProvider i18n={i18n}>
      <ThemeProvider>
        <SidebarProvider>
          <div className="flex">
            <AppSidebar />
            <main className="flex-1 min-h-screen overflow-x-hidden">
              <NavigationMenuBar />
              <SidebarTrigger />
              <PushManager />
              <div className="p-4">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/inbox" element={<Inbox />} />
                  <Route path="/signup" element={<SignUpForm />} />
                  <Route path="/data" element={<UserTable />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/calendar" element={<Calendar1 />} />
                  {/* <Route path="/chart" element={<Chart />} />  */}
                  <Route path="/signup" element={<SignUpForm />} />
                  <Route path="/signin" element={<SignInForm />} />
                  <Route path="/kanban" element={<KanbanBoard />} />
                  <Route path="/chart" element={<OrgChart />} />
                  <Route path="/billing" element={<InvoiceForm />} />
                  <Route path="/queries" element={<TicketingSystem />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </div>
            </main>
            <Toaster richColors position="top-center" />
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
