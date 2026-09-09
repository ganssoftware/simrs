import type { ReactNode } from "react";

import {
    Box,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import type { Patient } from "../../types/patient";

interface PatientDetailDialogProps {
    open: boolean;
    patient: Patient | null;
    onClose: () => void;
}

interface DetailItemProps {
    label: string;
    value: ReactNode;
}

function DetailItem({
    label,
    value,
}: DetailItemProps) {
    return (
        <Box>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    display: "block",
                    mb: 0.5,
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    fontWeight: 500,
                }}
            >
                {value || "-"}
            </Typography>
        </Box>
    );
}

export default function PatientDetailDialog({
    open,
    patient,
    onClose,
}: PatientDetailDialogProps) {
    if (!patient) {
        return null;
    }

    const formatDate = (
        date: string | null
    ) => {
        if (!date) {
            return "-";
        }

        return new Intl.DateTimeFormat(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        ).format(new Date(date));
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Detail Pasien
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Informasi lengkap pasien
                    </Typography>
                </Box>

                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {/* Identitas */}
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 700,
                        mb:2,
                    }}
                >
                    Identitas Pasien
                </Typography>

                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <DetailItem
                            label="Nomor Rekam Medis"
                            value={
                                patient.medical_record_number
                            }
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <DetailItem
                            label="NIK"
                            value={patient.nik}
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <DetailItem
                            label="Nama Lengkap"
                            value={
                                patient.full_name
                            }
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <Box>
                            <DetailItem
                                label="Jenis Kelamin"
                                value={
                                    <Chip
                                        label={patient.gender}
                                        size="small"
                                    />
                                }
                            />
                        </Box>
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <DetailItem
                            label="Tempat Lahir"
                            value={
                                patient.birth_place
                            }
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <DetailItem
                            label="Tanggal Lahir"
                            value={formatDate(
                                patient.birth_date
                            )}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Kontak */}
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight:700,
                        mb:2,
                    }}
                >
                    Informasi Kontak
                </Typography>

                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        size={{
                            xs: 12,
                        }}
                    >
                        <DetailItem
                            label="Alamat"
                            value={
                                patient.address
                            }
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <DetailItem
                            label="Nomor Telepon"
                            value={
                                patient.phone
                            }
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Data tambahan */}
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 700,
                        mb:2,
                    }}
                >
                    Informasi Tambahan
                </Typography>

                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        size={{
                            xs: 12,
                            sm: 4,
                        }}
                    >
                        <DetailItem
                            label="Golongan Darah"
                            value={
                                patient.blood_type
                            }
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            sm: 4,
                        }}
                    >
                        <DetailItem
                            label="Status Pernikahan"
                            value={
                                patient.marital_status
                            }
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            sm: 4,
                        }}
                    >
                        <DetailItem
                            label="Pekerjaan"
                            value={
                                patient.occupation
                            }
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}