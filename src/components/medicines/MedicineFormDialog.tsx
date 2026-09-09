import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
} from "@mui/material";

import type {
    Medicine,
    CreateMedicineRequest,
    UpdateMedicineRequest,
} from "../../types/medicine";

interface MedicineFormDialogProps {
    open: boolean;
    medicine: Medicine | null;
    onClose: () => void;
    onSubmit: (
        data:
            | CreateMedicineRequest
            | UpdateMedicineRequest
    ) => Promise<void>;
}

interface FormState {
    code: string;
    name: string;
    unit: string;
    stock: string;
    price: string;
    is_active: boolean;
}

const MedicineFormDialog = ({
    open,
    medicine,
    onClose,
    onSubmit,
}: MedicineFormDialogProps) => {
    const isEdit =
        medicine !== null;

    const [form, setForm] =
        useState<FormState>({
            code: "",
            name: "",
            unit: "",
            stock: "0",
            price: "0",
            is_active: true,
        });

    const [errors, setErrors] =
        useState<{
            code?: string;
            name?: string;
            unit?: string;
            stock?: string;
            price?: string;
        }>({});

    const [submitting, setSubmitting] =
        useState<boolean>(false);

    const [submitError, setSubmitError] =
        useState<string>("");

    /**
     * =========================
     * INITIALIZE FORM
     * =========================
     */
    useEffect(() => {
        if (!open) {
            return;
        }

        if (medicine) {
            setForm({
                code: medicine.code ?? "",
                name: medicine.name ?? "",
                unit: medicine.unit ?? "",
                stock: String(
                    medicine.stock ?? 0
                ),
                price: String(
                    medicine.price ?? 0
                ),
                is_active:
                    medicine.is_active,
            });
        } else {
            setForm({
                code: "",
                name: "",
                unit: "",
                stock: "0",
                price: "0",
                is_active: true,
            });
        }

        setErrors({});
        setSubmitError("");
    }, [
        open,
        medicine,
    ]);

    /**
     * =========================
     * HANDLE CHANGE
     * =========================
     */
    const handleChange = (
        field: keyof FormState,
        value: string | boolean
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: undefined,
        }));

        setSubmitError("");
    };

    /**
     * =========================
     * VALIDATION
     * =========================
     */
    const validate = () => {
        const newErrors: typeof errors =
            {};

        const code =
            form.code.trim();

        const name =
            form.name.trim();

        const unit =
            form.unit.trim();

        const stock =
            Number(form.stock);

        const price =
            Number(form.price);

        if (!code) {
            newErrors.code =
                "Kode obat wajib diisi.";
        }

        if (!name) {
            newErrors.name =
                "Nama obat wajib diisi.";
        }

        if (!unit) {
            newErrors.unit =
                "Satuan wajib diisi.";
        }

        if (
            form.stock.trim() === "" ||
            !Number.isInteger(stock) ||
            stock < 0
        ) {
            newErrors.stock =
                "Stok harus berupa bilangan bulat >= 0.";
        }

        if (
            form.price.trim() === "" ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            newErrors.price =
                "Harga harus berupa angka >= 0.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors)
                .length === 0
        );
    };

    /**
     * =========================
     * SUBMIT
     * =========================
     */
    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        try {
            setSubmitting(true);
            setSubmitError("");

            if (isEdit) {
                const data: UpdateMedicineRequest =
                {
                    code:
                        form.code.trim(),
                    name:
                        form.name.trim(),
                    unit:
                        form.unit.trim(),
                    stock: Number(
                        form.stock
                    ),
                    price: Number(
                        form.price
                    ),
                    is_active:
                        form.is_active,
                };

                await onSubmit(data);
            } else {
                const data: CreateMedicineRequest =
                {
                    code:
                        form.code.trim(),
                    name:
                        form.name.trim(),
                    unit:
                        form.unit.trim(),
                    stock: Number(
                        form.stock
                    ),
                    price: Number(
                        form.price
                    ),
                };

                await onSubmit(data);
            }
        } catch (error: any) {
            console.error(
                "Gagal menyimpan obat:",
                error
            );

            setSubmitError(
                error?.response?.data
                    ?.message ||
                "Gagal menyimpan data obat."
            );
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * =========================
     * CLOSE
     * =========================
     */
    const handleDialogClose = () => {
        if (submitting) {
            return;
        }

        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={
                handleDialogClose
            }
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {isEdit
                    ? "Edit Obat"
                    : "Tambah Obat"}
            </DialogTitle>

            <DialogContent>
                <Stack
                    spacing={2}
                    sx={{
                        mt: 1,
                    }}
                >
                    {submitError && (
                        <Alert severity="error">
                            {submitError}
                        </Alert>
                    )}

                    <TextField
                        label="Kode Obat"
                        value={form.code}
                        onChange={(event) =>
                            handleChange(
                                "code",
                                event.target
                                    .value
                            )
                        }
                        error={
                            !!errors.code
                        }
                        helperText={
                            errors.code
                        }
                        fullWidth
                        required
                        disabled={
                            submitting
                        }
                        slotProps={{
                            htmlInput: {
                                maxLength: 30,
                            }
                        }}
                    />

                    <TextField
                        label="Nama Obat"
                        value={form.name}
                        onChange={(event) =>
                            handleChange(
                                "name",
                                event.target
                                    .value
                            )
                        }
                        error={
                            !!errors.name
                        }
                        helperText={
                            errors.name
                        }
                        fullWidth
                        required
                        disabled={
                            submitting
                        }
                        slotProps={{
                            htmlInput: {
                                maxLength: 100,
                            }
                        }}
                    />

                    <TextField
                        label="Satuan"
                        placeholder="Contoh: Tablet, Kapsul, Botol"
                        value={form.unit}
                        onChange={(event) =>
                            handleChange(
                                "unit",
                                event.target
                                    .value
                            )
                        }
                        error={
                            !!errors.unit
                        }
                        helperText={
                            errors.unit
                        }
                        fullWidth
                        required
                        disabled={
                            submitting
                        }
                        slotProps={{
                            htmlInput: {
                                maxLength: 30,
                            }
                        }}
                    />

                    <TextField
                        label="Stok"
                        type="number"
                        value={form.stock}
                        onChange={(event) =>
                            handleChange(
                                "stock",
                                event.target
                                    .value
                            )
                        }
                        error={
                            !!errors.stock
                        }
                        helperText={
                            errors.stock
                        }
                        fullWidth
                        required
                        disabled={
                            submitting
                        }
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                step: 1,
                            },
                        }}
                    />

                    <TextField
                        label="Harga"
                        type="number"
                        value={form.price}
                        onChange={(event) =>
                            handleChange(
                                "price",
                                event.target
                                    .value
                            )
                        }
                        error={
                            !!errors.price
                        }
                        helperText={
                            errors.price
                        }
                        fullWidth
                        required
                        disabled={
                            submitting
                        }
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                step: 100,
                            },
                        }}
                    />

                    {isEdit && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        form.is_active
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        handleChange(
                                            "is_active",
                                            event
                                                .target
                                                .checked
                                        )
                                    }
                                    disabled={
                                        submitting
                                    }
                                />
                            }
                            label={
                                form.is_active
                                    ? "Obat Aktif"
                                    : "Obat Tidak Aktif"
                            }
                        />
                    )}
                </Stack>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2,
                }}
            >
                <Button
                    onClick={
                        handleDialogClose
                    }
                    disabled={
                        submitting
                    }
                >
                    Batal
                </Button>

                <Button
                    variant="contained"
                    onClick={
                        handleSubmit
                    }
                    disabled={
                        submitting
                    }
                >
                    {submitting
                        ? "Menyimpan..."
                        : isEdit
                            ? "Simpan Perubahan"
                            : "Tambah Obat"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MedicineFormDialog;
