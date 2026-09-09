import api from "./api";
import type {
    Patient,
    CreatePatientRequest,
    UpdatePatientRequest,
} from "../types/patient";

interface PatientResponse {
    success: boolean;
    data: Patient;
    message?: string;
}

interface PatientsResponse {
    success: boolean;
    data: Patient[];
    message?: string;
}

export async function fetchPatients(): Promise<
    Patient[]
> {
    const response =
        await api.get<PatientsResponse>("/patients");

    return response.data.data;
}

export async function fetchPatientById(
    id: number
): Promise<Patient> {
    const response =
        await api.get<PatientResponse>(
            `/patients/${id}`
        );

    return response.data.data;
}

export async function createPatient(
    data: CreatePatientRequest
): Promise<Patient> {
    const response =
        await api.post<PatientResponse>(
            "/patients",
            data
        );

    return response.data.data;
}

export async function updatePatient(
    id: number,
    data: UpdatePatientRequest
): Promise<Patient> {
    const response =
        await api.put<PatientResponse>(
            `/patients/${id}`,
            data
        );

    return response.data.data;
}

export async function deletePatient(
    id: number
): Promise<void> {
    await api.delete(`/patients/${id}`);
}