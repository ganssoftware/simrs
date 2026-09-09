import api from "./api";

import type {
    Medicine,
    CreateMedicineRequest,
    UpdateMedicineRequest,
} from "../types/medicine";

export const fetchMedicines =
    async (): Promise<Medicine[]> => {
        const response = await api.get(
            "/medicines"
        );

        return response.data.data;
    };

export const fetchMedicineById =
    async (
        id: number
    ): Promise<Medicine> => {
        const response = await api.get(
            `/medicines/${id}`
        );

        return response.data.data;
    };

export const createMedicine =
    async (
        data: CreateMedicineRequest
    ): Promise<Medicine> => {
        const response = await api.post(
            "/medicines",
            data
        );

        return response.data.data;
    };

export const updateMedicine =
    async (
        id: number,
        data: UpdateMedicineRequest
    ): Promise<Medicine> => {
        const response = await api.put(
            `/medicines/${id}`,
            data
        );

        return response.data.data;
    };

export const deleteMedicine =
    async (
        id: number
    ): Promise<Medicine> => {
        const response = await api.delete(
            `/medicines/${id}`
        );

        return response.data.data;
    };