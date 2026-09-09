import api from "./api";

import type {
    Polyclinic,
    CreatePolyclinicRequest,
} from "../types/polyclinic";

export const fetchPolyclinics = async (): Promise<
    Polyclinic[]
> => {
    const response = await api.get(
        "/polyclinics"
    );

    return response.data.data;
};

export const fetchPolyclinicById = async (
    id: number
): Promise<Polyclinic> => {
    const response = await api.get(
        `/polyclinics/${id}`
    );

    return response.data.data;
};

export const createPolyclinic = async (
    data: CreatePolyclinicRequest
): Promise<Polyclinic> => {
    const response = await api.post(
        "/polyclinics",
        data
    );

    return response.data.data;
};

export const updatePolyclinic = async (
    id: number,
    data: CreatePolyclinicRequest
): Promise<Polyclinic> => {
    const response = await api.put(
        `/polyclinics/${id}`,
        data
    );

    return response.data.data;
};

export const deletePolyclinic = async (
    id: number
) => {
    const response = await api.delete(
        `/polyclinics/${id}`
    );

    return response.data;
};