import { HRSidebar } from "@/components/HRSidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HRLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function HRLayout({ children, title, subtitle, actions }: HRLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex min-h-screen w-full bg-background">
      <HRSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-background border-b border-border px-6 h-20">
          <div className="flex items-center justify-between h-full">
            <div>
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="h-9 w-9 text-foreground hover:bg-muted"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
