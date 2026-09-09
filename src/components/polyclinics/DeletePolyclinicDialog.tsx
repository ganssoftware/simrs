import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

interface DeletePolyclinicDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    polyclinicName: string;
    loading: boolean;
}

export default function DeletePolyclinicDialog({
    open,
    onClose,
    onConfirm,
    polyclinicName,
    loading,
}: DeletePolyclinicDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                }}
            >
                Hapus Poliklinik
            </DialogTitle>

            <DialogContent>
                <Typography>
                    Apakah kamu yakin ingin
                    menghapus poliklinik{" "}
                    <strong>
                        {polyclinicName}
                    </strong>
                    ?
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 1.5,
                    }}
                >
                    Data poliklinik yang masih
                    digunakan oleh dokter atau
                    registrasi mungkin tidak
                    dapat dihapus.
                </Typography>
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