import { useState } from "react";
import { HRLayout } from "@/components/HRLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, Search, Download, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  title: string;
  employee: string;
  type: string;
  uploadedDate: string;
  size: string;
  status: string;
}

const initialDocs: Document[] = [
  { id: "1", title: "Employment Contract", employee: "Sarah Miller", type: "Contract", uploadedDate: "Jan 15, 2024", size: "245 KB", status: "Active" },
  { id: "2", title: "NDA Agreement", employee: "Sarah Miller", type: "Legal", uploadedDate: "Jan 15, 2024", size: "120 KB", status: "Active" },
  { id: "3", title: "Performance Review Q4", employee: "James Brown", type: "Review", uploadedDate: "Dec 20, 2025", size: "85 KB", status: "Active" },
  { id: "4", title: "Employment Contract", employee: "James Brown", type: "Contract", uploadedDate: "Mar 1, 2023", size: "250 KB", status: "Active" },
  { id: "5", title: "Training Certificate", employee: "Emily Davis", type: "Certificate", uploadedDate: "Nov 5, 2025", size: "180 KB", status: "Active" },
  { id: "6", title: "Employment Contract", employee: "Michael Chen", type: "Contract", uploadedDate: "Feb 1, 2026", size: "248 KB", status: "Pending" },
  { id: "7", title: "Resignation Letter", employee: "Robert Wilson", type: "Legal", uploadedDate: "Feb 15, 2026", size: "45 KB", status: "Active" },
];

const Documents = () => {
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [search, setSearch] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ id: "", title: "", employee: "", type: "Contract", uploadedDate: "", size: "", status: "Active" });
  const { toast } = useToast();

  const employees = [...new Set(docs.map((d) => d.employee))];
  const filtered = docs.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.employee.toLowerCase().includes(search.toLowerCase());
    const matchEmployee = filterEmployee === "all" || d.employee === filterEmployee;
    return matchSearch && matchEmployee;
  });

  const grouped = filtered.reduce<Record<string, Document[]>>((acc, doc) => {
    if (!acc[doc.employee]) acc[doc.employee] = [];
    acc[doc.employee].push(doc);
    return acc;
  }, {});

  const openAdd = () => {
    setForm({ id: crypto.randomUUID(), title: "", employee: "", type: "Contract", uploadedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), size: "0 KB", status: "Active" });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.employee) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setDocs((prev) => [...prev, form]);
    toast({ title: "Document added" });
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    toast({ title: "Document removed" });
  };

  return (
    <HRLayout
      title="Documents"
      subtitle="Employee documents and records"
      actions={
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" /> Upload Document
        </Button>
      }
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterEmployee} onValueChange={setFilterEmployee}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Employees" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {employees.map((emp) => (
              <SelectItem key={emp} value={emp}>{emp}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([employee, employeeDocs]) => (
          <div key={employee} className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-secondary/30">
              <h2 className="font-semibold text-card-foreground">{employee}</h2>
              <p className="text-xs text-muted-foreground">{employeeDocs.length} document{employeeDocs.length > 1 ? "s" : ""}</p>
            </div>
            <div className="divide-y divide-border">
              {employeeDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary"><FileText className="h-4 w-4 text-muted-foreground" /></div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.type} · {doc.uploadedDate} · {doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge label={doc.status} variant={doc.status === "Active" ? "success" : "warning"} />
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(doc.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Document Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Employee *</Label>
              <Input value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HRLayout>
  );
};

export default Documents;
