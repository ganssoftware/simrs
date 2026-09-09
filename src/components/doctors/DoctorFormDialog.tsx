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
    Doctor,
    CreateDoctorRequest,
} from "../../types/doctor";

import type {
    Polyclinic,
} from "../../types/polyclinic";

interface DoctorFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (
        data: CreateDoctorRequest
    ) => Promise<void>;
    doctor?: Doctor | null;
    polyclinics: Polyclinic[];
    loading?: boolean;
}

const initialForm: CreateDoctorRequest = {
    full_name: "",
    specialization: "",
    phone: "",
    polyclinic_id: null,
    user_id: null,
};

export default function DoctorFormDialog({
    open,
    onClose,
    onSubmit,
    doctor,
    polyclinics,
    loading = false,
}: DoctorFormDialogProps) {
    const [form, setForm] =
        useState<CreateDoctorRequest>(
            initialForm
        );

    const [error, setError] =
        useState("");

    const isEdit = Boolean(doctor);

    useEffect(() => {
        if (doctor) {
            setForm({
                full_name:
                    doctor.full_name,
                specialization:
                    doctor.specialization ??
                    "",
                phone:
                    doctor.phone ?? "",
                polyclinic_id:
                    doctor.polyclinic_id,
                user_id:
                    doctor.user_id,
            });
        } else {
            setForm(initialForm);
        }

        setError("");
    }, [doctor, open]);

    const handleChange = (
        field: keyof CreateDoctorRequest,
        value: string | number | null
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!form.full_name.trim()) {
            setError(
                "Nama dokter wajib diisi."
            );
            return;
        }

        try {
            setError("");

            await onSubmit({
                ...form,
                full_name:
                    form.full_name.trim(),
                specialization:
                    form.specialization?.trim(),
                phone:
                    form.phone?.trim(),
            });
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    "Gagal menyimpan data dokter."
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
                {isEdit
                    ? "Edit Data Dokter"
                    : "Tambah Dokter"}
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
                    label="Nama Lengkap"
                    value={
                        form.full_name
                    }
                    onChange={(e) =>
                        handleChange(
                            "full_name",
                            e.target.value
                        )
                    }
                    fullWidth
                    required
                    disabled={loading}
                />

                <TextField
                    label="Spesialisasi"
                    value={
                        form.specialization
                    }
                    onChange={(e) =>
                        handleChange(
                            "specialization",
                            e.target.value
                        )
                    }
                    placeholder="Contoh: Penyakit Dalam"
                    fullWidth
                    disabled={loading}
                />

                <TextField
                    label="Nomor Telepon"
                    value={form.phone}
                    onChange={(e) =>
                        handleChange(
                            "phone",
                            e.target.value
                        )
                    }
                    fullWidth
                    disabled={loading}
                />

                <TextField
                    select
                    label="Poliklinik"
                    value={
                        form.polyclinic_id ??
                        ""
                    }
                    onChange={(e) =>
                        handleChange(
                            "polyclinic_id",
                            e.target.value
                                ? Number(
                                      e.target
                                          .value
                                  )
                                : null
                        )
                    }
                    fullWidth
                    disabled={loading}
                >
                    <MenuItem value="">
                        Tidak ada
                    </MenuItem>

                    {polyclinics.map(
                        (polyclinic) => (
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
                    ) : isEdit ? (
                        "Simpan Perubahan"
                    ) : (
                        "Simpan"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}