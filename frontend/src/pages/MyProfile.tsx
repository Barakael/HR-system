import { HRLayout } from "@/components/HRLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { User, Mail, Phone, Building2, MapPin, Shield, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

const mockProfile = {
  phone: "+1 (555) 012-3456",
  location: "New York, NY",
  startDate: "January 15, 2022",
  manager: "Jane Cooper",
  employeeId: "EMP-00042",
  emergencyContact: { name: "Mary Doe", relation: "Spouse", phone: "+1 (555) 987-6543" },
};

export default function MyProfile() {
  const { currentUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(mockProfile.phone);
  const [location, setLocation] = useState(mockProfile.location);

  if (!currentUser) return null;

  const infoRows = [
    { icon: Mail, label: "Email", value: currentUser.email },
    { icon: Phone, label: "Phone", value: phone, editable: true },
    { icon: Building2, label: "Department", value: currentUser.department },
    { icon: MapPin, label: "Location", value: location, editable: true },
    { icon: Shield, label: "Role", value: currentUser.title },
    { icon: User, label: "Employee ID", value: mockProfile.employeeId },
    { icon: User, label: "Start Date", value: mockProfile.startDate },
    { icon: User, label: "Manager", value: mockProfile.manager },
  ];

  return (
    <HRLayout
      title="My Profile"
      subtitle="Your personal information and account settings"
      actions={
        editing ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={() => setEditing(false)}>
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
            <Edit2 className="h-4 w-4 mr-1" /> Edit Profile
          </Button>
        )
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identity card */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center gap-3">
          <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-bold text-blue-700 dark:text-blue-300">
            {currentUser.avatar}
          </div>
          <div>
            <h2 className="font-semibold text-lg text-foreground">{currentUser.name}</h2>
            <p className="text-sm text-muted-foreground">{currentUser.title}</p>
          </div>
          <StatusBadge
            label={currentUser.role === "hr_admin" ? "HR Admin" : "Employee"}
            variant={currentUser.role === "hr_admin" ? "info" : "success"}
          />
          <p className="text-xs text-muted-foreground">{currentUser.department}</p>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoRows.map(({ icon: Icon, label, value, editable }) => (
                <div key={label}>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </Label>
                  {editing && editable ? (
                    <Input
                      value={label === "Phone" ? phone : location}
                      onChange={(e) =>
                        label === "Phone" ? setPhone(e.target.value) : setLocation(e.target.value)
                      }
                      className="h-8 text-sm"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1">Name</Label>
                <p className="text-sm font-medium text-foreground">{mockProfile.emergencyContact.name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1">Relation</Label>
                <p className="text-sm font-medium text-foreground">{mockProfile.emergencyContact.relation}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1">Phone</Label>
                <p className="text-sm font-medium text-foreground">{mockProfile.emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
