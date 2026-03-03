import { useQuery } from "@tanstack/react-query";
import api from "@/components/api/axios";

export interface Payslip {
  id: number;
  period: string;
  period_start: string;
  period_end: string;
  gross: number;
  deductions: number;
  net: number;
  status: string;
  employee?: string;
}

export function usePayslips() {
  return useQuery<Payslip[]>({
    queryKey: ["payslips"],
    queryFn: () => api.get("/api/v1/payslips").then((r) => r.data),
  });
}

export async function downloadPayslip(id: number, filename = "payslip") {
  const r = await api.get(`/api/v1/payslips/${id}/download`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([r.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
