import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

import type {
    Prescription,
    PrescriptionStatus,
} from "../../types/prescription";

interface PrescriptionDetailDialogProps {
    open: boolean;
    onClose: () => void;
    prescription: Prescription | null;
}

const getStatusLabel = (
    status: PrescriptionStatus
) => {
    switch (status) {
        case "menunggu":
            return "Menunggu";

        case "diproses":
            return "Diproses";

        case "selesai":
            return "Selesai";

        case "batal":
            return "Batal";

        default:
            return status;
    }
};

const getStatusColor = (
    status: PrescriptionStatus
):
    | "warning"
    | "info"
    | "success"
    | "error"
    | "default" => {
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

const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }
    );
};

const formatDateTime = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
        "id-ID",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
};

export default function PrescriptionDetailDialog({
    open,
    onClose,
    prescription,
}: PrescriptionDetailDialogProps) {
    if (!prescription) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Detail Resep
            </DialogTitle>

            <DialogContent dividers>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700
                            }}
                        >
                            Resep #{prescription.id}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {prescription.registration_number}
                        </Typography>
                    </Box>

                    <Chip
                        label={getStatusLabel(
                            prescription.status
                        )}
                        color={getStatusColor(
                            prescription.status
                        )}
                    />
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "1fr 1fr",
                        },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Nama Pasien
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 600
                            }}
                        >
                            {prescription.patient_name}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Nomor Rekam Medis
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 600
                            }}
                        >
                            {
                                prescription.medical_record_number
                            }
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Dokter
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 600
                            }}
                        >
                            {prescription.doctor_name}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Poliklinik
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 600
                            }}
                        >
                            {
                                prescription.polyclinic_name
                            }
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Tanggal Kunjungan
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 600
                            }}
                        >
                            {formatDate(
                                prescription.visit_date
                            )}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Dibuat
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 600
                            }}
                        >
                            {formatDateTime(
                                prescription.created_at
                            )}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 2
                    }}
                >
                    Daftar Obat
                </Typography>

                {prescription.items.length === 0 ? (
                    <Box
                        sx={{
                            py: 4,
                            textAlign: "center"
                        }}
                    >
                        <Typography color="text.secondary">
                            Tidak ada obat pada resep ini.
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer
                        component={Paper}
                        variant="outlined"
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>
                                        No
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Obat
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Jumlah
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Dosis
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Aturan Pakai
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {prescription.items.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <TableRow
                                            key={
                                                item.id
                                            }
                                        >
                                            <TableCell>
                                                {index +
                                                    1}
                                            </TableCell>

                                            <TableCell>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {
                                                        item.medicine_name
                                                    }
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {
                                                        item.medicine_code
                                                    }
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                {item.quantity}{" "}
                                                {
                                                    item.medicine_unit
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    item.dosage
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    item.instructions
                                                }
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    variant="contained"
                >
                    Tutup
                </Button>
            </DialogActions>
        </Dialog>
    );
}