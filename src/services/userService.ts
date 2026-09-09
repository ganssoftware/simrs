import api from "./api";

import type {
    CreateUserRequest,
    RegisterUserResponse,
    UpdateUserRequest,
    UpdateUserResponse,
    UpdateUserStatusRequest,
    UpdateUserStatusResponse,
    UsersResponse,
    UserSummaryResponse,
} from "../types/user";

export const registerUser = async (
    data: CreateUserRequest
): Promise<RegisterUserResponse> => {
    const response =
        await api.post<RegisterUserResponse>(
            "/register",
            data
        );

    return response.data;
};

export const fetchUsers =
    async (): Promise<UsersResponse> => {
        const response =
            await api.get<UsersResponse>(
                "/users"
            );

        return response.data;
    };

export const fetchUserSummary =
    async (): Promise<UserSummaryResponse> => {
        const response =
            await api.get<UserSummaryResponse>(
                "/users/summary"
            );

        return response.data;
    };

export const updateUser =
    async (
        id: number,
        data: UpdateUserRequest
    ): Promise<UpdateUserResponse> => {
        const response =
            await api.put<UpdateUserResponse>(
                `/users/${id}`,
                data
            );

        return response.data;
    };

export const updateUserStatus =
    async (
        id: number,
        data: UpdateUserStatusRequest
    ): Promise<UpdateUserStatusResponse> => {
        const response =
            await api.patch<UpdateUserStatusResponse>(
                `/users/${id}/status`,
                data
            );

        return response.data;
    };