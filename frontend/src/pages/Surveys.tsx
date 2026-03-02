import { useState } from "react";
import { HRLayout } from "@/components/HRLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ClipboardList, Trash2, GripVertical, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  type: "text" | "rating" | "multiple_choice" | "yes_no";
  options?: string[];
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  responses: number;
  status: string;
  createdDate: string;
}

const initialSurveys: Survey[] = [
  {
    id: "1", title: "Employee Satisfaction Q1 2026", description: "Quarterly engagement survey",
    questions: [
      { id: "q1", text: "How satisfied are you with your work environment?", type: "rating" },
      { id: "q2", text: "Do you feel valued by your manager?", type: "yes_no" },
      { id: "q3", text: "What improvements would you suggest?", type: "text" },
    ],
    responses: 142, status: "Active", createdDate: "Feb 1, 2026",
  },
  {
    id: "2", title: "Remote Work Preferences", description: "Survey on hybrid work policy",
    questions: [
      { id: "q1", text: "How many days would you prefer to work from home?", type: "multiple_choice", options: ["1", "2", "3", "4", "5"] },
      { id: "q2", text: "Rate your home office setup", type: "rating" },
    ],
    responses: 89, status: "Closed", createdDate: "Jan 10, 2026",
  },
  {
    id: "3", title: "Benefits Feedback", description: "Annual benefits satisfaction survey",
    questions: [
      { id: "q1", text: "Rate your health insurance plan", type: "rating" },
      { id: "q2", text: "Would you use a gym membership benefit?", type: "yes_no" },
    ],
    responses: 0, status: "Draft", createdDate: "Feb 25, 2026",
  },
];

const Surveys = () => {
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewSurvey, setViewSurvey] = useState<Survey | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQ, setNewQ] = useState({ text: "", type: "text" as Question["type"], options: "" });
  const { toast } = useToast();

  const openAdd = () => {
    setForm({ title: "", description: "" });
    setQuestions([]);
    setDialogOpen(true);
  };

  const addQuestion = () => {
    if (!newQ.text) return;
    const q: Question = {
      id: crypto.randomUUID(),
      text: newQ.text,
      type: newQ.type,
      ...(newQ.type === "multiple_choice" && newQ.options ? { options: newQ.options.split(",").map((o) => o.trim()) } : {}),
    };
    setQuestions((prev) => [...prev, q]);
    setNewQ({ text: "", type: "text", options: "" });
  };

  const removeQuestion = (id: string) => setQuestions((prev) => prev.filter((q) => q.id !== id));

  const handleSave = () => {
    if (!form.title || questions.length === 0) {
      toast({ title: "Add a title and at least one question", variant: "destructive" });
      return;
    }
    const survey: Survey = {
      id: crypto.randomUUID(),
      title: form.title,
      description: form.description,
      questions,
      responses: 0,
      status: "Draft",
      createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setSurveys((prev) => [...prev, survey]);
    toast({ title: "Survey created" });
    setDialogOpen(false);
  };

  const typeLabel = (t: string) => {
    const map: Record<string, string> = { text: "Free Text", rating: "Rating (1-5)", multiple_choice: "Multiple Choice", yes_no: "Yes / No" };
    return map[t] || t;
  };

  return (
    <HRLayout
      title="Surveys"
      subtitle="Create and manage employee surveys"
      actions={
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" /> Create Survey
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {surveys.map((survey) => (
          <div key={survey.id} className="bg-card rounded-lg border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary"><ClipboardList className="h-4 w-4 text-muted-foreground" /></div>
                <div>
                  <p className="font-medium text-card-foreground">{survey.title}</p>
                  <p className="text-xs text-muted-foreground">{survey.createdDate}</p>
                </div>
              </div>
              <StatusBadge label={survey.status} variant={survey.status === "Active" ? "success" : survey.status === "Closed" ? "default" : "warning"} />
            </div>
            <p className="text-sm text-muted-foreground mb-3">{survey.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{survey.questions.length} questions · {survey.responses} responses</span>
              <Button variant="ghost" size="sm" onClick={() => setViewSurvey(survey)}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Survey Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Survey</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Survey Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>

            <div className="border-t border-border pt-4">
              <Label className="text-base font-semibold">Questions ({questions.length})</Label>
              <div className="space-y-2 mt-2">
                {questions.map((q, i) => (
                  <div key={q.id} className="flex items-center gap-2 bg-secondary/50 rounded-md px-3 py-2">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-card-foreground">{i + 1}. {q.text}</p>
                      <p className="text-xs text-muted-foreground">{typeLabel(q.type)}{q.options ? ` — ${q.options.join(", ")}` : ""}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeQuestion(q.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-3 p-3 border border-dashed border-border rounded-md space-y-3">
                <Input placeholder="Question text..." value={newQ.text} onChange={(e) => setNewQ({ ...newQ, text: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Select value={newQ.type} onValueChange={(v) => setNewQ({ ...newQ, type: v as Question["type"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Free Text</SelectItem>
                      <SelectItem value="rating">Rating (1-5)</SelectItem>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="yes_no">Yes / No</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={addQuestion}>+ Add Question</Button>
                </div>
                {newQ.type === "multiple_choice" && (
                  <Input placeholder="Options (comma-separated)" value={newQ.options} onChange={(e) => setNewQ({ ...newQ, options: e.target.value })} />
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Create Survey</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Survey Dialog */}
      <Dialog open={!!viewSurvey} onOpenChange={() => setViewSurvey(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{viewSurvey?.title}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">{viewSurvey?.description}</p>
          <div className="space-y-3">
            {viewSurvey?.questions.map((q, i) => (
              <div key={q.id} className="bg-secondary/50 rounded-md px-4 py-3">
                <p className="text-sm font-medium text-card-foreground">{i + 1}. {q.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{typeLabel(q.type)}{q.options ? `: ${q.options.join(", ")}` : ""}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </HRLayout>
  );
};

export default Surveys;
