import { useState } from "react";
import { HRLayout } from "@/components/HRLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { CheckSquare, Clock, XCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Approval {
  id: string;
  employee: string;
  type: string;
  description: string;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

const initialApprovals: Approval[] = [
  { id: "1", employee: "Emily Davis", type: "Leave Request", description: "Personal leave — Mar 12", submittedDate: "Feb 28, 2026", status: "Pending" },
  { id: "2", employee: "Michael Chen", type: "Leave Request", description: "Annual leave — Mar 18 to Mar 25 (6 days)", submittedDate: "Feb 25, 2026", status: "Pending" },
  { id: "3", employee: "Jessica Lee", type: "Transfer", description: "HR → Operations department transfer", submittedDate: "Feb 22, 2026", status: "Pending" },
  { id: "4", employee: "Sarah Miller", type: "Leave Request", description: "Annual leave — Mar 5 to Mar 7 (3 days)", submittedDate: "Feb 20, 2026", status: "Approved" },
  { id: "5", employee: "James Brown", type: "Leave Request", description: "Sick leave — Feb 27 to Feb 28", submittedDate: "Feb 26, 2026", status: "Approved" },
  { id: "6", employee: "David Kim", type: "Expense", description: "Client dinner — $245", submittedDate: "Feb 18, 2026", status: "Rejected" },
];

const Approvals = () => {
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);
  const { toast } = useToast();

  const handleAction = (id: string, action: "Approved" | "Rejected") => {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: action } : a)));
    toast({ title: `Request ${action.toLowerCase()}` });
  };

  const pending = approvals.filter((a) => a.status === "Pending");
  const approved = approvals.filter((a) => a.status === "Approved");
  const rejected = approvals.filter((a) => a.status === "Rejected");

  return (
    <HRLayout title="Approvals" subtitle="Manage pending approvals">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard title="Pending" value={pending.length} icon={Clock} variant="warning" />
        <StatsCard title="Approved" value={approved.length} icon={CheckCircle} variant="success" />
        <StatsCard title="Rejected" value={rejected.length} icon={XCircle} variant="default" />
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-card-foreground">All Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Employee</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Description</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Submitted</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-5 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {approvals.map((a) => (
                <tr key={a.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{a.employee}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge label={a.type} variant="info" />
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{a.description}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{a.submittedDate}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge label={a.status} variant={a.status === "Approved" ? "success" : a.status === "Rejected" ? "destructive" : "warning"} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {a.status === "Pending" && (
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" className="text-success border-success/30 hover:bg-success/10" onClick={() => handleAction(a.id, "Approved")}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleAction(a.id, "Rejected")}>
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
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

export default Approvals;
