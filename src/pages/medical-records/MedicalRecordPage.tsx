import {
    useEffect,
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
    CircularProgress,
    Divider,
    InputAdornment,
    MenuItem,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";

import {
    fetchRegistrations,
} from "../../services/registrationService";

import {
    fetchMedicalRecords,
    fetchMedicalRecordByRegistration,
    createMedicalRecord,
    updateMedicalRecord,
    finishMedicalRecord,
} from "../../services/medicalRecordService";

import {
    fetchPrescriptionsByMedicalRecord,
    createPrescription,
} from "../../services/prescriptionService";

import {
    fetchMedicines,
} from "../../services/medicineService";

import type {
    Registration,
    RegistrationStatus,
} from "../../types/registration";

import type {
    MedicalRecord,
    CreateMedicalRecordRequest,
    UpdateMedicalRecordRequest,
} from "../../types/medicalRecord";

import type {
    Prescription,
    CreatePrescriptionRequest,
} from "../../types/prescription";

import type {
    Medicine,
} from "../../types/medicine";

import MedicalRecordForm from "../../components/medical-records/MedicalRecordForm";

import { useAuthStore } from "../../stores/authStore";

export default function MedicalRecordPage() {
    const user = useAuthStore(
        (state) => state.user
    );

    const [registrations, setRegistrations] =
        useState<Registration[]>([]);

    const [_, setMedicalRecords] =
        useState<MedicalRecord[]>([]);

    const [selectedRegistration, setSelectedRegistration] =
        useState<Registration | null>(null);

    const [selectedMedicalRecord, setSelectedMedicalRecord] =
        useState<MedicalRecord | null>(null);

    const [prescriptions, setPrescriptions] =
        useState<Prescription[]>([]);

    const [medicines, setMedicines] =
        useState<Medicine[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<
            RegistrationStatus | "semua"
        >("diperiksa");

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success" as
                | "success"
                | "error",
        });

    const canManage =
        user?.role === "dokter" ||
        user?.role === "admin";

    const showSnackbar = (
        message: string,
        severity:
            | "success"
            | "error"
    ) => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                registrationData,
                medicalRecordData,
            ] = await Promise.all([
                fetchRegistrations(),
                fetchMedicalRecords(),
            ]);

            setRegistrations(
                registrationData
            );

            setMedicalRecords(
                medicalRecordData
            );
        } catch (err: any) {
            setError(
                err?.response?.data
                    ?.message ||
                "Gagal mengambil data rekam medis."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const loadMedicines = async () => {
            try {
                const data = await fetchMedicines();

                setMedicines(data);
            } catch (err) {
                console.error(
                    "Gagal mengambil data obat:",
                    err
                );
            }
        };

        loadMedicines();
    }, []);

    const loadPrescriptions = async (
        medicalRecordId: number
    ) => {
        try {
            const data =
                await fetchPrescriptionsByMedicalRecord(
                    medicalRecordId
                );

            setPrescriptions(data);
        } catch (err: any) {
            console.error(
                "Gagal mengambil data resep:",
                err
            );

            showSnackbar(
                err?.response?.data?.message ||
                "Gagal mengambil data resep.",
                "error"
            );
        }
    };

    const filteredRegistrations =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            return registrations.filter(
                (registration) => {
                    const matchesSearch =
                        !keyword ||
                        registration.patient_name
                            .toLowerCase()
                            .includes(
                                keyword
                            ) ||
                        registration.medical_record_number
                            .toLowerCase()
                            .includes(
                                keyword
                            ) ||
                        registration.registration_number
                            .toLowerCase()
                            .includes(
                                keyword
                            ) ||
                        registration.doctor_name
                            .toLowerCase()
                            .includes(
                                keyword
                            );

                    const matchesStatus =
                        statusFilter ===
                        "semua" ||
                        registration.status ===
                        statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            registrations,
            search,
            statusFilter,
        ]);

    const displayedRegistrations =
        filteredRegistrations.slice(
            page * rowsPerPage,
            page * rowsPerPage +
            rowsPerPage
        );

    const examiningCount =
        registrations.filter(
            (item) =>
                item.status ===
                "diperiksa"
        ).length;

    const completedCount =
        registrations.filter(
            (item) =>
                item.status ===
                "selesai"
        ).length;

    const handleOpenMedicalRecord =
        async (
            registration: Registration
        ) => {
            try {
                setActionLoading(true);

                setSelectedRegistration(
                    registration
                );

                const existing =
                    await fetchMedicalRecordByRegistration(
                        registration.id
                    );

                setSelectedMedicalRecord(
                    existing
                );

                setPrescriptions([]);

                if (existing) {
                    await loadPrescriptions(
                        existing.id
                    );
                }
            } catch (err: any) {
                showSnackbar(
                    err?.response?.data
                        ?.message ||
                    "Gagal mengambil rekam medis.",
                    "error"
                );
            } finally {
                setActionLoading(false);
            }
        };

    const handleCreate = async (
        data: CreateMedicalRecordRequest
    ) => {
        try {
            setActionLoading(true);

            const result =
                await createMedicalRecord(
                    data
                );

            setSelectedMedicalRecord(
                result
            );

            setPrescriptions([]);

            showSnackbar(
                "Rekam medis berhasil disimpan.",
                "success"
            );

            await loadData();
        } catch (err: any) {
            showSnackbar(
                err?.response?.data
                    ?.message ||
                "Gagal menyimpan rekam medis.",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async (
        data: UpdateMedicalRecordRequest
    ) => {
        if (
            !selectedMedicalRecord
        ) {
            return;
        }

        try {
            setActionLoading(true);

            const result =
                await updateMedicalRecord(
                    selectedMedicalRecord.id,
                    data
                );

            setSelectedMedicalRecord(
                result
            );

            showSnackbar(
                "Rekam medis berhasil diperbarui.",
                "success"
            );

            await loadData();
        } catch (err: any) {
            showSnackbar(
                err?.response?.data
                    ?.message ||
                "Gagal memperbarui rekam medis.",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreatePrescription = async (
        data: CreatePrescriptionRequest
    ) => {
        try {
            setActionLoading(true);

            await createPrescription(data);

            if (selectedMedicalRecord) {
                await loadPrescriptions(
                    selectedMedicalRecord.id
                );
            }

            showSnackbar(
                "Resep berhasil dibuat.",
                "success"
            );
        } catch (err: any) {
            showSnackbar(
                err?.response?.data?.message ||
                "Gagal membuat resep.",
                "error"
            );

            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const handleFinish = async () => {
        if (
            !selectedMedicalRecord
        ) {
            return;
        }

        try {
            setActionLoading(true);

            await finishMedicalRecord(
                selectedMedicalRecord.id
            );

            showSnackbar(
                "Rekam medis selesai dan kunjungan ditutup.",
                "success"
            );

            setSelectedRegistration(
                null
            );

            setSelectedMedicalRecord(
                null
            );

            await loadData();
        } catch (err: any) {
            showSnackbar(
                err?.response?.data
                    ?.message ||
                "Gagal menyelesaikan rekam medis.",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleChangePage = (
        _event: unknown,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<
            HTMLTextAreaElement | HTMLInputElement
        >
    ) => {
        setRowsPerPage(
            parseInt(
                event.target.value,
                10
            )
        );

        setPage(0);
    };

    if (
        selectedRegistration
    ) {
        return (
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            Rekam Medis
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Pemeriksaan pasien
                        </Typography>
                    </Box>
                </Box>

                <Card
                    sx={{
                        mb: 3,
                    }}
                >
                    <CardContent>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(4, 1fr)",
                                },
                                gap: 3,
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Pasien
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    {
                                        selectedRegistration.patient_name
                                    }
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    No. Rekam Medis
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    {
                                        selectedRegistration.medical_record_number
                                    }
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
                                        fontWeight: 700,
                                    }}
                                >
                                    {
                                        selectedRegistration.polyclinic_name
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
                                        fontWeight: 700,
                                    }}
                                >
                                    {
                                        selectedRegistration.doctor_name
                                    }
                                </Typography>
                            </Box>
                        </Box>

                        <Divider
                            sx={{
                                my: 2,
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                flexWrap:
                                    "wrap",
                            }}
                        >
                            <Chip
                                label={`Antrian ${selectedRegistration.queue_number ?? "-"}`}
                            />

                            <Chip
                                label={
                                    selectedRegistration.visit_type ===
                                        "baru"
                                        ? "Kunjungan Baru"
                                        : "Kunjungan Lama"
                                }
                            />

                            <Chip
                                label={
                                    selectedRegistration.status
                                }
                                color="primary"
                            />
                        </Box>

                        {selectedRegistration.complaint && (
                            <Alert
                                severity="info"
                                sx={{
                                    mt: 2,
                                }}
                            >
                                <strong>
                                    Keluhan:
                                </strong>{" "}
                                {
                                    selectedRegistration.complaint
                                }
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                <MedicalRecordForm
                    registrationId={
                        selectedRegistration.id
                    }
                    medicalRecord={
                        selectedMedicalRecord
                    }
                    loading={
                        actionLoading
                    }
                    prescriptions={
                        prescriptions
                    }
                    medicines={
                        medicines
                    }
                    onCreate={
                        handleCreate
                    }
                    onUpdate={
                        handleUpdate
                    }
                    onFinish={
                        handleFinish
                    }
                    onCreatePrescription={
                        handleCreatePrescription
                    }
                />

                <Snackbar
                    open={
                        snackbar.open
                    }
                    autoHideDuration={
                        3500
                    }
                    onClose={() =>
                        setSnackbar(
                            (prev) => ({
                                ...prev,
                                open: false,
                            })
                        )
                    }
                    message={
                        snackbar.message
                    }
                />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Rekam Medis
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Kelola pemeriksaan dan
                        rekam medis pasien
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        <RefreshIcon />
                    }
                    onClick={
                        loadData
                    }
                    disabled={
                        loading ||
                        actionLoading
                    }
                >
                    Refresh
                </Button>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            {/* Statistik */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Card>
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Sedang Diperiksa
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mt: 1,
                            }}
                        >
                            {examiningCount}
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Kunjungan Selesai
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mt: 1,
                            }}
                        >
                            {completedCount}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Card>
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap:
                                "wrap",
                            mb: 2,
                        }}
                    >
                        <TextField
                            size="small"
                            placeholder="Cari pasien, No. RM, dokter..."
                            value={search}
                            onChange={(event) => {
                                setSearch(
                                    event.target
                                        .value
                                );

                                setPage(0);
                            }}
                            sx={{
                                width: {
                                    xs: "100%",
                                    md: 380,
                                },
                            }}
                            slotProps={{
                                input: {
                                    startAdornment:
                                        (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                },
                            }}
                        />

                        <TextField
                            select
                            size="small"
                            label="Status"
                            value={
                                statusFilter
                            }
                            onChange={(
                                event
                            ) => {
                                setStatusFilter(
                                    event.target
                                        .value as
                                    | RegistrationStatus
                                    | "semua"
                                );

                                setPage(0);
                            }}
                            sx={{
                                width: 180,
                            }}
                        >
                            <MenuItem value="semua">
                                Semua
                            </MenuItem>

                            <MenuItem value="diperiksa">
                                Diperiksa
                            </MenuItem>

                            <MenuItem value="selesai">
                                Selesai
                            </MenuItem>
                        </TextField>
                    </Box>

                    <Divider
                        sx={{
                            mb: 2,
                        }}
                    />

                    {loading ? (
                        <Box
                            sx={{
                                display:
                                    "flex",
                                justifyContent:
                                    "center",
                                py: 8,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Antrian
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Pasien
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Poliklinik
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Dokter
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Status
                                            </TableCell>

                                            <TableCell align="center" sx={{ fontWeight: 700 }}>
                                                Aksi
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {displayedRegistrations.length ===
                                            0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={
                                                        6
                                                    }
                                                    align="center"
                                                >
                                                    <Typography
                                                        color="text.secondary"
                                                        sx={{
                                                            py: 4,
                                                        }}
                                                    >
                                                        Tidak
                                                        ada
                                                        pasien
                                                        yang
                                                        sesuai.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            displayedRegistrations.map(
                                                (
                                                    registration
                                                ) => (
                                                    <TableRow
                                                        key={
                                                            registration.id
                                                        }
                                                        hover
                                                    >
                                                        <TableCell>
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                {registration.queue_number ??
                                                                    "-"}
                                                            </Typography>

                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {
                                                                    registration.registration_number
                                                                }
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {
                                                                    registration.patient_name
                                                                }
                                                            </Typography>

                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                {
                                                                    registration.medical_record_number
                                                                }
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            {
                                                                registration.polyclinic_name
                                                            }
                                                        </TableCell>

                                                        <TableCell>
                                                            {
                                                                registration.doctor_name
                                                            }
                                                        </TableCell>

                                                        <TableCell>
                                                            <Chip
                                                                size="small"
                                                                label={
                                                                    registration.status ===
                                                                        "diperiksa"
                                                                        ? "Sedang Diperiksa"
                                                                        : "Selesai"
                                                                }
                                                                color={
                                                                    registration.status ===
                                                                        "diperiksa"
                                                                        ? "primary"
                                                                        : "success"
                                                                }
                                                            />
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={
                                                                    <MedicalInformationIcon />
                                                                }
                                                                disabled={
                                                                    actionLoading ||
                                                                    !canManage
                                                                }
                                                                onClick={() =>
                                                                    handleOpenMedicalRecord(
                                                                        registration
                                                                    )
                                                                }
                                                            >
                                                                {registration.status ===
                                                                    "selesai"
                                                                    ? "Lihat"
                                                                    : "Periksa"}
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                component="div"
                                count={
                                    filteredRegistrations.length
                                }
                                page={page}
                                onPageChange={
                                    handleChangePage
                                }
                                rowsPerPage={
                                    rowsPerPage
                                }
                                onRowsPerPageChange={
                                    handleChangeRowsPerPage
                                }
                                rowsPerPageOptions={[
                                    5,
                                    10,
                                    25,
                                    50,
                                ]}
                                labelRowsPerPage="Baris per halaman"
                            />
                        </>
                    )}
                </CardContent>
            </Card>

            <Snackbar
                open={
                    snackbar.open
                }
                autoHideDuration={
                    3500
                }
                onClose={() =>
                    setSnackbar(
                        (prev) => ({
                            ...prev,
                            open: false,
                        })
                    )
                }
                message={
                    snackbar.message
                }
            />
        </Box>
    );
}