import { HRLayout } from "@/components/HRLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Plus, Headphones, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";

type TicketStatus = "Open" | "In Progress" | "Resolved";
type TicketPriority = "Low" | "Medium" | "High";
type TicketCategory = "IT" | "HR" | "Facilities" | "Other";

interface Ticket {
  id: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  submittedBy: string;
  date: string;
  description: string;
}

const allTickets: Ticket[] = [
  { id: "TKT-001", subject: "Laptop not booting", category: "IT", priority: "High", status: "In Progress", submittedBy: "John Doe", date: "Mar 1, 2026", description: "MacBook Pro won't start after latest update." },
  { id: "TKT-002", subject: "Payslip not received", category: "HR", priority: "Medium", status: "Open", submittedBy: "Sarah Miller", date: "Feb 28, 2026", description: "February payslip missing from portal." },
  { id: "TKT-003", subject: "Air conditioning broken", category: "Facilities", priority: "Low", status: "Open", submittedBy: "Michael Chen", date: "Feb 27, 2026", description: "AC unit on floor 3 not working." },
  { id: "TKT-004", subject: "VPN access request", category: "IT", priority: "Medium", status: "Resolved", submittedBy: "John Doe", date: "Feb 20, 2026", description: "Need VPN access for remote work." },
  { id: "TKT-005", subject: "Leave balance incorrect", category: "HR", priority: "High", status: "Resolved", submittedBy: "Emily Davis", date: "Feb 18, 2026", description: "Leave days not matching HR records." },
];

const statusVariant: Record<TicketStatus, "info" | "warning" | "success"> = {
  "Open": "info",
  "In Progress": "warning",
  "Resolved": "success",
};

const priorityVariant: Record<TicketPriority, "destructive" | "warning" | "default"> = {
  "High": "destructive",
  "Medium": "warning",
  "Low": "default",
};

export default function HelpDesk() {
  const { currentUser, isHRAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("IT");
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState(allTickets);

  const myTickets = isHRAdmin ? tickets : tickets.filter((t) => t.submittedBy === currentUser?.name);
  const openCount = myTickets.filter((t) => t.status === "Open").length;
  const inProgressCount = myTickets.filter((t) => t.status === "In Progress").length;
  const resolvedCount = myTickets.filter((t) => t.status === "Resolved").length;

  const handleSubmit = () => {
    if (!subject.trim() || !currentUser) return;
    const newTicket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      subject,
      category,
      priority,
      status: "Open",
      submittedBy: currentUser.name,
      date: "Mar 2, 2026",
      description,
    };
    setTickets((prev) => [newTicket, ...prev]);
    setSubject(""); setCategory("IT"); setPriority("Medium"); setDescription("");
    setOpen(false);
  };

  return (
    <HRLayout
      title="Help Desk"
      subtitle={isHRAdmin ? "Manage all support tickets" : "Submit and track your support requests"}
      actions={
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Ticket
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Open" value={openCount} icon={AlertCircle} variant="info" />
        <StatsCard title="In Progress" value={inProgressCount} icon={Clock} variant="warning" />
        <StatsCard title="Resolved" value={resolvedCount} icon={CheckCircle2} variant="success" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{isHRAdmin ? "All Tickets" : "My Tickets"}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Ticket</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                {isHRAdmin && <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Submitted By</th>}
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{ticket.id}</td>
                  <td className="px-4 py-3.5 font-medium text-foreground max-w-xs truncate">{ticket.subject}</td>
                  <td className="px-4 py-3.5"><StatusBadge label={ticket.category} variant="default" /></td>
                  <td className="px-4 py-3.5"><StatusBadge label={ticket.priority} variant={priorityVariant[ticket.priority]} /></td>
                  <td className="px-4 py-3.5"><StatusBadge label={ticket.status} variant={statusVariant[ticket.status]} /></td>
                  {isHRAdmin && <td className="px-4 py-3.5 text-foreground">{ticket.submittedBy}</td>}
                  <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">{ticket.date}</td>
                </tr>
              ))}
              {myTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Support Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Subject</Label>
              <Input className="mt-1" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief description of your issue" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as TicketCategory)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["IT", "HR", "Facilities", "Other"] as TicketCategory[]).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["Low", "Medium", "High"] as TicketPriority[]).map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea className="mt-1 resize-none" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your issue in detail..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!subject.trim()}>Submit Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HRLayout>
  );
}
