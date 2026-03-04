import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/api/axios";

export interface BankTaxRecord {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  bank_name: string;
  masked_account: string;
  sort_code: string;
  tax_code: string;
  national_insurance: string;
}

function mapRecord(raw: Record<string, unknown>): BankTaxRecord {
  return {
    id:                 raw.id as number,
    user_id:            raw.user_id as number,
    user_name:          (raw.user_name as string) ?? "",
    user_email:         (raw.user_email as string) ?? "",
    bank_name:          (raw.bank_name as string) ?? "",
    masked_account:     (raw.masked_account as string) ?? "",
    sort_code:          (raw.sort_code as string) ?? "",
    tax_code:           (raw.tax_code as string) ?? "",
    national_insurance: (raw.national_insurance as string) ?? "",
  };
}

export function useBankTaxDetails(search?: string) {
  return useQuery<BankTaxRecord[]>({
    queryKey: ["bank-tax", search],
    queryFn: () =>
      api.get("/api/v1/bank-tax", { params: { search } }).then((r) => (r.data.data ?? r.data).map(mapRecord)),
  });
}

export function useCreateBankTax() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/api/v1/bank-tax", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bank-tax"] }),
  });
}

export function useUpdateBankTax() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Record<string, unknown>) =>
      api.put(`/api/v1/bank-tax/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bank-tax"] }),
  });
}

export function useDeleteBankTax() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/api/v1/bank-tax/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bank-tax"] }),
  });
}
