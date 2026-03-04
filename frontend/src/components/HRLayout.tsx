import { useState } from "react";
import { HRSidebar } from "@/components/HRSidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotificationCount, useUnreadNotifications } from "@/hooks/api/useNotifications";
import { useMarkPolicyRead } from "@/hooks/api/usePolicies";
import { useNavigate } from "react-router-dom";
import { AiChatWidget } from "@/components/AiChatWidget";

interface HRLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function HRLayout({ children, title, subtitle, actions }: HRLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const { isHRAdmin } = useAuth();
  const navigate = useNavigate();
  const { data: notifCount = 0 } = useNotificationCount();
  const { data: notifications = [] } = useUnreadNotifications();
  const markRead = useMarkPolicyRead();
  const [notifOpen, setNotifOpen] = useState(false);

  const handleNotifClick = (id: number) => {
    markRead.mutate(id);
    setNotifOpen(false);
    navigate("/policies");
  };

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

              {/* Notification Bell */}
              <Popover open={notifOpen} onOpenChange={setNotifOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notifications"
                    className="h-9 w-9 text-foreground hover:bg-muted relative"
                  >
                    <Bell className="h-5 w-5" />
                    {notifCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                        {notifCount > 99 ? "99+" : notifCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="font-medium text-sm">Notifications</p>
                    <p className="text-xs text-muted-foreground">{notifCount} unread</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">All caught up!</div>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          className="w-full text-left px-4 py-3 hover:bg-muted/50 border-b border-border last:border-0 transition-colors"
                          onClick={() => handleNotifClick(n.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                            <p className="text-sm font-medium text-card-foreground truncate">{n.title}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1 ml-4">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">{n.type}</span>
                            <span className="text-[10px] text-muted-foreground">{n.time_ago}</span>
                          </div>
                          {n.excerpt && <p className="text-xs text-muted-foreground mt-1 ml-4 line-clamp-1">{n.excerpt}</p>}
                        </button>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-border">
                      <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => { setNotifOpen(false); navigate("/policies"); }}>
                        View all policies
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

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
      {isHRAdmin && <AiChatWidget />}
    </div>
  );
}
