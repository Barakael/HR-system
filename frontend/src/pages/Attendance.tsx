import { HRLayout } from "@/components/HRLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Clock, CheckCircle2, XCircle, AlertCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Half Day";

interface AttendanceRecord {
  date: string;
  employee: string;
  clockIn: string;
  clockOut: string;
  hours: string;
  status: AttendanceStatus;
}

const allRecords: AttendanceRecord[] = [
  { date: "Mar 2, 2026", employee: "John Doe", clockIn: "08:55", clockOut: "17:30", hours: "8h 35m", status: "Present" },
  { date: "Mar 1, 2026", employee: "John Doe", clockIn: "09:10", clockOut: "17:00", hours: "7h 50m", status: "Present" },
  { date: "Feb 28, 2026", employee: "John Doe", clockIn: "10:05", clockOut: "17:15", hours: "7h 10m", status: "Late" },
  { date: "Feb 27, 2026", employee: "John Doe", clockIn: "—", clockOut: "—", hours: "—", status: "Absent" },
  { date: "Feb 26, 2026", employee: "John Doe", clockIn: "09:00", clockOut: "13:00", hours: "4h 00m", status: "Half Day" },
  { date: "Mar 2, 2026", employee: "Sarah Miller", clockIn: "08:45", clockOut: "17:15", hours: "8h 30m", status: "Present" },
  { date: "Mar 2, 2026", employee: "Michael Chen", clockIn: "—", clockOut: "—", hours: "—", status: "Absent" },
  { date: "Mar 2, 2026", employee: "Emily Davis", clockIn: "09:30", clockOut: "17:30", hours: "8h 00m", status: "Late" },
  { date: "Mar 1, 2026", employee: "Sarah Miller", clockIn: "08:50", clockOut: "17:20", hours: "8h 30m", status: "Present" },
  { date: "Mar 1, 2026", employee: "Michael Chen", clockIn: "09:05", clockOut: "17:00", hours: "7h 55m", status: "Present" },
];

const statusVariant: Record<AttendanceStatus, "success" | "destructive" | "warning" | "default"> = {
  Present: "success",
  Absent: "destructive",
  Late: "warning",
  "Half Day": "default",
};

export default function Attendance() {
  const { currentUser, isHRAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("March 2026");

  const baseRecords = isHRAdmin
    ? allRecords
    : allRecords.filter((r) => r.employee === currentUser?.name);

  const filtered = baseRecords.filter(
    (r) =>
      r.employee.toLowerCase().includes(search.toLowerCase()) ||
      r.date.toLowerCase().includes(search.toLowerCase())
  );

  const present = baseRecords.filter((r) => r.status === "Present").length;
  const absent = baseRecords.filter((r) => r.status === "Absent").length;
  const late = baseRecords.filter((r) => r.status === "Late").length;

  return (
    <HRLayout
      title="Attendance"
      subtitle={isHRAdmin ? "All employee attendance records" : "Your attendance history"}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Present" value={present} icon={CheckCircle2} variant="success" />
        <StatsCard title="Absent" value={absent} icon={XCircle} variant="accent" />
        <StatsCard title="Late Arrivals" value={late} icon={AlertCircle} variant="warning" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="font-semibold text-foreground flex-1">Attendance Log</h2>
          <div className="flex gap-2">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["March 2026", "February 2026", "January 2026"].map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isHRAdmin && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employee..."
                  className="pl-8 h-8 text-xs w-44"
                />
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                {isHRAdmin && <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Employee</th>}
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Clock In</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Clock Out</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Hours</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((rec, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 text-foreground whitespace-nowrap">{rec.date}</td>
                  {isHRAdmin && <td className="px-4 py-3.5 font-medium text-foreground">{rec.employee}</td>}
                  <td className="px-4 py-3.5 font-mono text-sm text-foreground">{rec.clockIn}</td>
                  <td className="px-4 py-3.5 font-mono text-sm text-foreground">{rec.clockOut}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{rec.hours}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge label={rec.status} variant={statusVariant[rec.status]} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRLayout>
  );
}
