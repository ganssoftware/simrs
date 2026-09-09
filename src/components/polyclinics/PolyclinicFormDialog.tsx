import {
    useEffect,
    useState,
} from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    TextField,
} from "@mui/material";

import type {
    Polyclinic,
    CreatePolyclinicRequest,
} from "../../types/polyclinic";

interface PolyclinicFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (
        data: CreatePolyclinicRequest
    ) => Promise<void>;
    editingPolyclinic: Polyclinic | null;
    loading: boolean;
}

export default function PolyclinicFormDialog({
    open,
    onClose,
    onSubmit,
    editingPolyclinic,
    loading,
}: PolyclinicFormDialogProps) {
    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [isActive, setIsActive] =
        useState(true);

    const [formError, setFormError] =
        useState("");

    useEffect(() => {
        if (!open) {
            return;
        }

        if (editingPolyclinic) {
            setName(
                editingPolyclinic.name
            );

            setDescription(
                editingPolyclinic.description ||
                    ""
            );

            setIsActive(
                editingPolyclinic.is_active
            );
        } else {
            setName("");
            setDescription("");
            setIsActive(true);
        }

        setFormError("");
    }, [
        open,
        editingPolyclinic,
    ]);

    const handleSubmit = async () => {
        const trimmedName =
            name.trim();

        if (!trimmedName) {
            setFormError(
                "Nama poliklinik wajib diisi."
            );

            return;
        }

        setFormError("");

        await onSubmit({
            name: trimmedName,
            description:
                description.trim() ||
                undefined,
            is_active: isActive,
        });
    };

    return (
        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                }}
            >
                {editingPolyclinic
                    ? "Edit Poliklinik"
                    : "Tambah Poliklinik"}
            </DialogTitle>

            <DialogContent>
                <TextField
                    fullWidth
                    label="Nama Poliklinik"
                    value={name}
                    onChange={(event) =>
                        setName(
                            event.target.value
                        )
                    }
                    margin="normal"
                    required
                    autoFocus
                    error={Boolean(
                        formError
                    )}
                    helperText={
                        formError
                    }
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    label="Deskripsi"
                    value={description}
                    onChange={(event) =>
                        setDescription(
                            event.target.value
                        )
                    }
                    margin="normal"
                    multiline
                    minRows={3}
                    placeholder="Contoh: Pelayanan kesehatan umum untuk pasien dewasa dan anak."
                    disabled={loading}
                />

                <FormControlLabel
                    control={
                        <Switch
                            checked={
                                isActive
                            }
                            onChange={(
                                event
                            ) =>
                                setIsActive(
                                    event
                                        .target
                                        .checked
                                )
                            }
                            disabled={
                                loading
                            }
                        />
                    }
                    label="Poliklinik aktif"
                    sx={{
                        mt: 1,
                    }}
                />
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
                    variant="contained"
                    onClick={
                        handleSubmit
                    }
                    disabled={loading}
                >
                    {loading
                        ? "Menyimpan..."
                        : "Simpan"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}