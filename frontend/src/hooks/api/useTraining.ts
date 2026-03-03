import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/api/axios";

export interface TrainingProgram {
  id: number;
  title: string;
  category: string;
  instructor: string;
  duration: string;
  status: string;
  description?: string;
  enrollments_count: number;
}

export interface TrainingEnrollment {
  id: number;
  title: string;
  category: string;
  instructor: string;
  progress: number;
  status: string;
  duration: string;
}

function mapProgram(raw: Record<string, unknown>): TrainingProgram {
  return {
    id:                raw.id as number,
    title:             raw.title as string,
    category:          (raw.category as string) ?? "",
    instructor:        (raw.instructor as string) ?? "",
    duration:          (raw.duration as string) ?? "",
    status:            (raw.status as string) ?? "Active",
    description:       raw.description as string,
    enrollments_count: (raw.enrollments_count as number) ?? 0,
  };
}

function mapEnrollment(raw: Record<string, unknown>): TrainingEnrollment {
  const program = (raw.program as Record<string, unknown>) ?? {};
  return {
    id:         raw.id as number,
    title:      (program.title as string) ?? "",
    category:   (program.category as string) ?? "",
    instructor: (program.instructor as string) ?? "",
    progress:   (raw.progress as number) ?? 0,
    status:     (raw.status as string) ?? "Enrolled",
    duration:   (program.duration as string) ?? "",
  };
}

export function useTrainingPrograms() {
  return useQuery<TrainingProgram[]>({
    queryKey: ["training", "programs"],
    queryFn: () =>
      api.get("/api/v1/training").then((r) => (r.data.data ?? r.data).map(mapProgram)),
  });
}

export function useMyEnrollments() {
  return useQuery<TrainingEnrollment[]>({
    queryKey: ["training", "my-enrollments"],
    queryFn: () =>
      api.get("/api/v1/training/my-enrollments").then((r) => r.data.map(mapEnrollment)),
  });
}

export function useCreateTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/api/v1/training", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["training"] }),
  });
}

export function useUpdateTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Record<string, unknown>) =>
      api.put(`/api/v1/training/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["training"] }),
  });
}

export function useDeleteTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/api/v1/training/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["training"] }),
  });
}

export function useEnroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (trainingId: number) =>
      api.post(`/api/v1/training/${trainingId}/enroll`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["training"] }),
  });
}
