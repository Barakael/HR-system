import { useState } from "react";
import { HRLayout } from "@/components/HRLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ClipboardList, Trash2, GripVertical, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSurveys, useCreateSurvey, useDeleteSurvey, type Survey, type SurveyQuestion } from "@/hooks/api/useSurveys";

type QuestionDraft = {
  text: string;
  type: SurveyQuestion["type"];
  options?: string;
};

const Surveys = () => {
  const { data: surveys = [], isLoading } = useSurveys();
  const createSurvey = useCreateSurvey();
  const deleteSurvey = useDeleteSurvey();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewSurvey, setViewSurvey] = useState<Survey | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [newQ, setNewQ] = useState<QuestionDraft>({ text: "", type: "text", options: "" });
  const { toast } = useToast();

  const openAdd = () => {
    setForm({ title: "", description: "" });
    setQuestions([]);
    setDialogOpen(true);
  };

  const addQuestion = () => {
    if (!newQ.text) return;
    setQuestions((prev) => [...prev, { ...newQ }]);
    setNewQ({ text: "", type: "text", options: "" });
  };

  const removeQuestion = (i: number) => setQuestions((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    if (!form.title || questions.length === 0) {
      toast({ title: "Add a title and at least one question", variant: "destructive" });
      return;
    }
    createSurvey.mutate({
      title: form.title,
      description: form.description,
      questions: questions.map((q) => ({ text: q.text, type: q.type, options: q.options })),
    }, {
      onSuccess: () => {
        toast({ title: "Survey created" });
        setDialogOpen(false);
      },
      onError: () => toast({ title: "Failed to create survey", variant: "destructive" }),
    });
  };

  const handleDelete = (id: number) => {
    deleteSurvey.mutate(id, {
      onSuccess: () => toast({ title: "Survey deleted" }),
      onError: () => toast({ title: "Failed to delete survey", variant: "destructive" }),
    });
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
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {surveys.map((survey) => (
            <div key={survey.id} className="bg-card rounded-lg border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary"><ClipboardList className="h-4 w-4 text-muted-foreground" /></div>
                  <div>
                    <p className="font-medium text-card-foreground">{survey.title}</p>
                    <p className="text-xs text-muted-foreground">{survey.created_at}</p>
                  </div>
                </div>
                <StatusBadge label={survey.status} variant={survey.status === "Active" ? "success" : survey.status === "Closed" ? "default" : "warning"} />
              </div>
              <p className="text-sm text-muted-foreground mb-3">{survey.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{survey.questions.length} questions · {survey.responses_count} responses</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setViewSurvey(survey)}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(survey.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                  <div key={i} className="flex items-center gap-2 bg-secondary/50 rounded-md px-3 py-2">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-card-foreground">{i + 1}. {q.text}</p>
                      <p className="text-xs text-muted-foreground">{typeLabel(q.type)}{q.options ? ` — ${q.options}` : ""}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeQuestion(i)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-3 p-3 border border-dashed border-border rounded-md space-y-3">
                <Input placeholder="Question text..." value={newQ.text} onChange={(e) => setNewQ({ ...newQ, text: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Select value={newQ.type} onValueChange={(v) => setNewQ({ ...newQ, type: v as SurveyQuestion["type"] })}>
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
                  <Input placeholder="Options (comma-separated)" value={newQ.options ?? ""} onChange={(e) => setNewQ({ ...newQ, options: e.target.value })} />
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createSurvey.isPending}>
              {createSurvey.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Survey
            </Button>
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
                <p className="text-xs text-muted-foreground mt-1">{typeLabel(q.type)}{q.options ? `: ${q.options}` : ""}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </HRLayout>
  );
};

export default Surveys;
