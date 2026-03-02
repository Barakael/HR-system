import { HRLayout } from "@/components/HRLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { CheckCircle2, Circle, Clock, UserPlus, ChevronRight, Plus, Pencil, Trash2, X } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { StatsCard } from "@/components/StatsCard";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  done: boolean;
}

interface NewHire {
  id: string;
  name: string;
  role: string;
  dept: string;
  startDate: string;
  progress: number;
  buddy: string;
  email: string;
}

const employeeChecklist: ChecklistItem[] = [
  { id: "1", task: "Sign employment contract", category: "Legal", done: true },
  { id: "2", task: "Complete tax forms", category: "Payroll", done: true },
  { id: "3", task: "Collect ID badge", category: "Security", done: true },
  { id: "4", task: "IT equipment setup & login", category: "IT", done: false },
  { id: "5", task: "Complete induction training", category: "Training", done: false },
  { id: "6", task: "Meet your assigned buddy", category: "Culture", done: false },
  { id: "7", task: "Review employee handbook", category: "Policy", done: false },
  { id: "8", task: "Set up payroll bank details", category: "Payroll", done: false },
];

const initialHires: NewHire[] = [
  { id: "1", name: "Michael Chen", role: "Product Designer", dept: "Design", startDate: "Mar 3, 2026", progress: 75, buddy: "Alice Turner", email: "m.chen@hrportal.com" },
  { id: "2", name: "Priya Sharma", role: "Data Analyst", dept: "Analytics", startDate: "Mar 5, 2026", progress: 40, buddy: "Bob Harris", email: "p.sharma@hrportal.com" },
  { id: "3", name: "James O'Brien", role: "DevOps Engineer", dept: "Engineering", startDate: "Mar 10, 2026", progress: 10, buddy: "Carol White", email: "j.obrien@hrportal.com" },
];

const emptyForm = (): Omit<NewHire, "id" | "progress"> => ({
  name: "", role: "", dept: "", startDate: "", buddy: "", email: "",
});

export default function Onboarding() {
  const { isHRAdmin } = useAuth();
  const { toast } = useToast();
  const [checklist, setChecklist] = useState(employeeChecklist);
  const [hires, setHires] = useState<NewHire[]>(initialHires);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<NewHire | null>(null);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const doneCount = checklist.filter((i) => i.done).length;
  const progressPct = Math.round((doneCount / checklist.length) * 100);

  // Open dialog for Add
  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  // Open dialog for Edit
  const openEdit = (hire: NewHire) => {
    setEditingId(hire.id);
    setForm({ name: hire.name, role: hire.role, dept: hire.dept, startDate: hire.startDate, buddy: hire.buddy, email: hire.email });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.role.trim() || !form.dept.trim() || !form.startDate.trim()) return;
    if (editingId) {
      setHires((prev) =>
        prev.map((h) => h.id === editingId ? { ...h, ...form } : h)
      );
      toast({ title: "New hire updated", description: `${form.name}'s details have been saved.` });
    } else {
      const newHire: NewHire = {
        id: Date.now().toString(),
        ...form,
        progress: 0,
      };
      setHires((prev) => [newHire, ...prev]);
      toast({ title: "New hire added", description: `${form.name} has been added to the onboarding tracker.` });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setHires((prev) => prev.filter((h) => h.id !== deleteTarget.id));
    toast({ title: "Hire removed", description: `${deleteTarget.name} has been removed from onboarding.`, variant: "destructive" });
    setDeleteTarget(null);
  };

  const fullyOnboarded = hires.filter((h) => h.progress === 100).length;

  if (isHRAdmin) {
    return (
      <HRLayout
        title="Onboarding"
        subtitle="Track and manage new hire onboarding progress"
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-1" /> Add New Hire
          </Button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatsCard title="New Hires This Month" value={hires.length} icon={UserPlus} variant="accent" />
          <StatsCard title="Fully Onboarded" value={fullyOnboarded} icon={CheckCircle2} variant="success" />
          <StatsCard title="In Progress" value={hires.length - fullyOnboarded} icon={Clock} variant="warning" />
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">New Hire Tracker</h2>
            <span className="text-xs text-muted-foreground">{hires.length} hire{hires.length !== 1 ? "s" : ""}</span>
          </div>
          {hires.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <UserPlus className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No new hires yet</p>
              <p className="text-xs text-muted-foreground">Click "Add New Hire" to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {hires.map((hire) => (
                <div key={hire.id} className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/40 transition-colors group">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300 shrink-0">
                    {hire.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{hire.name}</p>
                    <p className="text-xs text-muted-foreground">{hire.role} · {hire.dept}</p>
                    <p className="text-xs text-muted-foreground">{hire.email}</p>
                  </div>
                  <div className="hidden sm:block text-xs text-muted-foreground w-28 shrink-0">
                    Starts {hire.startDate}
                  </div>
                  <div className="w-36 hidden md:block shrink-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium text-foreground">{hire.progress}%</span>
                    </div>
                    <Progress value={hire.progress} className="h-1.5" />
                  </div>
                  <div className="hidden lg:block text-xs text-muted-foreground w-28 shrink-0">
                    Buddy: {hire.buddy}
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => openEdit(hire)}
                      className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(hire)}
                      className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add / Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit New Hire" : "Add New Hire"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
              <div className="sm:col-span-2">
                <Label>Full Name <span className="text-destructive">*</span></Label>
                <Input className="mt-1" placeholder="e.g. Alex Johnson" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <Label>Job Title <span className="text-destructive">*</span></Label>
                <Input className="mt-1" placeholder="e.g. UX Designer" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
              </div>
              <div>
                <Label>Department <span className="text-destructive">*</span></Label>
                <Input className="mt-1" placeholder="e.g. Engineering" value={form.dept} onChange={(e) => setForm((f) => ({ ...f, dept: e.target.value }))} />
              </div>
              <div>
                <Label>Start Date <span className="text-destructive">*</span></Label>
                <Input className="mt-1" placeholder="e.g. Mar 15, 2026" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div>
                <Label>Buddy / Mentor</Label>
                <Input className="mt-1" placeholder="e.g. Sarah Miller" value={form.buddy} onChange={(e) => setForm((f) => ({ ...f, buddy: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <Label>Work Email</Label>
                <Input className="mt-1" type="email" placeholder="e.g. alex.j@hrportal.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.role.trim() || !form.dept.trim() || !form.startDate.trim()}
              >
                {editingId ? "Save Changes" : "Add Hire"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Remove New Hire</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground py-2">
              Are you sure you want to remove <span className="font-semibold text-foreground">{deleteTarget?.name}</span> from the onboarding tracker? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Remove</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </HRLayout>
    );
  }

  return (
    <HRLayout title="My Onboarding" subtitle="Complete your onboarding tasks to get started">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress summary */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-foreground">Onboarding Progress</h2>
              <p className="text-sm text-muted-foreground">{doneCount} of {checklist.length} tasks completed</p>
            </div>
            <span className="text-2xl font-bold text-foreground">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>

        {/* Checklist */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Checklist</h2>
          </div>
          <div className="divide-y divide-border">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="flex items-center gap-4 px-5 py-3.5 w-full text-left hover:bg-secondary/40 transition-colors"
              >
                {item.done ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <span className={cn("flex-1 text-sm font-medium text-foreground", item.done && "line-through text-muted-foreground")}>
                  {item.task}
                </span>
                <StatusBadge
                  label={item.category}
                  variant={item.done ? "success" : "default"}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
