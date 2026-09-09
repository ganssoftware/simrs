import api from "./api";

import type {
    Doctor,
    CreateDoctorRequest,
    UpdateDoctorRequest,
} from "../types/doctor";

interface DoctorsResponse {
    success: boolean;
    data: Doctor[];
    message?: string;
}

interface DoctorResponse {
    success: boolean;
    data: Doctor;
    message?: string;
}

export async function fetchDoctors(): Promise<
    Doctor[]
> {
    const response =
        await api.get<DoctorsResponse>(
            "/doctors"
        );

    return response.data.data;
}

export async function fetchDoctorById(
    id: number
): Promise<Doctor> {
    const response =
        await api.get<DoctorResponse>(
            `/doctors/${id}`
        );

    return response.data.data;
}

export async function createDoctor(
    data: CreateDoctorRequest
): Promise<Doctor> {
    const response =
        await api.post<DoctorResponse>(
            "/doctors",
            data
        );

    return response.data.data;
}

export async function updateDoctor(
    id: number,
    data: UpdateDoctorRequest
): Promise<Doctor> {
    const response =
        await api.put<DoctorResponse>(
            `/doctors/${id}`,
            data
        );

    return response.data.data;
}

export async function deleteDoctor(
    id: number
): Promise<void> {
    await api.delete(`/doctors/${id}`);
}