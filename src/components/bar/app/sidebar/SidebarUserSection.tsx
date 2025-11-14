import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { LogOut, User, Settings, ChevronsUpDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { UserState } from "@/stores/authStore";
import UserAvatar from "@/components/employee/list/Avartar";
import useAuthStore from "@/stores/authStore";

interface SidebarUserSectionProps {
  isAuthenticated: boolean;
  user: UserState;
  onProfileClick?: () => void;
  onLogout: () => void;
  t: (key: string) => string;
}

export function SidebarUserSection({
  // isAuthenticated,
  // user,
  onProfileClick,
  onLogout,
  t,
}: SidebarUserSectionProps) {
  const { isMobile } = useSidebar();
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild size="lg">
            <Link to="/auth/login">
              <User className="h-4 w-4" />
              <span>{t("login") || "Login"}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <UserAvatar
                  name={user.full_name ?? "Anonymous"}
                  size={32}
                  avatarUrl={user.avatar_url}
                />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.full_name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <UserAvatar
                    name={user.full_name ?? "Anonymous"}
                    size={32}
                    avatarUrl={user.avatar_url}
                  />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.full_name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/change-password" className="flex w-full">
                <Settings className="mr-4 h-4 w-4" />
                <span>Change Password</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
