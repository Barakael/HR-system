import { useState } from "react";
import { HRLayout } from "@/components/HRLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Plus, Umbrella, Thermometer, Baby } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const leaveBalances = [
  { type: "Annual Leave", used: 8, total: 21, icon: Umbrella },
  { type: "Sick Leave", used: 3, total: 10, icon: Thermometer },
  { type: "Personal Leave", used: 1, total: 5, icon: CalendarDays },
  { type: "Parental Leave", used: 0, total: 90, icon: Baby },
];

interface LeaveRequest {
  id: string;
  name: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: string;
}

const initialRequests: LeaveRequest[] = [
  { id: "1", name: "Sarah Miller", type: "Annual", from: "Mar 5", to: "Mar 7", days: 3, reason: "Family vacation", status: "Approved" },
  { id: "2", name: "James Brown", type: "Sick", from: "Feb 27", to: "Feb 28", days: 2, reason: "Not feeling well", status: "Approved" },
  { id: "3", name: "Emily Davis", type: "Personal", from: "Mar 12", to: "Mar 12", days: 1, reason: "Personal errand", status: "Pending" },
  { id: "4", name: "Michael Chen", type: "Annual", from: "Mar 18", to: "Mar 25", days: 6, reason: "Travel", status: "Pending" },
];

const LeaveManagement = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ type: "Annual", from: "", to: "", days: 1, reason: "" });
  const { toast } = useToast();

  const openRequest = () => {
    setForm({ type: "Annual", from: "", to: "", days: 1, reason: "" });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.from || !form.to) {
      toast({ title: "Please select dates", variant: "destructive" });
      return;
    }
    const newRequest: LeaveRequest = {
      id: crypto.randomUUID(),
      name: "John Doe",
      type: form.type,
      from: new Date(form.from).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      to: new Date(form.to).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      days: form.days,
      reason: form.reason,
      status: "Pending",
    };
    setRequests((prev) => [newRequest, ...prev]);
    toast({ title: "Leave request submitted" });
    setDialogOpen(false);
  };

  return (
    <HRLayout
      title="Leave Management"
      subtitle="Track time-off requests and balances"
      actions={
        <Button onClick={openRequest}>
          <Plus className="h-4 w-4 mr-2" /> Request Leave
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {leaveBalances.map((lb) => (
          <div key={lb.type} className="bg-card rounded-lg border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-secondary">
                <lb.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{lb.type}</p>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-card-foreground">{lb.total - lb.used}</p>
              <p className="text-xs text-muted-foreground">{lb.used} / {lb.total} used</p>
            </div>
            <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(lb.used / lb.total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-card-foreground">Leave Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Employee</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">From</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">To</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Days</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Reason</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{r.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.type}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.from}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.to}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.days}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.reason}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge label={r.status} variant={r.status === "Approved" ? "success" : "warning"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Request Leave</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Leave Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual">Annual Leave</SelectItem>
                  <SelectItem value="Sick">Sick Leave</SelectItem>
                  <SelectItem value="Personal">Personal Leave</SelectItem>
                  <SelectItem value="Parental">Parental Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From *</Label>
                <Input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>To *</Label>
                <Input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Number of Days</Label>
              <Input type="number" min={1} value={form.days} onChange={(e) => setForm({ ...form, days: parseInt(e.target.value) || 1 })} />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HRLayout>
  );
};

export default LeaveManagement;
