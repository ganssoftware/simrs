import {
    useMemo,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MedicationIcon from "@mui/icons-material/Medication";

import type {
    Prescription,
    CreatePrescriptionRequest,
} from "../../types/prescription";

import type { Medicine } from "../../types/medicine";

interface PrescriptionSectionProps {
    medicalRecordId: number;
    prescriptions: Prescription[];
    medicines: Medicine[];
    disabled?: boolean;
    onCreate: (
        data: CreatePrescriptionRequest
    ) => Promise<void>;
}

interface DraftItem {
    medicine_id: number | "";
    quantity: number;
    dosage: string;
    instructions: string;
}

export default function PrescriptionSection({
    medicalRecordId,
    prescriptions,
    medicines,
    disabled = false,
    onCreate,
}: PrescriptionSectionProps) {
    const [items, setItems] = useState<DraftItem[]>([
        {
            medicine_id: "",
            quantity: 1,
            dosage: "",
            instructions: "",
        },
    ]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const activeMedicines = useMemo(
        () =>
            medicines.filter(
                (medicine) =>
                    medicine.is_active
            ),
        [medicines]
    );

    const addItem = () => {
        setItems((prev) => [
            ...prev,
            {
                medicine_id: "",
                quantity: 1,
                dosage: "",
                instructions: "",
            },
        ]);
    };

    const removeItem = (index: number) => {
        setItems((prev) =>
            prev.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };

    const updateItem = (
        index: number,
        field: keyof DraftItem,
        value: string | number
    ) => {
        setItems((prev) =>
            prev.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                        ...item,
                        [field]: value,
                    }
                    : item
            )
        );
    };

    const handleCreate = async () => {
        setError("");

        if (items.length === 0) {
            setError(
                "Minimal satu obat harus ditambahkan."
            );
            return;
        }

        const invalidItem =
            items.find(
                (item) =>
                    !item.medicine_id ||
                    item.quantity <= 0
            );

        if (invalidItem) {
            setError(
                "Obat dan jumlah wajib diisi."
            );
            return;
        }

        try {
            setLoading(true);

            await onCreate({
                medical_record_id:
                    medicalRecordId,

                items: items.map((item) => ({
                    medicine_id:
                        Number(item.medicine_id),

                    quantity:
                        Number(item.quantity),

                    dosage:
                        item.dosage.trim() ||
                        undefined,

                    instructions:
                        item.instructions.trim() ||
                        undefined,
                })),
            });

            setItems([
                {
                    medicine_id: "",
                    quantity: 1,
                    dosage: "",
                    instructions: "",
                },
            ]);
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                "Gagal membuat resep."
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (
        status: Prescription["status"]
    ) => {
        switch (status) {
            case "menunggu":
                return "warning";

            case "diproses":
                return "info";

            case "selesai":
                return "success";

            case "batal":
                return "error";

            default:
                return "default";
        }
    };

    return (
        <Card sx={{ mt: 3 }}>
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            Resep Obat
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Resep yang terkait dengan
                            rekam medis ini
                        </Typography>
                    </Box>

                    <MedicationIcon />
                </Box>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                {/* ========================= */}
                {/* RESEP YANG SUDAH ADA */}
                {/* ========================= */}

                {prescriptions.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        {prescriptions.map(
                            (prescription) => (
                                <Card
                                    key={
                                        prescription.id
                                    }
                                    variant="outlined"
                                    sx={{
                                        mb: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center",
                                                mb: 1,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Resep #
                                                {
                                                    prescription.id
                                                }
                                            </Typography>

                                            <Chip
                                                size="small"
                                                label={
                                                    prescription.status
                                                }
                                                color={getStatusColor(
                                                    prescription.status
                                                )}
                                            />
                                        </Box>

                                        {prescription.items.map(
                                            (item) => (
                                                <Box
                                                    key={
                                                        item.id
                                                    }
                                                    sx={{
                                                        py: 1,
                                                        borderBottom:
                                                            "1px solid",
                                                        borderColor:
                                                            "divider",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {
                                                            item.medicine_name
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {
                                                            item.quantity
                                                        }{" "}
                                                        {
                                                            item.medicine_unit
                                                        }

                                                        {item.dosage &&
                                                            ` • ${item.dosage}`}

                                                        {item.instructions &&
                                                            ` • ${item.instructions}`}
                                                    </Typography>
                                                </Box>
                                            )
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        )}
                    </Box>
                )}

                <Divider sx={{ mb: 3 }} />

                {/* ========================= */}
                {/* FORM RESEP BARU */}
                {/* ========================= */}

                <Typography
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                    }}
                >
                    Buat Resep Baru
                </Typography>

                {items.map((item, index) => (
                    <Card
                        key={index}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    >
                        <CardContent>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                    {
                                        xs: "1fr",
                                        md: "2fr 1fr",
                                    },
                                    gap: 2,
                                }}
                            >
                                <Select
                                    fullWidth
                                    displayEmpty
                                    value={
                                        item.medicine_id
                                    }
                                    disabled={
                                        disabled ||
                                        loading
                                    }
                                    onChange={(event) =>
                                        updateItem(
                                            index,
                                            "medicine_id",
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                >
                                    <MenuItem value="">
                                        Pilih Obat
                                    </MenuItem>

                                    {activeMedicines.map(
                                        (medicine) => (
                                            <MenuItem
                                                key={
                                                    medicine.id
                                                }
                                                value={
                                                    medicine.id
                                                }
                                                disabled={
                                                    medicine.stock <=
                                                    0
                                                }
                                            >
                                                {
                                                    medicine.name
                                                }{" "}
                                                - Stok:{" "}
                                                {
                                                    medicine.stock
                                                }{" "}
                                                {
                                                    medicine.unit
                                                }
                                            </MenuItem>
                                        )
                                    )}
                                </Select>

                                <TextField
                                    label="Jumlah"
                                    type="number"
                                    value={
                                        item.quantity
                                    }
                                    disabled={
                                        disabled ||
                                        loading
                                    }
                                    slotProps={{
                                        htmlInput: {
                                            min: 1,
                                        },
                                    }}
                                    onChange={(event) =>
                                        updateItem(
                                            index,
                                            "quantity",
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                />
                            </Box>

                            <TextField
                                fullWidth
                                label="Dosis"
                                value={
                                    item.dosage
                                }
                                disabled={
                                    disabled ||
                                    loading
                                }
                                onChange={(event) =>
                                    updateItem(
                                        index,
                                        "dosage",
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Contoh: 3 x 1 tablet"
                                sx={{ mt: 2 }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                label="Aturan Pakai / Instruksi"
                                value={
                                    item.instructions
                                }
                                disabled={
                                    disabled ||
                                    loading
                                }
                                onChange={(event) =>
                                    updateItem(
                                        index,
                                        "instructions",
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Contoh: Sesudah makan"
                                sx={{ mt: 2 }}
                            />

                            {items.length > 1 && (
                                <Box
                                    sx={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "flex-end",
                                        mt: 1,
                                    }}
                                >
                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            removeItem(
                                                index
                                            )
                                        }
                                        disabled={
                                            disabled ||
                                            loading
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={addItem}
                        disabled={
                            disabled ||
                            loading
                        }
                    >
                        Tambah Obat
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={
                            <MedicationIcon />
                        }
                        onClick={
                            handleCreate
                        }
                        disabled={
                            disabled ||
                            loading
                        }
                    >
                        {loading
                            ? "Menyimpan..."
                            : "Simpan Resep"}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}