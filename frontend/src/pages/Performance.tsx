import { useState } from "react";
import { HRLayout } from "@/components/HRLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Plus, Star, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  employee: string;
  department: string;
  reviewer: string;
  rating: number;
  period: string;
  feedback: string;
  status: string;
}

const initialReviews: Review[] = [
  { id: "1", employee: "Sarah Miller", department: "Engineering", reviewer: "John Doe", rating: 9, period: "Q4 2025", feedback: "Exceptional contributor, leads by example.", status: "Completed" },
  { id: "2", employee: "James Brown", department: "Marketing", reviewer: "John Doe", rating: 7, period: "Q4 2025", feedback: "Strong campaign results, needs to improve reporting.", status: "Completed" },
  { id: "3", employee: "Emily Davis", department: "Product", reviewer: "John Doe", rating: 8, period: "Q4 2025", feedback: "Great product vision and stakeholder management.", status: "Completed" },
  { id: "4", employee: "Michael Chen", department: "Engineering", reviewer: "Sarah Miller", rating: 6, period: "Q4 2025", feedback: "Good progress for a junior, needs mentoring.", status: "Pending" },
];

const ratingColor = (r: number) => {
  if (r >= 8) return "text-success";
  if (r >= 5) return "text-warning";
  return "text-destructive";
};

const Performance = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ id: "", employee: "", department: "", reviewer: "", rating: 5, period: "Q1 2026", feedback: "", status: "Pending" });
  const { toast } = useToast();

  const openAdd = () => {
    setForm({ id: crypto.randomUUID(), employee: "", department: "", reviewer: "", rating: 5, period: "Q1 2026", feedback: "", status: "Pending" });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.employee || !form.reviewer) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setReviews((prev) => [...prev, form]);
    toast({ title: "Performance review added" });
    setDialogOpen(false);
  };

  return (
    <HRLayout
      title="Performance"
      subtitle="Rate and review employee performance (1-10 scale)"
      actions={
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Review
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-success/10"><Star className="h-5 w-5 text-success" /></div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-info/10"><TrendingUp className="h-5 w-5 text-info" /></div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{reviews.filter((r) => r.status === "Completed").length}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-warning/10"><Star className="h-5 w-5 text-warning" /></div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{reviews.filter((r) => r.status === "Pending").length}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-card-foreground">Performance Reviews</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Employee</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Department</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Reviewer</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Rating</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Period</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{r.employee}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.department}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.reviewer}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-bold text-lg ${ratingColor(r.rating)}`}>{r.rating}</span>
                    <span className="text-muted-foreground text-xs">/10</span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.period}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge label={r.status} variant={r.status === "Completed" ? "success" : "warning"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Performance Review</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employee *</Label>
                <Input value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reviewer *</Label>
                <Input value={form.reviewer} onChange={(e) => setForm({ ...form, reviewer: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Period</Label>
                <Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Rating: {form.rating}/10</Label>
              <Slider min={1} max={10} step={1} value={[form.rating]} onValueChange={(v) => setForm({ ...form, rating: v[0] })} className="py-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 - Poor</span><span>5 - Average</span><span>10 - Exceptional</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Feedback</Label>
              <Textarea value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HRLayout>
  );
};

export default Performance;
