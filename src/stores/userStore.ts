import { create } from "zustand";

import type {
    CreateUserRequest,
    UpdateUserRequest,
    User,
    UserSummary,
} from "../types/user";

import {
    fetchUsers,
    fetchUserSummary,
    registerUser,
    updateUser,
    updateUserStatus,
} from "../services/userService";


interface UserState {
    loading: boolean;
    summaryLoading: boolean;
    error: string;
    users: User[];
    summary: UserSummary;

    loadUsers: () => Promise<void>;
    loadSummary: () => Promise<void>;

    register: (
        data: CreateUserRequest
    ) => Promise<User>;

    edit: (
        id: number,
        data: UpdateUserRequest
    ) => Promise<User>;

    toggleStatus: (
        id: number,
        isActive: boolean
    ) => Promise<User>;

    clearError: () => void;
}

export const useUserStore =
    create<UserState>((set) => ({

        loading: false,
        summaryLoading: false,
        error: "",
        users: [],
        summary: {
            total_user: 0,
            total_admin: 0,
            total_petugas: 0,
            total_dokter: 0,
            total_perawat: 0,
        },

        loadUsers: async () => {
            try {
                set({
                    loading: true,
                    error: "",
                });

                const result =
                    await fetchUsers();
                if (!result.success) {
                    throw new Error(
                        "Gagal mengambil data user"
                    );
                }
                set({
                    users: result.data,
                    loading: false,
                });
            } catch (error: any) {
                const message =
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Gagal mengambil data user";
                set({
                    loading: false,
                    error: message,
                });
            }
        },

        loadSummary: async () => {
            try {
                set({
                    summaryLoading: true,
                    error: "",
                });

                const result =
                    await fetchUserSummary();
                if (!result.success) {
                    throw new Error(
                        "Gagal mengambil summary user"
                    );
                }
                set({
                    summary: result.data,
                    summaryLoading: false,
                });
            } catch (error: any) {
                const message =
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Gagal mengambil summary user";
                set({
                    summaryLoading: false,
                    error: message,
                });
            }
        },

        register: async (
            data
        ) => {
            try {
                set({
                    loading: true,
                    error: "",
                });

                const result =
                    await registerUser(data);

                if (!result.success) {
                    throw new Error(
                        result.message ||
                        "Registrasi gagal"
                    );
                }

                const usersResult =
                    await fetchUsers();
                set({
                    users:
                        usersResult.data,
                    loading: false,
                });
                return result.data;
            } catch (error: any) {
                const message =
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Registrasi gagal";
                set({
                    loading: false,
                    error: message,
                });
                throw error;
            }
        },

        edit: async (
            id,
            data
        ) => {
            try {
                set({
                    loading: true,
                    error: "",
                });

                const result =
                    await updateUser(
                        id,
                        data
                    );

                if (!result.success) {
                    throw new Error(
                        result.message ||
                        "Gagal memperbarui user"
                    );
                }

                const usersResult =
                    await fetchUsers();
                set({
                    users:
                        usersResult.data,

                    loading: false,
                });
                return result.data;
            } catch (error: any) {
                const message =
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Gagal memperbarui user";
                set({
                    loading: false,
                    error: message,
                });
                throw error;
            }
        },

        toggleStatus: async (
            id,
            isActive
        ) => {
            try {
                set({
                    loading: true,
                    error: "",
                });

                const result =
                    await updateUserStatus(
                        id,
                        {
                            is_active:
                                isActive,
                        }
                    );

                if (!result.success) {
                    throw new Error(
                        result.message ||
                        "Gagal mengubah status user"
                    );
                }

                const usersResult =
                    await fetchUsers();
                set({
                    users:
                        usersResult.data,

                    loading: false,
                });
                return result.data;
            } catch (error: any) {
                const message =
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Gagal mengubah status user";
                set({
                    loading: false,
                    error: message,
                });
                throw error;
            }
        },

        clearError: () => {

            set({
                error: "",
            });

        },

    }));