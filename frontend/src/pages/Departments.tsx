import { useState } from "react";
import { HRLayout } from "@/components/HRLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Users, Building2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from "@/hooks/api/useDepartments";
import type { Department } from "@/hooks/api/useDepartments";

const emptyForm = { name: "", description: "" };

const Departments = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const { data: departments = [], isLoading } = useDepartments();
  const createDept = useCreateDepartment();
  const updateDept = useUpdateDepartment();
  const deleteDept = useDeleteDepartment();

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (dept: Department) => {
    setEditing(dept);
    setForm({ name: dept.name, description: dept.description ?? "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast({ title: "Please fill required fields", variant: "destructive" }); return; }
    try {
      if (editing) {
        await updateDept.mutateAsync({ id: editing.id, name: form.name, description: form.description });
        toast({ title: "Department updated" });
      } else {
        await createDept.mutateAsync({ name: form.name, description: form.description });
        toast({ title: "Department added" });
      }
      setDialogOpen(false);
    } catch { toast({ title: "Operation failed", variant: "destructive" }); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteDept.mutateAsync(id); toast({ title: "Department removed" }); }
    catch { toast({ title: "Failed to delete", variant: "destructive" }); }
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
      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
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
                  {dept.head && <p className="text-xs text-muted-foreground">Head: {dept.head.name}</p>}
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
              <Users className="h-3.5 w-3.5" /> {dept.profiles_count ?? 0} employees
            </div>
          </div>
        ))}
      </div>
      )}

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
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createDept.isPending || updateDept.isPending}>
              {(createDept.isPending || updateDept.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? "Save Changes" : "Add Department"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HRLayout>
  );
};

export default Departments;
