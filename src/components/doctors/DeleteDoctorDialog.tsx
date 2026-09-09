import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

interface DeleteDoctorDialogProps {
    open: boolean;
    doctorName: string;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export default function DeleteDoctorDialog({
    open,
    doctorName,
    onClose,
    onConfirm,
    loading = false,
}: DeleteDoctorDialogProps) {
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
                Hapus Dokter
            </DialogTitle>

            <DialogContent>
                <Typography>
                    Apakah Anda yakin ingin
                    menghapus dokter{" "}
                    <strong>
                        {doctorName}
                    </strong>
                    ?
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    Dokter yang masih digunakan
                    dalam data registrasi tidak
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