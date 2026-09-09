export type Gender = "Laki-laki" | "Perempuan";

export interface Patient {
    id: number;
    medical_record_number: string;
    nik: string | null;
    full_name: string;
    gender: Gender;
    birth_place: string | null;
    birth_date: string | null;
    address: string | null;
    phone: string | null;
    blood_type: string | null;
    marital_status: string | null;
    occupation: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreatePatientRequest {
    medical_record_number: string;
    nik?: string;
    full_name: string;
    gender: Gender;
    birth_place?: string;
    birth_date?: string;
    address?: string;
    phone?: string;
    blood_type?: string;
    marital_status?: string;
    occupation?: string;
}

export type UpdatePatientRequest =
    CreatePatientRequest;