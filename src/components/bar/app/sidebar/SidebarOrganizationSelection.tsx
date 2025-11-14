"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import useThemeStore from "@/stores/useThemeStore";
import { useNavigate } from "@tanstack/react-router";

// Define the organization logos
const organization = {
  name: "SETA INTERNATIONAL",
  logoMini: "/seta-mini.png",
  logoFull: "/seta.png",
  darkLogoMini: "/seta-mini.png",
  darkLogoFull: "/seta-dark.png",
};

export function Logo() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const logo = theme === "dark"
    ? {
        mini: organization.darkLogoMini,
        full: organization.darkLogoFull,
      }
    : {
        mini: organization.logoMini,
        full: organization.logoFull,
      };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={() => navigate({ to: "/" })}
          className="cursor-pointer h-fit min-h-[50px] max-h-[50px]">
          <div className="bg-transparent h-full flex justify-center">
            <img
              src={isCollapsed ? logo.mini : logo.full}
              alt={`${organization.name} Logo`}
              className={`rounded object-contain font-bold ${
                isCollapsed
                  ? "size-9 align-self-center mt-1.5"
                  : "w-[70%] h-[70%]"
              }`}
            />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
