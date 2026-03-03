import { useState } from "react";
import { HRLayout } from "@/components/HRLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, UserPlus, Users, Briefcase, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useJobs, useCreateJob } from "@/hooks/api/useJobs";

const Recruitment = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", department: "", location: "", type: "Full-time", description: "" });
  const { toast } = useToast();

  const { data: jobs = [], isLoading } = useJobs();
  const createJob = useCreateJob();

  const openAdd = () => {
    setForm({ title: "", department: "", location: "", type: "Full-time", description: "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.department) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    try {
      await createJob.mutateAsync(form);
      toast({ title: "Job posting created" });
      setDialogOpen(false);
    } catch { toast({ title: "Failed to create job posting", variant: "destructive" }); }
  };

  const openCount       = jobs.filter((j) => j.status === "Open").length;
  const totalApplicants = jobs.reduce((s, j) => s + (j.applicants ?? 0), 0);
  const closedCount     = jobs.filter((j) => j.status === "Closed").length;

  return (
    <HRLayout
      title="Recruitment"
      subtitle="Job postings and applicant tracking"
      actions={<Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" /> Post Job</Button>}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-success/10"><Briefcase className="h-5 w-5 text-success" /></div>
          <div><p className="text-2xl font-bold text-card-foreground">{openCount}</p><p className="text-sm text-muted-foreground">Open Positions</p></div>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-info/10"><Users className="h-5 w-5 text-info" /></div>
          <div><p className="text-2xl font-bold text-card-foreground">{totalApplicants}</p><p className="text-sm text-muted-foreground">Total Applicants</p></div>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-secondary"><UserPlus className="h-5 w-5 text-muted-foreground" /></div>
          <div><p className="text-2xl font-bold text-card-foreground">{closedCount}</p><p className="text-sm text-muted-foreground">Filled Positions</p></div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border"><h2 className="font-semibold text-card-foreground">Job Postings</h2></div>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="divide-y divide-border">
            {jobs.map((job) => (
              <div key={job.id} className="px-5 py-4 hover:bg-secondary/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">{job.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                      <span>{job.type}</span>
                      {job.posted_at && <span>Posted {new Date(job.posted_at).toLocaleDateString()}</span>}
                    </div>
                    {job.description && <p className="text-sm text-muted-foreground mt-2">{job.description}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-card-foreground">{job.applicants ?? 0}</p>
                      <p className="text-xs text-muted-foreground">applicants</p>
                    </div>
                    <StatusBadge label={job.status} variant={job.status === "Open" ? "success" : "default"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Post New Job</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Job Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Department *</Label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
              <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            </div>
            <div className="space-y-2">
              <Label>Employment Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createJob.isPending}>
              {createJob.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Post Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HRLayout>
  );
};

export default Recruitment;
