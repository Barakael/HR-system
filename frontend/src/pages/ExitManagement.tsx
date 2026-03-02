import { HRLayout } from "@/components/HRLayout";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { LogOut, CheckCircle, Clock, AlertTriangle, Plus } from "lucide-react";

const exitData = [
  {
    name: "Robert Wilson",
    department: "Engineering",
    exitType: "Resignation",
    lastDay: "Mar 15, 2026",
    clearance: "Pending",
    status: "In Progress",
  },
  {
    name: "Amanda Torres",
    department: "Marketing",
    exitType: "Termination",
    lastDay: "Feb 28, 2026",
    clearance: "Completed",
    status: "Completed",
  },
  {
    name: "Kevin Park",
    department: "Finance",
    exitType: "Resignation",
    lastDay: "Mar 20, 2026",
    clearance: "Pending",
    status: "In Progress",
  },
  {
    name: "Lisa Nguyen",
    department: "Operations",
    exitType: "Retirement",
    lastDay: "Apr 1, 2026",
    clearance: "Not Started",
    status: "Initiated",
  },
  {
    name: "David Kim",
    department: "Sales",
    exitType: "Resignation",
    lastDay: "Mar 10, 2026",
    clearance: "In Progress",
    status: "In Progress",
  },
];

const clearanceStatusVariant = (s: string) => {
  if (s === "Completed") return "success" as const;
  if (s === "Pending" || s === "In Progress") return "warning" as const;
  return "default" as const;
};

const processStatusVariant = (s: string) => {
  if (s === "Completed") return "success" as const;
  if (s === "In Progress") return "info" as const;
  return "accent" as const;
};

const ExitManagement = () => {
  return (
    <HRLayout
      title="Exit Management"
      subtitle="Manage employee offboarding and clearance processes"
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Initiate Exit
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="In Progress" value={3} icon={Clock} variant="warning" />
        <StatsCard title="Completed" value={12} icon={CheckCircle} variant="success" />
        <StatsCard title="This Month" value={5} icon={LogOut} variant="info" />
        <StatsCard title="Clearance Pending" value={4} icon={AlertTriangle} variant="accent" />
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-card-foreground">Exit Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Employee</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Department</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Exit Type</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Last Working Day</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Clearance</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {exitData.map((row, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{row.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{row.department}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge
                      label={row.exitType}
                      variant={row.exitType === "Termination" ? "destructive" : row.exitType === "Retirement" ? "info" : "default"}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{row.lastDay}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge label={row.clearance} variant={clearanceStatusVariant(row.clearance)} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge label={row.status} variant={processStatusVariant(row.status)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HRLayout>
  );
};

export default ExitManagement;
