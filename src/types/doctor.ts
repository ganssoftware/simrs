export interface Doctor {
    id: number;
    user_id: number | null;
    full_name: string;
    specialization: string | null;
    phone: string | null;
    polyclinic_id: number | null;
    polyclinic_name: string | null;
    is_active: boolean;
    created_at: string;
}

export interface CreateDoctorRequest {
    full_name: string;
    specialization?: string;
    phone?: string;
    polyclinic_id?: number | null;
    user_id?: number | null;
}

export type UpdateDoctorRequest =
    CreateDoctorRequest & {
        is_active?: boolean;
    };