import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link } from "@tanstack/react-router";
import { getMenuSections, type MenuItem } from "./menuConfig";
import { ChevronDown, ChevronRight } from "lucide-react";

export function SidebarNavigationMenu() {
  const menuSections = getMenuSections();

  const renderMenuItem = (item: MenuItem) => {
    const hasSubItems = item.items && item.items.length > 0;

    if (hasSubItems) {
      return (
        <Collapsible
          key={item.title}
          asChild
          defaultOpen={false}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                variant="default"
                size="default"
                className="!h-10 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!w-10"
              >
                <item.icon className="!h-4 !w-4 !min-h-4 !min-w-4 shrink-0" />
                <span className="text-primary">{item.title}</span>
                <ChevronRight className="!h-4 !w-4 !min-h-4 !min-w-4 ml-auto shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild>
                      <Link to={subItem.url}>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          className="!h-10 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!w-10"
        >
          <Link to={item.url}>
            <item.icon className="!h-4 !w-4 !min-h-4 !min-w-4 shrink-0" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <>
      {menuSections.map((section) => (
        <Collapsible asChild key={section.label} defaultOpen={section.defaultOpen}>
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="group/collapsible w-full flex items-center text-sm font-extralight text-primary hover:bg-accent hover:text-accent-foreground rounded-md">
                <p className="text-base font-medium">{section.label}</p>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => renderMenuItem(item))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))}
    </>
  );
}
