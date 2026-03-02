import { useQuery } from "@tanstack/react-query";
import { reportApi } from "../services/reportService";
import type { DashboardReportQueryParams } from "../types/report";

export const useDashboardReport = (params: DashboardReportQueryParams = {}) => {
  return useQuery({
    queryKey: ["dashboard-report", params.from_date, params.to_date],
    queryFn: () => reportApi.getDashboardReport(params),
    staleTime: 1000 * 60 * 10,
  });
};
