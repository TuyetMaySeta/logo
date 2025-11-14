import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/bar/app/navbar/ModeToggle";
import { LanguageSwitcher } from "@/components/bar/app/navbar/LanguageSwitcher";
import { Link } from "@tanstack/react-router";

export function AppNavbar() {
  return (
    <header className="flex h-[65px] shrink-0 items-center gap-2 border-b bg-background sticky top-0 z-40 w-full max-w-full px-4">
      <div className="flex items-center justify-between w-full h-12">
        {/* Left side - Sidebar toggle and title */}
        <div className="flex items-center gap-2">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Link
            to="/"
            className="flex items-center gap-3 text-3xl font-bold text-primary"
          >
            <span className="sm:inline">EMS</span>
          </Link>
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
