import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
} from "@mui/material";

import type { Prescription } from "../../types/prescription";

interface FinishPrescriptionDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    prescription: Prescription | null;
    loading?: boolean;
}

export default function FinishPrescriptionDialog({
    open,
    onClose,
    onConfirm,
    prescription,
    loading = false,
}: FinishPrescriptionDialogProps) {
    if (!prescription) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Selesaikan Resep
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "grey.100"
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Pasien
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 700
                        }}
                    >
                        {prescription.patient_name}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 1
                        }}
                    >
                        Nomor Resep
                    </Typography>

                    <Typography>
                        #{prescription.id}
                    </Typography>
                </Box>

                <Alert severity="info">
                    Pastikan seluruh obat sudah disiapkan
                    dan diserahkan kepada pasien sebelum
                    menyelesaikan resep.
                </Alert>

                <Typography
                    sx={{
                        mt: 2
                    }}
                    color="text.secondary"
                >
                    Setelah diselesaikan, resep akan
                    memiliki status <strong>Selesai</strong>.
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Batal
                </Button>

                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="success"
                    disabled={loading}
                >
                    {loading
                        ? "Menyelesaikan..."
                        : "Selesaikan Resep"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}