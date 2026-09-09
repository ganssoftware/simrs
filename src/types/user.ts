export type UserRole =
    | "admin"
    | "petugas"
    | "dokter"
    | "perawat";

export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    profile_photo?: string | null;
    role: UserRole;
    is_active: boolean;
    created_at: string;
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    full_name: string;
    role: UserRole;
}

export interface UpdateUserRequest {
    username: string;
    email: string;
    password?: string;
    full_name: string;
    role: UserRole;
}

export interface RegisterUserResponse {
    success: boolean;
    message: string;
    data: User;
}

export interface UsersResponse {
    success: boolean;
    data: User[];
}

export interface UserSummary {
    total_user: number;
    total_admin: number;
    total_petugas: number;
    total_dokter: number;
    total_perawat: number;
}

export interface UserSummaryResponse {
    success: boolean;
    data: UserSummary;
}

export interface UpdateUserResponse {
    success: boolean;
    message: string;
    data: User;
}

export interface UpdateUserStatusRequest {
    is_active: boolean;
}

export interface UpdateUserStatusResponse {
    success: boolean;
    message: string;
    data: User;
}
