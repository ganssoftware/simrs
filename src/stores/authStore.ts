import { create } from "zustand";


export type UserRole =
    | "admin"
    | "petugas"
    | "dokter"
    | "perawat";


export interface AuthUser {
    id: number;
    username: string;
    email?: string;
    full_name: string;
    profile_photo?: string | null;
    role: UserRole;
}


interface AuthState {
    user: AuthUser | null;
    token: string | null;

    setAuth: (
        token: string,
        user: AuthUser
    ) => void;

    updateUser: (
        user: Partial<AuthUser>
    ) => void;

    logout: () => void;
}


const getStoredUser =
    (): AuthUser | null => {

        const storedUser =
            localStorage.getItem(
                "simrs_user"
            );

        if (!storedUser) {
            return null;
        }

        try {
            return JSON.parse(
                storedUser
            );
        } catch {
            localStorage.removeItem(
                "simrs_user"
            );

            return null;
        }
    };


const getStoredToken =
    (): string | null => {
        return localStorage.getItem(
            "simrs_token"
        );
    };


export const useAuthStore =
    create<AuthState>((set) => ({

        user: getStoredUser(),

        token: getStoredToken(),


        setAuth: (
            token,
            user
        ) => {

            localStorage.setItem(
                "simrs_token",
                token
            );

            localStorage.setItem(
                "simrs_user",
                JSON.stringify(user)
            );

            set({
                token,
                user,
            });
        },


        updateUser: (
            updatedUser
        ) => {

            set((state) => {

                if (!state.user) {
                    return state;
                }

                const newUser = {
                    ...state.user,
                    ...updatedUser,
                };

                localStorage.setItem(
                    "simrs_user",
                    JSON.stringify(
                        newUser
                    )
                );

                return {
                    user: newUser,
                };
            });
        },


        logout: () => {

            localStorage.removeItem(
                "simrs_token"
            );

            localStorage.removeItem(
                "simrs_user"
            );

            set({
                token: null,
                user: null,
            });
        },
    }));