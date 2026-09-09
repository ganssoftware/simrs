import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
} from "@mui/material";

import type {
    Patient,
} from "../../types/patient";

import type {
    Doctor,
} from "../../types/doctor";

import type {
    Polyclinic,
} from "../../types/polyclinic";

import type {
    CreateRegistrationRequest,
} from "../../types/registration";

interface RegistrationFormDialogProps {
    open: boolean;
    onClose: () => void;

    onSubmit: (
        data: CreateRegistrationRequest
    ) => Promise<void>;

    patients: Patient[];
    doctors: Doctor[];
    polyclinics: Polyclinic[];

    loading?: boolean;
}

const initialForm: CreateRegistrationRequest = {
    patient_id: 0,
    doctor_id: 0,
    polyclinic_id: 0,
    complaint: "",
    visit_type: "baru",
};

export default function RegistrationFormDialog({
    open,
    onClose,
    onSubmit,
    patients,
    doctors,
    polyclinics,
    loading = false,
}: RegistrationFormDialogProps) {
    const [form, setForm] =
        useState<CreateRegistrationRequest>(
            initialForm
        );

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (open) {
            setForm(initialForm);
            setError("");
        }
    }, [open]);

    const handleChange = (
        field: keyof CreateRegistrationRequest,
        value: string | number
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const filteredDoctors =
        doctors.filter(
            (doctor) =>
                doctor.polyclinic_id ===
                    form.polyclinic_id &&
                doctor.is_active
        );

    const handleSubmit = async () => {
        if (!form.patient_id) {
            setError(
                "Pasien wajib dipilih."
            );
            return;
        }

        if (!form.polyclinic_id) {
            setError(
                "Poliklinik wajib dipilih."
            );
            return;
        }

        if (!form.doctor_id) {
            setError(
                "Dokter wajib dipilih."
            );
            return;
        }

        try {
            setError("");

            await onSubmit(form);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    "Gagal membuat registrasi."
            );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Registrasi Pasien
            </DialogTitle>

            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection:
                        "column",
                    gap: 2,
                    pt:
                        "16px !important",
                }}
            >
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <TextField
                    select
                    label="Pasien"
                    value={
                        form.patient_id ||
                        ""
                    }
                    onChange={(e) =>
                        handleChange(
                            "patient_id",
                            Number(
                                e.target.value
                            )
                        )
                    }
                    fullWidth
                    required
                    disabled={loading}
                >
                    <MenuItem value="">
                        Pilih Pasien
                    </MenuItem>

                    {patients.map(
                        (patient) => (
                            <MenuItem
                                key={
                                    patient.id
                                }
                                value={
                                    patient.id
                                }
                            >
                                {
                                    patient.full_name
                                }{" "}
                                —{" "}
                                {
                                    patient.medical_record_number
                                }
                            </MenuItem>
                        )
                    )}
                </TextField>

                <TextField
                    select
                    label="Jenis Kunjungan"
                    value={
                        form.visit_type
                    }
                    onChange={(e) =>
                        handleChange(
                            "visit_type",
                            e.target
                                .value
                        )
                    }
                    fullWidth
                    disabled={loading}
                >
                    <MenuItem value="baru">
                        Pasien Baru
                    </MenuItem>

                    <MenuItem value="lama">
                        Pasien Lama
                    </MenuItem>
                </TextField>

                <TextField
                    select
                    label="Poliklinik"
                    value={
                        form.polyclinic_id ||
                        ""
                    }
                    onChange={(e) => {
                        const polyclinicId =
                            Number(
                                e.target
                                    .value
                            );

                        setForm(
                            (prev) => ({
                                ...prev,
                                polyclinic_id:
                                    polyclinicId,
                                doctor_id:
                                    0,
                            })
                        );
                    }}
                    fullWidth
                    required
                    disabled={loading}
                >
                    <MenuItem value="">
                        Pilih Poliklinik
                    </MenuItem>

                    {polyclinics
                        .filter(
                            (
                                polyclinic
                            ) =>
                                polyclinic.is_active
                        )
                        .map(
                            (
                                polyclinic
                            ) => (
                                <MenuItem
                                    key={
                                        polyclinic.id
                                    }
                                    value={
                                        polyclinic.id
                                    }
                                >
                                    {
                                        polyclinic.name
                                    }
                                </MenuItem>
                            )
                        )}
                </TextField>

                <TextField
                    select
                    label="Dokter"
                    value={
                        form.doctor_id ||
                        ""
                    }
                    onChange={(e) =>
                        handleChange(
                            "doctor_id",
                            Number(
                                e.target.value
                            )
                        )
                    }
                    fullWidth
                    required
                    disabled={
                        loading ||
                        !form.polyclinic_id
                    }
                >
                    <MenuItem value="">
                        {form.polyclinic_id
                            ? "Pilih Dokter"
                            : "Pilih Poliklinik terlebih dahulu"}
                    </MenuItem>

                    {filteredDoctors.map(
                        (doctor) => (
                            <MenuItem
                                key={
                                    doctor.id
                                }
                                value={
                                    doctor.id
                                }
                            >
                                Dr.{" "}
                                {
                                    doctor.full_name
                                }
                                {doctor.specialization
                                    ? ` — ${doctor.specialization}`
                                    : ""}
                            </MenuItem>
                        )
                    )}
                </TextField>

                <TextField
                    label="Keluhan"
                    value={
                        form.complaint
                    }
                    onChange={(e) =>
                        handleChange(
                            "complaint",
                            e.target.value
                        )
                    }
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="Masukkan keluhan utama pasien..."
                    disabled={loading}
                />
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2,
                }}
            >
                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Batal
                </Button>

                <Button
                    variant="contained"
                    onClick={
                        handleSubmit
                    }
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress
                            size={22}
                            color="inherit"
                        />
                    ) : (
                        "Daftarkan Pasien"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}