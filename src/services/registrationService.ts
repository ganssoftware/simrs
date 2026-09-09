import api from "./api";

import type {
    Registration,
    CreateRegistrationRequest,
} from "../types/registration";

interface RegistrationsResponse {
    success: boolean;
    data: Registration[];
    message?: string;
}

interface RegistrationResponse {
    success: boolean;
    data: Registration;
    message?: string;
}

export async function fetchRegistrations(): Promise<
    Registration[]
> {
    const response =
        await api.get<RegistrationsResponse>(
            "/registrations"
        );

    return response.data.data;
}

export async function fetchTodayRegistrations(
    polyclinicId?: number
): Promise<Registration[]> {
    const params =
        polyclinicId
            ? {
                polyclinic_id:
                    polyclinicId,
            }
            : undefined;

    const response =
        await api.get<RegistrationsResponse>(
            "/registrations/today",
            {
                params,
            }
        );

    return response.data.data;
}

export async function createRegistration(
    data: CreateRegistrationRequest
): Promise<Registration> {
    const response =
        await api.post<RegistrationResponse>(
            "/registrations",
            data
        );

    return response.data.data;
}

export async function callRegistration(
    id: number
): Promise<Registration> {
    const response =
        await api.patch<RegistrationResponse>(
            `/registrations/${id}/call`
        );

    return response.data.data;
}

export const callNextRegistration = async (
    polyclinicId: number,
    doctorId: number
) => {
    const response = await api.post(
        "/registrations/queue/next",
        {
            polyclinic_id: polyclinicId,
            doctor_id: doctorId,
        }
    );

    return response.data;
};

export async function startRegistration(
    id: number
): Promise<Registration> {
    const response =
        await api.patch<RegistrationResponse>(
            `/registrations/${id}/start`
        );

    return response.data.data;
}

export async function cancelRegistration(
    id: number
): Promise<Registration> {
    const response =
        await api.patch<RegistrationResponse>(
            `/registrations/${id}/cancel`
        );

    return response.data.data;
}