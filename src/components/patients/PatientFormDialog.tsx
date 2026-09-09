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
    CreatePatientRequest,
    Gender,
} from "../../types/patient";

interface PatientFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (
        data: CreatePatientRequest
    ) => Promise<void>;
    patient?: Patient | null;
    loading?: boolean;
}

const initialForm: CreatePatientRequest = {
    medical_record_number: "",
    nik: "",
    full_name: "",
    gender: "Laki-laki",
    birth_place: "",
    birth_date: "",
    address: "",
    phone: "",
    blood_type: "",
    marital_status: "",
    occupation: "",
};

export default function PatientFormDialog({
    open,
    onClose,
    onSubmit,
    patient,
    loading = false,
}: PatientFormDialogProps) {
    const [form, setForm] =
        useState<CreatePatientRequest>(
            initialForm
        );

    const [error, setError] =
        useState("");

    const isEdit = Boolean(patient);

    useEffect(() => {
        if (patient) {
            setForm({
                medical_record_number:
                    patient.medical_record_number,
                nik: patient.nik ?? "",
                full_name: patient.full_name,
                gender: patient.gender,
                birth_place:
                    patient.birth_place ?? "",
                birth_date:
                    patient.birth_date
                        ? patient.birth_date.slice(
                              0,
                              10
                          )
                        : "",
                address: patient.address ?? "",
                phone: patient.phone ?? "",
                blood_type:
                    patient.blood_type ?? "",
                marital_status:
                    patient.marital_status ?? "",
                occupation:
                    patient.occupation ?? "",
            });
        } else {
            setForm(initialForm);
        }

        setError("");
    }, [patient, open]);

    const handleChange = (
        field: keyof CreatePatientRequest,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!form.medical_record_number.trim()) {
            setError(
                "Nomor rekam medis wajib diisi."
            );
            return;
        }

        if (!form.full_name.trim()) {
            setError(
                "Nama pasien wajib diisi."
            );
            return;
        }

        if (!form.gender) {
            setError(
                "Jenis kelamin wajib dipilih."
            );
            return;
        }

        try {
            setError("");
            await onSubmit(form);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    "Gagal menyimpan data pasien."
            );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {isEdit
                    ? "Edit Data Pasien"
                    : "Tambah Pasien"}
            </DialogTitle>

            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    pt: "16px !important",
                }}
            >
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Nomor Rekam Medis"
                    value={
                        form.medical_record_number
                    }
                    onChange={(e) =>
                        handleChange(
                            "medical_record_number",
                            e.target.value
                        )
                    }
                    fullWidth
                    required
                    disabled={loading}
                />

                <TextField
                    label="NIK"
                    value={form.nik}
                    onChange={(e) =>
                        handleChange(
                            "nik",
                            e.target.value
                        )
                    }
                    fullWidth
                    disabled={loading}
                />

                <TextField
                    label="Nama Lengkap"
                    value={form.full_name}
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
                    select
                    label="Jenis Kelamin"
                    value={form.gender}
                    onChange={(e) =>
                        handleChange(
                            "gender",
                            e.target.value as Gender
                        )
                    }
                    fullWidth
                    required
                    disabled={loading}
                >
                    <MenuItem value="Laki-laki">
                        Laki-laki
                    </MenuItem>

                    <MenuItem value="Perempuan">
                        Perempuan
                    </MenuItem>
                </TextField>

                <TextField
                    label="Tempat Lahir"
                    value={form.birth_place}
                    onChange={(e) =>
                        handleChange(
                            "birth_place",
                            e.target.value
                        )
                    }
                    fullWidth
                    disabled={loading}
                />

                <TextField
                    label="Tanggal Lahir"
                    type="date"
                    value={form.birth_date}
                    onChange={(e) =>
                        handleChange(
                            "birth_date",
                            e.target.value
                        )
                    }
                    fullWidth
                    disabled={loading}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />

                <TextField
                    label="Alamat"
                    value={form.address}
                    onChange={(e) =>
                        handleChange(
                            "address",
                            e.target.value
                        )
                    }
                    fullWidth
                    multiline
                    minRows={2}
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
                    label="Golongan Darah"
                    value={form.blood_type}
                    onChange={(e) =>
                        handleChange(
                            "blood_type",
                            e.target.value
                        )
                    }
                    fullWidth
                    disabled={loading}
                >
                    <MenuItem value="">
                        Tidak diketahui
                    </MenuItem>

                    <MenuItem value="A">
                        A
                    </MenuItem>

                    <MenuItem value="B">
                        B
                    </MenuItem>

                    <MenuItem value="AB">
                        AB
                    </MenuItem>

                    <MenuItem value="O">
                        O
                    </MenuItem>
                </TextField>

                <TextField
                    select
                    label="Status Pernikahan"
                    value={form.marital_status}
                    onChange={(e) =>
                        handleChange(
                            "marital_status",
                            e.target.value
                        )
                    }
                    fullWidth
                    disabled={loading}
                >
                    <MenuItem value="">
                        Tidak diketahui
                    </MenuItem>

                    <MenuItem value="Belum Menikah">
                        Belum Menikah
                    </MenuItem>

                    <MenuItem value="Menikah">
                        Menikah
                    </MenuItem>

                    <MenuItem value="Cerai">
                        Cerai
                    </MenuItem>
                </TextField>

                <TextField
                    label="Pekerjaan"
                    value={form.occupation}
                    onChange={(e) =>
                        handleChange(
                            "occupation",
                            e.target.value
                        )
                    }
                    fullWidth
                    disabled={loading}
                />
            </DialogContent>

            <DialogActions
                sx={{ px: 3, pb: 2 }}
            >
                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Batal
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
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