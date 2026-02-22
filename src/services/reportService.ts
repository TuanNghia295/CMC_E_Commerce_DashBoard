import AxiosClient from "../constants/axiosClient";
import type { DashboardReportQueryParams, DashboardReportResponse } from "../types/report";

export const reportApi = {
  getDashboardReport: async (
    params: DashboardReportQueryParams = {}
  ): Promise<DashboardReportResponse> => {
    const queryParams = new URLSearchParams();

    if (params.from_date) queryParams.append("from_date", params.from_date);
    if (params.to_date) queryParams.append("to_date", params.to_date);

    const queryString = queryParams.toString();
    const url = `/admin/reports/dashboard${queryString ? `?${queryString}` : ""}`;

    return AxiosClient.get<DashboardReportResponse>(url);
  },
};
