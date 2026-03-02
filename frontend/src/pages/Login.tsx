import { useNavigate } from "react-router-dom";
import { useAuth, MOCK_USERS, AuthUser } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Briefcase, Moon, Sun, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

const roleConfig: Record<string, { icon: React.ElementType; color: string; badge: string }> = {
  hr_admin: {
    icon: ShieldCheck,
    color: "text-blue-600 dark:text-blue-400",
    badge: "HR Admin",
  },
  employee: {
    icon: User,
    color: "text-emerald-600 dark:text-emerald-400",
    badge: "Employee",
  },
};

export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = (user: AuthUser) => {
    login(user.id);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 h-16 border-b border-border">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-base text-foreground tracking-tight">HR Portal</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-muted transition-colors text-foreground"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 mb-4">
            <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to HR Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Select an account to continue</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
          {MOCK_USERS.map((user) => {
            const cfg = roleConfig[user.role];
            const RoleIcon = cfg.icon;
            return (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                className={cn(
                  "group relative flex flex-col items-start gap-4 p-6 rounded-xl border-2 border-border bg-card",
                  "hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-150 text-left"
                )}
              >
                {/* Avatar */}
                <div className="flex items-center gap-3 w-full">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-300">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <p className="text-xs text-muted-foreground">{user.title}</p>
                  <p className="text-xs text-muted-foreground">{user.department}</p>
                </div>

                {/* Role badge */}
                <div className={cn("flex items-center gap-1.5 text-xs font-medium", cfg.color)}>
                  <RoleIcon className="h-3.5 w-3.5" />
                  {cfg.badge}
                </div>

                <span className="absolute bottom-4 right-4 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  Sign in →
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-muted-foreground text-center max-w-sm">
          This is a development environment with mock accounts.
          No password required.
        </p>
      </main>
    </div>
  );
}
