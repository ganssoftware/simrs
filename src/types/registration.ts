export type RegistrationStatus =
    | "menunggu"
    | "dipanggil"
    | "diperiksa"
    | "selesai"
    | "batal";

export type VisitType =
    | "baru"
    | "lama";

export interface Registration {
    id: number;
    registration_number: string;

    patient_id: number;
    patient_name: string;
    medical_record_number: string;

    doctor_id: number;
    doctor_name: string;

    polyclinic_id: number;
    polyclinic_name: string;

    registration_date: string;
    visit_date: string;

    queue_number: number | null;

    complaint: string | null;

    visit_type: VisitType;

    registered_by: number | null;

    status: RegistrationStatus;
}

export interface CreateRegistrationRequest {
    patient_id: number;
    doctor_id: number;
    polyclinic_id: number;
    complaint?: string;
    visit_type: VisitType;
}