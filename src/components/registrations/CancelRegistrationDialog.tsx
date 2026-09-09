import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

interface CancelRegistrationDialogProps {
    open: boolean;
    registrationNumber: string;
    patientName: string;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export default function CancelRegistrationDialog({
    open,
    registrationNumber,
    patientName,
    onClose,
    onConfirm,
    loading = false,
}: CancelRegistrationDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                Batalkan Registrasi
            </DialogTitle>

            <DialogContent>
                <Typography>
                    Batalkan registrasi{" "}
                    <strong>
                        {registrationNumber}
                    </strong>{" "}
                    untuk pasien{" "}
                    <strong>
                        {patientName}
                    </strong>
                    ?
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    Tindakan ini tidak dapat
                    mengembalikan status registrasi
                    menjadi menunggu.
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Tidak
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading
                        ? "Memproses..."
                        : "Ya, Batalkan"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}