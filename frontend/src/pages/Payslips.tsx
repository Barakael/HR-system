import { HRLayout } from "@/components/HRLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Download, Receipt, Loader2 } from "lucide-react";
import { usePayslips, downloadPayslip } from "@/hooks/api/usePayslips";

const Payslips = () => {
  const { data: payslips = [], isLoading } = usePayslips();
  const latest = payslips[0];

  return (
    <HRLayout title="Payslips" subtitle="View and download your pay statements">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Gross Salary</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">{latest ? `$${latest.gross.toLocaleString()}` : "—"}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Deductions</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">{latest ? `$${latest.deductions.toLocaleString()}` : "—"}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm border-l-4 border-l-accent">
          <p className="text-sm text-muted-foreground">Net Pay</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">{latest ? `$${latest.net.toLocaleString()}` : "—"}</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-card-foreground">Pay History</h2>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
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
                {payslips.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-card-foreground flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      {p.period}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">${p.gross.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">${p.deductions.toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-medium text-card-foreground">${p.net.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge label={p.status} variant={p.status === "Paid" ? "success" : "warning"} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button variant="ghost" size="sm" onClick={() => downloadPayslip(p.id, `payslip-${p.period}`)}> 
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </HRLayout>
  );
};

export default Payslips;
