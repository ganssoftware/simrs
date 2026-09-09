import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

interface DeletePatientDialogProps {
    open: boolean;
    patientName: string;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export default function DeletePatientDialog({
    open,
    patientName,
    onClose,
    onConfirm,
    loading = false,
}: DeletePatientDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                Hapus Pasien
            </DialogTitle>

            <DialogContent>
                <Typography>
                    Apakah Anda yakin ingin
                    menghapus data pasien{" "}
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
                    Data yang sudah digunakan
                    dalam registrasi mungkin tidak
                    dapat dihapus.
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
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading
                        ? "Menghapus..."
                        : "Hapus"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}