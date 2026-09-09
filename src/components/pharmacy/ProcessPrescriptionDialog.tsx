import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

import type { Prescription } from "../../types/prescription";

interface ProcessPrescriptionDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    prescription: Prescription | null;
    loading?: boolean;
}

export default function ProcessPrescriptionDialog({
    open,
    onClose,
    onConfirm,
    prescription,
    loading = false,
}: ProcessPrescriptionDialogProps) {
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
                Proses Resep
            </DialogTitle>

            <DialogContent>
                <Typography
                    sx={{
                        mb: 2
                    }}
                >
                    Apakah Anda yakin ingin memproses
                    resep ini?
                </Typography>

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
                        No. Rekam Medis
                    </Typography>

                    <Typography>
                        {
                            prescription.medical_record_number
                        }
                    </Typography>
                </Box>

                <Alert
                    severity="warning"
                    sx={{ mb: 2 }}
                >
                    Saat resep diproses, stok setiap obat
                    akan dikurangi sesuai jumlah yang
                    diresepkan.
                </Alert>

                <Typography
                    sx={{
                        fontWeight: 700,
                        mb: 1
                    }}
                >
                    Obat yang akan diproses:
                </Typography>

                <List dense>
                    {prescription.items.map(
                        (item) => (
                            <ListItem
                                key={item.id}
                                disableGutters
                            >
                                <ListItemText
                                    primary={
                                        item.medicine_name
                                    }
                                    secondary={`${item.quantity} ${item.medicine_unit}${item.dosage
                                        ? ` • ${item.dosage}`
                                        : ""
                                        }`}
                                />
                            </ListItem>
                        )
                    )}
                </List>
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
                    color="primary"
                    disabled={loading}
                >
                    {loading
                        ? "Memproses..."
                        : "Proses Resep"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}