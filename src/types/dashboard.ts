export interface DashboardSummary {
    total_patients: string;
    registrations_today: string;
    waiting_patients: string;
    called_patients: string;
    examining_patients: string;
    completed_patients: string;
    cancelled_patients: string;
    active_doctors: string;
    active_polyclinics: string;
    waiting_prescriptions: string;
    low_stock_medicines: string;
}

export interface QueueItem {
    id: number;
    registration_number: string;
    queue_number: number;

    patient_id: number;
    medical_record_number: string;
    patient_name: string;
    gender: string;

    doctor_id: number;
    doctor_name: string;

    polyclinic_id: number;
    polyclinic_name: string;

    visit_type: "baru" | "lama";
    complaint: string | null;

    status:
        | "menunggu"
        | "dipanggil"
        | "diperiksa"
        | "selesai"
        | "batal";

    registration_date: string;
    visit_date: string;
}

export interface CalledPatient {
    id: number;
    registration_number: string;
    queue_number: number;

    patient_id: number;
    medical_record_number: string;
    patient_name: string;

    doctor_id: number;
    doctor_name: string;

    polyclinic_id: number;
    polyclinic_name: string;

    status: "dipanggil";
    visit_date: string;
}

export interface PolyclinicStatistic {
    id: number;
    name: string;
    total: string;
    waiting: string;
    called: string;
    examining: string;
    completed: string;
    cancelled: string;
}

export interface LowStockMedicine {
    id: number;
    code: string;
    name: string;
    unit: string;
    stock: number;
    price: string;
}

export interface RegistrationTrend {
    visit_date: string;
    total: string;
    completed: string;
    cancelled: string;
}