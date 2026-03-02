import { useState } from "react";
import { HRLayout } from "@/components/HRLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Mail, Phone, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  role: string;
  dept: string;
  status: string;
  email: string;
  phone: string;
  joined: string;
}

const initialEmployees: Employee[] = [
  { id: "1", name: "Sarah Miller", role: "Software Engineer", dept: "Engineering", status: "Active", email: "sarah@company.com", phone: "+1 555-0101", joined: "Jan 2024" },
  { id: "2", name: "James Brown", role: "Marketing Lead", dept: "Marketing", status: "Active", email: "james@company.com", phone: "+1 555-0102", joined: "Mar 2023" },
  { id: "3", name: "Emily Davis", role: "Product Manager", dept: "Product", status: "Active", email: "emily@company.com", phone: "+1 555-0103", joined: "Aug 2022" },
  { id: "4", name: "Michael Chen", role: "Junior Developer", dept: "Engineering", status: "Probation", email: "michael@company.com", phone: "+1 555-0104", joined: "Feb 2026" },
  { id: "5", name: "Jessica Lee", role: "HR Coordinator", dept: "Human Resources", status: "Active", email: "jessica@company.com", phone: "+1 555-0105", joined: "Nov 2023" },
  { id: "6", name: "Robert Wilson", role: "DevOps Engineer", dept: "Engineering", status: "Exiting", email: "robert@company.com", phone: "+1 555-0106", joined: "Jun 2021" },
];

const emptyEmployee = { id: "", name: "", role: "", dept: "", status: "Active", email: "", phone: "", joined: "" };

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState(emptyEmployee);
  const { toast } = useToast();

  const filtered = employees.filter(
    (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingEmployee(null);
    setForm({ ...emptyEmployee, id: crypto.randomUUID(), joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }) });
    setDialogOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setForm({ ...emp });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.role || !form.dept || !form.email) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (editingEmployee) {
      setEmployees((prev) => prev.map((e) => (e.id === form.id ? form : e)));
      toast({ title: "Employee updated successfully" });
    } else {
      setEmployees((prev) => [...prev, form]);
      toast({ title: "Employee added successfully" });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Employee removed" });
  };

  return (
    <HRLayout
      title="Employees"
      subtitle="Manage your workforce directory"
      actions={
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      }
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search employees..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((emp) => (
          <div key={emp.id} className="bg-card rounded-lg border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {emp.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-medium text-card-foreground">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.role}</p>
                </div>
              </div>
              <StatusBadge label={emp.status} variant={emp.status === "Active" ? "success" : emp.status === "Probation" ? "warning" : "destructive"} />
            </div>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p>{emp.dept} · Joined {emp.joined}</p>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-4">
                  <a href={`mailto:${emp.email}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </a>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Call
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(emp)}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(emp.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? "Edit Employee" : "Add Employee"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department *</Label>
                <Input value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Probation">Probation</SelectItem>
                    <SelectItem value="Exiting">Exiting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingEmployee ? "Save Changes" : "Add Employee"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HRLayout>
  );
};

export default Employees;
