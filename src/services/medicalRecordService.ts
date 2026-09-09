import api from "./api";

import type {
    MedicalRecord,
    CreateMedicalRecordRequest,
    UpdateMedicalRecordRequest,
} from "../types/medicalRecord";

export const fetchMedicalRecords =
    async (): Promise<MedicalRecord[]> => {
        const response = await api.get(
            "/medical-records"
        );

        return response.data.data;
    };

export const fetchMedicalRecordById =
    async (
        id: number
    ): Promise<MedicalRecord> => {
        const response = await api.get(
            `/medical-records/${id}`
        );

        return response.data.data;
    };

export const fetchMedicalRecordByRegistration =
    async (
        registrationId: number
    ): Promise<MedicalRecord | null> => {
        const response = await api.get(
            `/medical-records/registration/${registrationId}`
        );

        return response.data.data;
    };

export const createMedicalRecord =
    async (
        data: CreateMedicalRecordRequest
    ): Promise<MedicalRecord> => {
        const response = await api.post(
            "/medical-records",
            data
        );

        return response.data.data;
    };

export const updateMedicalRecord =
    async (
        id: number,
        data: UpdateMedicalRecordRequest
    ): Promise<MedicalRecord> => {
        const response = await api.put(
            `/medical-records/${id}`,
            data
        );

        return response.data.data;
    };

export const finishMedicalRecord =
    async (
        id: number
    ): Promise<MedicalRecord> => {
        const response = await api.patch(
            `/medical-records/${id}/finish`
        );

        return response.data.data;
    };