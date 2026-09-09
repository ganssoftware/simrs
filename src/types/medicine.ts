export interface Medicine {
    id: number;
    code: string;
    name: string;
    unit: string;
    stock: number;
    price: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateMedicineRequest {
    code: string;
    name: string;
    unit: string;
    stock?: number;
    price?: number;
}

export interface UpdateMedicineRequest {
    code?: string;
    name?: string;
    unit?: string;
    stock?: number;
    price?: number;
    is_active?: boolean;
}