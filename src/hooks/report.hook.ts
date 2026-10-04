import { CreateDailyReportPayload, createProjectDailyReport, getAllDailyReports, getDailyReportById } from "@/api/report.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useGetDailyReports() {
  return useQuery({
    queryKey: ["company-daily-reports-inventory"],
    queryFn: getAllDailyReports,
    select: (response: any) => response?.data?.result || response?.result || response || [],
  });
}

export function useGetDailyReportDetails(reportId: string) {
  return useQuery({
    queryKey: ["daily-report-details", reportId],
    queryFn: () => getDailyReportById(reportId),
    select: (response: any) => {
      const unpacked = response?.data?.result || response?.result || response;
      if (Array.isArray(unpacked)) {
        return unpacked.find((r: any) => r.id === reportId);
      }
      return unpacked;
    },
    enabled: !!reportId,
  });
}

export function useCreateDailyReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDailyReportPayload) => createProjectDailyReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-daily-reports-inventory"] });
    },
  });
}
