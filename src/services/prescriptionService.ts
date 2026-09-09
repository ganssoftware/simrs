import api from "./api";

import type {
    Prescription,
    CreatePrescriptionRequest,
} from "../types/prescription";

export const fetchPrescriptions =
    async (): Promise<Prescription[]> => {
        const response = await api.get(
            "/prescriptions"
        );

        console.log(
            "PRESCRIPTION API:",
            response.data
        );
        
        return response.data.data;
    };

export const fetchPrescriptionById =
    async (
        id: number
    ): Promise<Prescription> => {
        const response = await api.get(
            `/prescriptions/${id}`
        );

        return response.data.data;
    };

export const fetchPrescriptionsByMedicalRecord =
    async (
        medicalRecordId: number
    ): Promise<Prescription[]> => {
        const response = await api.get(
            `/prescriptions/medical-record/${medicalRecordId}`
        );

        return response.data.data;
    };

export const createPrescription =
    async (
        data: CreatePrescriptionRequest
    ): Promise<Prescription> => {
        const response = await api.post(
            "/prescriptions",
            data
        );

        return response.data.data;
    };

export const processPrescription =
    async (
        id: number
    ): Promise<Prescription> => {
        const response = await api.patch(
            `/prescriptions/${id}/process`
        );

        return response.data.data;
    };

export const finishPrescription =
    async (
        id: number
    ): Promise<Prescription> => {
        const response = await api.patch(
            `/prescriptions/${id}/finish`
        );

        return response.data.data;
    };