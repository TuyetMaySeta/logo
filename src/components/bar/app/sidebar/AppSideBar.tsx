import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import useAuthStore from "@/stores/authStore";
import { SidebarNavigationMenu } from "./SidebarNavigationMenu";
import { SidebarUserSection } from "./SidebarUserSection";
import { Logo } from "./SidebarOrganizationSelection";

export function AppSidebar() {
  const { t } = useTranslation("navbar");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleProfileClick = () => {
    navigate({ to: "/profile" });
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth/login" });
  };

  return (
    <Sidebar collapsible="icon" className="z-50">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        {isAuthenticated && <SidebarNavigationMenu />}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserSection
          isAuthenticated={isAuthenticated}
          user={user}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
          t={t}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
