import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/bar/app/navbar/ModeToggle";
import { LanguageSwitcher } from "@/components/bar/app/navbar/LanguageSwitcher";
import { Link } from "@tanstack/react-router";
import type { Project } from "@/types/project";

interface ProjectNavbarProps {
  project: Project | null;
}

export function ProjectNavbar({ project }: ProjectNavbarProps) {
  return (
    <header className="flex h-[65px] shrink-0 items-center gap-2 border-b bg-background sticky top-0 z-40 w-full max-w-full px-2">
      <div className="flex items-center justify-between w-full h-12">
        {/* Left side - Back button and breadcrumb */}
        <div className="flex items-center gap-2">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/projects" className="text-lg font-semibold">
                    Projects
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-lg font-semibold text-primary">
                  {project?.name || "EMS"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right side - Theme and Language controls */}
        <div className="flex items-center gap-2 mx-6">
          <ModeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
