export interface MedicalRecord {
    id: number;
    registration_id: number;
    patient_id: number;
    doctor_id: number;

    patient_name: string;
    medical_record_number: string;
    doctor_name: string;
    polyclinic_name: string;

    registration_number: string;
    visit_date: string;
    complaint: string | null;
    visit_type: "baru" | "lama";

    anamnesis: string | null;
    examination: string | null;
    diagnosis: string | null;
    treatment: string | null;
    notes: string | null;

    created_at: string;
    updated_at: string;
}

export interface CreateMedicalRecordRequest {
    registration_id: number;
    anamnesis?: string;
    examination?: string;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
}

export interface UpdateMedicalRecordRequest {
    anamnesis?: string;
    examination?: string;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
}