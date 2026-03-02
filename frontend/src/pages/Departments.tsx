import { useState } from "react";
import { HRLayout } from "@/components/HRLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Users, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
  head: string;
  employees: number;
  description: string;
}

const initialDepts: Department[] = [
  { id: "1", name: "Engineering", head: "Sarah Miller", employees: 42, description: "Software development and infrastructure" },
  { id: "2", name: "Marketing", head: "James Brown", employees: 18, description: "Brand, content, and growth marketing" },
  { id: "3", name: "Product", head: "Emily Davis", employees: 12, description: "Product strategy and management" },
  { id: "4", name: "Human Resources", head: "Jessica Lee", employees: 8, description: "People operations and talent" },
  { id: "5", name: "Finance", head: "Kevin Park", employees: 15, description: "Accounting, budgeting, and financial planning" },
  { id: "6", name: "Operations", head: "Lisa Nguyen", employees: 22, description: "Business operations and logistics" },
];

const emptyDept = { id: "", name: "", head: "", employees: 0, description: "" };

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>(initialDepts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState(emptyDept);
  const { toast } = useToast();

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyDept, id: crypto.randomUUID() });
    setDialogOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditing(dept);
    setForm({ ...dept });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.head) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    if (editing) {
      setDepartments((prev) => prev.map((d) => (d.id === form.id ? form : d)));
      toast({ title: "Department updated" });
    } else {
      setDepartments((prev) => [...prev, form]);
      toast({ title: "Department added" });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    toast({ title: "Department removed" });
  };

  return (
    <HRLayout
      title="Departments"
      subtitle="Manage organizational structure"
      actions={
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Department
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-card rounded-lg border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-secondary">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">{dept.name}</p>
                  <p className="text-xs text-muted-foreground">Head: {dept.head}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(dept)}>
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(dept.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{dept.description}</p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> {dept.employees} employees
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Department" : "Add Department"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Department Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Department Head *</Label>
              <Input value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Number of Employees</Label>
              <Input type="number" value={form.employees} onChange={(e) => setForm({ ...form, employees: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Add Department"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HRLayout>
  );
};

export default Departments;
