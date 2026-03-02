import { HRLayout } from "@/components/HRLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Download, Receipt } from "lucide-react";

const payslips = [
  { period: "February 2026", gross: "$8,500", deductions: "$2,125", net: "$6,375", status: "Paid" },
  { period: "January 2026", gross: "$8,500", deductions: "$2,125", net: "$6,375", status: "Paid" },
  { period: "December 2025", gross: "$8,500", deductions: "$2,180", net: "$6,320", status: "Paid" },
  { period: "November 2025", gross: "$8,500", deductions: "$2,125", net: "$6,375", status: "Paid" },
  { period: "October 2025", gross: "$8,500", deductions: "$2,125", net: "$6,375", status: "Paid" },
];

const Payslips = () => {
  return (
    <HRLayout title="Payslips" subtitle="View and download your pay statements">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Gross Salary</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">$8,500</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Deductions</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">$2,125</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm border-l-4 border-l-accent">
          <p className="text-sm text-muted-foreground">Net Pay</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">$6,375</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-card-foreground">Pay History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Period</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Gross</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Deductions</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Net Pay</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-5 py-3 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payslips.map((p, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-card-foreground flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    {p.period}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{p.gross}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{p.deductions}</td>
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{p.net}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge label={p.status} variant="success" />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HRLayout>
  );
};

export default Payslips;
