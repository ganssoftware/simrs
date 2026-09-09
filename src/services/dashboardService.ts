import api from "./api";

import type {
    DashboardSummary,
    QueueItem,
    CalledPatient,
    PolyclinicStatistic,
    LowStockMedicine,
    RegistrationTrend,
} from "../types/dashboard";


interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}


export async function fetchDashboardSummary() {
    const response =
        await api.get<ApiResponse<DashboardSummary>>(
            "/dashboard"
        );

    return response.data.data;
}


export async function fetchTodayQueue(
    polyclinicId?: number
) {
    const response =
        await api.get<ApiResponse<QueueItem[]>>(
            "/dashboard/queue",
            {
                params: polyclinicId
                    ? {
                          polyclinic_id:
                              polyclinicId,
                      }
                    : undefined,
            }
        );

    return response.data.data;
}


export async function fetchCalledPatients(
    polyclinicId?: number
) {
    const response =
        await api.get<ApiResponse<CalledPatient[]>>(
            "/dashboard/called",
            {
                params: polyclinicId
                    ? {
                          polyclinic_id:
                              polyclinicId,
                      }
                    : undefined,
            }
        );

    return response.data.data;
}


export async function fetchPolyclinicStatistics() {
    const response =
        await api.get<
            ApiResponse<PolyclinicStatistic[]>
        >("/dashboard/polyclinics");

    return response.data.data;
}


export async function fetchLowStockMedicines() {
    const response =
        await api.get<
            ApiResponse<LowStockMedicine[]>
        >("/dashboard/low-stock");

    return response.data.data;
}


export async function fetchRegistrationTrend() {
    const response =
        await api.get<
            ApiResponse<RegistrationTrend[]>
        >("/dashboard/registration-trend");

    return response.data.data;
}