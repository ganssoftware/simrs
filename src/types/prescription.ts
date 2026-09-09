export type PrescriptionStatus =
    | "menunggu"
    | "diproses"
    | "selesai"
    | "batal";

export interface PrescriptionItem {
    id: number;
    prescription_id: number;

    medicine_id: number;
    medicine_code: string;
    medicine_name: string;
    medicine_unit: string;

    quantity: number;
    dosage: string | null;
    instructions: string | null;
}

export interface Prescription {
    id: number;

    medical_record_id: number;
    doctor_id: number;

    patient_id: number;
    patient_name: string;
    medical_record_number: string;

    doctor_name: string;
    polyclinic_name: string;

    registration_number: string;
    visit_date: string;

    status: PrescriptionStatus;

    created_at: string;

    items: PrescriptionItem[];
}

export interface CreatePrescriptionItemRequest {
    medicine_id: number;
    quantity: number;
    dosage?: string;
    instructions?: string;
}

export interface CreatePrescriptionRequest {
    medical_record_id: number;
    items: CreatePrescriptionItemRequest[];
}