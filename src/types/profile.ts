import type {
    AuthUser,
} from "../stores/authStore";


export interface UpdateProfileResponse {
    success: boolean;
    message: string;
    data: AuthUser & {
        is_active?: boolean;
        created_at?: string;
    };
}