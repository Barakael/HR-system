import { HRLayout } from "@/components/HRLayout";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  UserPlus,
  CalendarDays,
  TrendingUp,
  Clock,
  FileText,
  CheckSquare,
  BookOpen,
  Star,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const recentActivities = [
  { action: "Leave request approved", person: "Sarah Miller", time: "2 hours ago", type: "leave" as const },
  { action: "New employee onboarded", person: "Michael Chen", time: "5 hours ago", type: "hire" as const },
  { action: "Performance review submitted", person: "Emily Davis", time: "1 day ago", type: "review" as const },
  { action: "Exit clearance completed", person: "Robert Wilson", time: "1 day ago", type: "exit" as const },
  { action: "Training course completed", person: "Jessica Lee", time: "2 days ago", type: "training" as const },
];

const activityIcons = {
  leave: CalendarDays,
  hire: UserPlus,
  review: TrendingUp,
  exit: FileText,
  training: CheckSquare,
};

const upcomingEvents = [
  { title: "Q1 Performance Reviews", date: "Mar 1-15", status: "Upcoming" },
  { title: "New Hire Orientation", date: "Mar 3", status: "Scheduled" },
  { title: "Benefits Enrollment", date: "Mar 10", status: "Upcoming" },
  { title: "Team Building Event", date: "Mar 18", status: "Planning" },
];

const employeeActivities = [
  { action: "Leave request submitted", time: "Today, 9:00 AM", type: "leave" as const },
  { action: "Training course completed", time: "Yesterday", type: "training" as const },
  { action: "Performance review scheduled", time: "Feb 28", type: "review" as const },
];

const myUpcomingEvents = [
  { title: "Q1 Performance Review", date: "Mar 15", status: "Upcoming" },
  { title: "Team Building Event", date: "Mar 18", status: "Planning" },
  { title: "Benefits Enrollment Deadline", date: "Mar 10", status: "Urgent" },
];

const Dashboard = () => {
  const { currentUser, isHRAdmin } = useAuth();

  if (!isHRAdmin) {
    return (
      <HRLayout title="Dashboard" subtitle={`Welcome back, ${currentUser?.name?.split(" ")[0]}. Here's your overview.`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Leave Days Left" value={14} icon={CalendarDays} trend="Annual balance" variant="info" />
          <StatsCard title="Trainings Done" value={3} icon={BookOpen} trend="2 in progress" trendUp variant="accent" />
          <StatsCard title="Pending Tasks" value={2} icon={CheckSquare} variant="warning" />
          <StatsCard title="Performance Score" value="8.4" icon={Star} trend="Last review" trendUp variant="success" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-lg border border-border shadow-sm">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-card-foreground">My Recent Activity</h2>
            </div>
            <div className="divide-y divide-border">
              {employeeActivities.map((activity, i) => {
                const Icon = activityIcons[activity.type];
                return (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/50 transition-colors">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">{activity.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border shadow-sm">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-card-foreground">My Upcoming Events</h2>
            </div>
            <div className="divide-y divide-border">
              {myUpcomingEvents.map((event, i) => (
                <div key={i} className="px-5 py-3.5">
                  <p className="text-sm font-medium text-card-foreground">{event.title}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-muted-foreground">{event.date}</span>
                    <StatusBadge
                      label={event.status}
                      variant={event.status === "Urgent" ? "destructive" : event.status === "Upcoming" ? "info" : "warning"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Onboarding progress for employee */}
        <div className="mt-6 bg-card rounded-lg border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-card-foreground">Onboarding Checklist</h2>
            <span className="text-sm font-medium text-foreground">37%</span>
          </div>
          <Progress value={37} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">3 of 8 tasks completed. <a href="/onboarding" className="text-blue-500 hover:underline">View checklist →</a></p>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout title="Dashboard" subtitle="Welcome back, Jane. Here's your HR overview.">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Employees"
          value={248}
          icon={Users}
          trend="+12 this month"
          trendUp
          variant="accent"
        />
        <StatsCard
          title="Open Positions"
          value={14}
          icon={UserPlus}
          trend="3 new this week"
          trendUp
          variant="info"
        />
        <StatsCard
          title="On Leave Today"
          value={8}
          icon={CalendarDays}
          variant="warning"
        />
        <StatsCard
          title="Pending Approvals"
          value={23}
          icon={Clock}
          trend="5 urgent"
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border shadow-sm">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-card-foreground">Recent Activity</h2>
          </div>
          <div className="divide-y divide-border">
            {recentActivities.map((activity, i) => {
              const Icon = activityIcons[activity.type];
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/50 transition-colors">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.person}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-card rounded-lg border border-border shadow-sm">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-card-foreground">Upcoming Events</h2>
          </div>
          <div className="divide-y divide-border">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="px-5 py-3.5">
                <p className="text-sm font-medium text-card-foreground">{event.title}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-muted-foreground">{event.date}</span>
                  <StatusBadge
                    label={event.status}
                    variant={event.status === "Upcoming" ? "info" : event.status === "Scheduled" ? "success" : "warning"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HRLayout>
  );
};

export default Dashboard;
