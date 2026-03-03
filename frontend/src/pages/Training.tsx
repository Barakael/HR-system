import { useState } from "react";
import { HRLayout } from "@/components/HRLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, GraduationCap, Users, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTrainingPrograms, useCreateTraining } from "@/hooks/api/useTraining";

const Training = () => {
  const { data: programs = [], isLoading } = useTrainingPrograms();
  const createTraining = useCreateTraining();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Compliance", instructor: "", duration: "", description: "" });
  const { toast } = useToast();

  const openAdd = () => {
    setForm({ title: "", category: "Compliance", instructor: "", duration: "", description: "" });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.instructor) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    createTraining.mutate(form, {
      onSuccess: () => {
        toast({ title: "Training program added" });
        setDialogOpen(false);
      },
      onError: () => toast({ title: "Failed to add training program", variant: "destructive" }),
    });
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
              <StatusBadge label={prog.status} variant={prog.status === "Active" ? "success" : "default"} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{prog.description}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
              <Users className="h-3.5 w-3.5" /> {prog.enrollments_count ?? 0} enrolled
            </div>
          </div>
        ))}
      </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
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
                <Label>Duration</Label>
                <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3 hours" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Instructor *</Label>
              <Input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
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
    </HRLayout>
  );
};

export default Training;
