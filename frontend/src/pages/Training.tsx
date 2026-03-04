import { useState } from "react";
import { HRLayout } from "@/components/HRLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, GraduationCap, Users, Clock, Loader2, MapPin, CalendarDays, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTrainingPrograms, useCreateTraining, useAssignTrainees } from "@/hooks/api/useTraining";
import { useEmployees } from "@/hooks/api/useEmployees";
import { Checkbox } from "@/components/ui/checkbox";

const Training = () => {
  const { data: programs = [], isLoading } = useTrainingPrograms();
  const { data: employees = [] } = useEmployees();
  const createTraining = useCreateTraining();
  const assignTrainees = useAssignTrainees();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [selectedTrainees, setSelectedTrainees] = useState<number[]>([]);
  const [form, setForm] = useState({
    title: "", category: "Compliance", instructor: "", duration: "", description: "",
    venue: "", start_date: "", end_date: "", start_time: "", end_time: "", mode: "Offline", max_capacity: "",
  });
  const { toast } = useToast();

  const openAdd = () => {
    setForm({
      title: "", category: "Compliance", instructor: "", duration: "", description: "",
      venue: "", start_date: "", end_date: "", start_time: "", end_time: "", mode: "Offline", max_capacity: "",
    });
    setDialogOpen(true);
  };

  const openAssign = (programId: number) => {
    setSelectedProgramId(programId);
    setSelectedTrainees([]);
    setAssignDialogOpen(true);
  };

  const toggleTrainee = (id: number) => {
    setSelectedTrainees((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!form.title || !form.instructor) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    const payload: Record<string, unknown> = { ...form };
    if (form.max_capacity) payload.max_capacity = Number(form.max_capacity);
    else delete payload.max_capacity;

    createTraining.mutate(payload, {
      onSuccess: () => {
        toast({ title: "Training program added" });
        setDialogOpen(false);
      },
      onError: () => toast({ title: "Failed to add training program", variant: "destructive" }),
    });
  };

  const handleAssign = () => {
    if (!selectedProgramId || selectedTrainees.length === 0) {
      toast({ title: "Please select at least one trainee", variant: "destructive" });
      return;
    }
    assignTrainees.mutate(
      { trainingId: selectedProgramId, user_ids: selectedTrainees },
      {
        onSuccess: (data) => {
          toast({ title: `${data.assigned_count ?? selectedTrainees.length} trainee(s) assigned` });
          setAssignDialogOpen(false);
        },
        onError: () => toast({ title: "Failed to assign trainees", variant: "destructive" }),
      }
    );
  };

  return (
    <HRLayout
      title="Training"
      subtitle="Company-wide learning management"
      actions={
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Training
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-success/10"><GraduationCap className="h-5 w-5 text-success" /></div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{programs.filter((p) => p.status === "Active").length}</p>
            <p className="text-sm text-muted-foreground">Active Programs</p>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-info/10"><Users className="h-5 w-5 text-info" /></div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{programs.reduce((s, p) => s + (p.enrollments_count ?? 0), 0)}</p>
            <p className="text-sm text-muted-foreground">Total Enrollments</p>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-secondary"><Clock className="h-5 w-5 text-muted-foreground" /></div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{programs.filter((p) => p.status === "Draft").length}</p>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
      <div className="space-y-4">
        {programs.map((prog) => (
          <div key={prog.id} className="bg-card rounded-lg border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary"><GraduationCap className="h-4 w-4 text-muted-foreground" /></div>
                <div>
                  <p className="font-medium text-card-foreground">{prog.title}</p>
                  <p className="text-xs text-muted-foreground">{prog.category} · {prog.duration} · Instructor: {prog.instructor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => openAssign(prog.id)}>
                  <UserPlus className="h-3.5 w-3.5 mr-1" /> Assign Trainees
                </Button>
                <StatusBadge label={prog.status} variant={prog.status === "Active" ? "success" : "default"} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{prog.description}</p>
            {/* New scheduling details */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-3">
              {prog.venue && (
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {prog.venue}</span>
              )}
              {prog.start_date && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {prog.start_date}{prog.end_date && prog.end_date !== prog.start_date ? ` — ${prog.end_date}` : ""}
                </span>
              )}
              {prog.start_time && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {prog.start_time}{prog.end_time ? ` – ${prog.end_time}` : ""}
                </span>
              )}
              {prog.mode && (
                <span className="px-2 py-0.5 rounded-full bg-muted text-xs">{prog.mode}</span>
              )}
              {prog.max_capacity && (
                <span>Capacity: {prog.max_capacity}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
              <Users className="h-3.5 w-3.5" /> {prog.enrollments_count ?? 0} enrolled
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add Training Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Training Program</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mode</Label>
                <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Instructor *</Label>
              <Input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Venue</Label>
              <Input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="e.g. Training Hall B, 2nd Floor" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3 hours" />
              </div>
              <div className="space-y-2">
                <Label>Max Capacity</Label>
                <Input type="number" value={form.max_capacity} onChange={(e) => setForm({ ...form, max_capacity: e.target.value })} placeholder="Unlimited" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createTraining.isPending}>
              {createTraining.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Add Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Trainees Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Assign Trainees</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Select employees to enroll in this training program.</p>
          <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-3 mt-2">
            {employees.map((emp) => (
              <label key={emp.id} className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer">
                <Checkbox
                  checked={selectedTrainees.includes(emp.id)}
                  onCheckedChange={() => toggleTrainee(emp.id)}
                />
                <div>
                  <p className="text-sm font-medium">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.dept} · {emp.role}</p>
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{selectedTrainees.length} selected</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign} disabled={assignTrainees.isPending || selectedTrainees.length === 0}>
              {assignTrainees.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Assign ({selectedTrainees.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HRLayout>
  );
};

export default Training;
