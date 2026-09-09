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
    IconButton,
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
    Tooltip,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PhoneIcon from "@mui/icons-material/Phone";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
    fetchRegistrations,
    createRegistration,
    callRegistration,
    callNextRegistration,
    startRegistration,
    cancelRegistration,
} from "../../services/registrationService";

import {
    fetchPatients,
} from "../../services/patientService";

import {
    fetchDoctors,
} from "../../services/doctorService";

import {
    fetchPolyclinics,
} from "../../services/polyclinicService";

import type {
    Registration,
    CreateRegistrationRequest,
    RegistrationStatus,
} from "../../types/registration";

import type {
    Patient,
} from "../../types/patient";

import type {
    Doctor,
} from "../../types/doctor";

import type {
    Polyclinic,
} from "../../types/polyclinic";

import RegistrationFormDialog from "../../components/registrations/RegistrationFormDialog";

import CancelRegistrationDialog from "../../components/registrations/CancelRegistrationDialog";

import { useAuthStore } from "../../stores/authStore";

export default function RegistrationPage() {
    const user = useAuthStore(
        (state) => state.user
    );

    const [registrations, setRegistrations] =
        useState<Registration[]>([]);

    const [patients, setPatients] =
        useState<Patient[]>([]);

    const [doctors, setDoctors] =
        useState<Doctor[]>([]);

    const [polyclinics, setPolyclinics] =
        useState<Polyclinic[]>([]);

    const [selectedQueuePolyclinicId, setSelectedQueuePolyclinicId] =
        useState<number | "">("");

    const [selectedQueueDoctorId, setSelectedQueueDoctorId] =
        useState<number | "">("");

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
        >("semua");

    const [page, setPage] =
        useState(0);

    const [
        rowsPerPage,
        setRowsPerPage,
    ] = useState(10);

    const [formOpen, setFormOpen] =
        useState(false);

    const [
        cancelOpen,
        setCancelOpen,
    ] = useState(false);

    const [
        selectedRegistration,
        setSelectedRegistration,
    ] = useState<Registration | null>(
        null
    );

    const [
        snackbar,
        setSnackbar,
    ] = useState({
        open: false,
        message: "",
        severity: "success" as
            | "success"
            | "error",
    });

    const canRegister =
        user?.role === "admin" ||
        user?.role === "petugas";

    const canCall =
        user?.role === "admin" ||
        user?.role === "petugas" ||
        user?.role === "perawat";

    const canStart =
        user?.role === "admin" ||
        user?.role === "dokter";

    const canCancel =
        user?.role === "admin" ||
        user?.role === "petugas" ||
        user?.role === "perawat";

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                registrationData,
                patientData,
                doctorData,
                polyclinicData,
            ] = await Promise.all([
                fetchRegistrations(),
                fetchPatients(),
                fetchDoctors(),
                fetchPolyclinics(),
            ]);

            setRegistrations(
                registrationData
            );

            setPatients(
                patientData
            );

            setDoctors(
                doctorData
            );

            setPolyclinics(
                polyclinicData
            );
        } catch (err: any) {
            setError(
                err?.response?.data
                    ?.message ||
                "Gagal mengambil data registrasi."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

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
                        registration.registration_number
                            .toLowerCase()
                            .includes(
                                keyword
                            ) ||
                        registration.medical_record_number
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

    const queueDoctors = useMemo(() => {
        if (selectedQueuePolyclinicId === "") {
            return [];
        }

        return doctors.filter(
            (doctor) =>
                doctor.polyclinic_id ===
                selectedQueuePolyclinicId
        );
    }, [
        doctors,
        selectedQueuePolyclinicId,
    ]);

    const currentCalledRegistration =
        useMemo(() => {
            if (
                selectedQueuePolyclinicId === "" ||
                selectedQueueDoctorId === ""
            ) {
                return null;
            }

            return (
                registrations.find(
                    (registration) =>
                        registration.polyclinic_id ===
                        selectedQueuePolyclinicId &&
                        registration.doctor_id ===
                        selectedQueueDoctorId &&
                        registration.status ===
                        "dipanggil"
                ) || null
            );
        }, [
            registrations,
            selectedQueuePolyclinicId,
            selectedQueueDoctorId,
        ]);

    const waitingQueueCount = useMemo(() => {
        if (
            selectedQueuePolyclinicId === "" ||
            selectedQueueDoctorId === ""
        ) {
            return 0;
        }

        return registrations.filter(
            (registration) =>
                registration.polyclinic_id ===
                selectedQueuePolyclinicId &&
                registration.doctor_id ===
                selectedQueueDoctorId &&
                registration.status ===
                "menunggu"
        ).length;
    }, [
        registrations,
        selectedQueuePolyclinicId,
        selectedQueueDoctorId,
    ]);

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

    const handleCreate = async (
        data: CreateRegistrationRequest
    ) => {
        try {
            setActionLoading(true);

            const result =
                await createRegistration(
                    data
                );

            setFormOpen(false);

            showSnackbar(
                `Registrasi berhasil. Nomor antrian: ${result.queue_number}`,
                "success"
            );

            await loadData();
        } finally {
            setActionLoading(false);
        }
    };

    const handleCall = async (
        registration: Registration
    ) => {
        try {
            setActionLoading(true);

            await callRegistration(
                registration.id
            );

            showSnackbar(
                `Pasien ${registration.patient_name} berhasil dipanggil.`,
                "success"
            );

            await loadData();
        } catch (err: any) {
            showSnackbar(
                err?.response?.data
                    ?.message ||
                "Gagal memanggil pasien.",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleQueuePolyclinicChange = (
        polyclinicId: number | ""
    ) => {
        setSelectedQueuePolyclinicId(
            polyclinicId
        );

        setSelectedQueueDoctorId("");
    };

    const handleQueueDoctorChange = (
        doctorId: number | ""
    ) => {
        setSelectedQueueDoctorId(
            doctorId
        );
    };

    const handleCallNext = async () => {
        if (
            selectedQueuePolyclinicId === "" ||
            selectedQueueDoctorId === ""
        ) {
            showSnackbar(
                "Pilih poliklinik dan dokter terlebih dahulu.",
                "error"
            );

            return;
        }

        try {
            setActionLoading(true);

            const result =
                await callNextRegistration(
                    selectedQueuePolyclinicId,
                    selectedQueueDoctorId
                );

            showSnackbar(
                `Antrian ${result.queue_number} - ${result.patient_name} dipanggil.`,
                "success"
            );

            await loadData();
        } catch (err: any) {
            showSnackbar(
                err?.response?.data?.message ||
                "Gagal memanggil antrian berikutnya.",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleStart = async (
        registration: Registration
    ) => {
        try {
            setActionLoading(true);

            await startRegistration(
                registration.id
            );

            showSnackbar(
                `Pemeriksaan ${registration.patient_name} dimulai.`,
                "success"
            );

            await loadData();
        } catch (err: any) {
            showSnackbar(
                err?.response?.data
                    ?.message ||
                "Gagal memulai pemeriksaan.",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!selectedRegistration) {
            return;
        }

        try {
            setActionLoading(true);

            await cancelRegistration(
                selectedRegistration.id
            );

            showSnackbar(
                "Registrasi berhasil dibatalkan.",
                "success"
            );

            setCancelOpen(false);
            setSelectedRegistration(null);

            await loadData();
        } catch (err: any) {
            showSnackbar(
                err?.response?.data
                    ?.message ||
                "Gagal membatalkan registrasi.",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const openCancelDialog = (
        registration: Registration
    ) => {
        setSelectedRegistration(
            registration
        );

        setCancelOpen(true);
    };

    const getStatusColor = (
        status: RegistrationStatus
    ) => {
        switch (status) {
            case "menunggu":
                return "warning";

            case "dipanggil":
                return "info";

            case "diperiksa":
                return "primary";

            case "selesai":
                return "success";

            case "batal":
                return "error";

            default:
                return "default";
        }
    };

    const getStatusLabel = (
        status: RegistrationStatus
    ) => {
        switch (status) {
            case "menunggu":
                return "Menunggu";

            case "dipanggil":
                return "Dipanggil";

            case "diperiksa":
                return "Diperiksa";

            case "selesai":
                return "Selesai";

            case "batal":
                return "Batal";

            default:
                return status;
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

    const waitingCount =
        registrations.filter(
            (item) =>
                item.status ===
                "menunggu"
        ).length;

    const calledCount =
        registrations.filter(
            (item) =>
                item.status ===
                "dipanggil"
        ).length;

    const examiningCount =
        registrations.filter(
            (item) =>
                item.status ===
                "diperiksa"
        ).length;

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
                            fontWeight: 700
                        }}
                    >
                        Registrasi & Antrian
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Kelola registrasi dan
                        antrian pasien hari ini
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                    }}
                >
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

                    {canRegister && (
                        <Button
                            variant="contained"
                            startIcon={
                                <AddIcon />
                            }
                            onClick={() =>
                                setFormOpen(
                                    true
                                )
                            }
                        >
                            Registrasi
                        </Button>
                    )}
                </Box>
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
                        sm: "repeat(3, 1fr)",
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
                            Menunggu
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mt: 1,
                            }}
                        >
                            {waitingCount}
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Dipanggil
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mt: 1,
                            }}
                        >
                            {calledCount}
                        </Typography>
                    </CardContent>
                </Card>

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
            </Box>

            {/* Panel Panggil Antrian */}
            {canCall && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: {
                                    xs: "flex-start",
                                    md: "center",
                                },
                                flexDirection: {
                                    xs: "column",
                                    md: "row",
                                },
                                gap: 2,
                                mb: 2,
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    Panggil Antrian
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Pilih poliklinik dan dokter
                                    untuk memanggil pasien
                                    berikutnya.
                                </Typography>
                            </Box>

                            {selectedQueueDoctorId !== "" && (
                                <Chip
                                    label={`${waitingQueueCount} pasien menunggu`}
                                    color={
                                        waitingQueueCount > 0
                                            ? "warning"
                                            : "default"
                                    }
                                />
                            )}
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "1fr 1fr auto",
                                },
                                gap: 2,
                                alignItems: "center",
                            }}
                        >
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Poliklinik"
                                value={
                                    selectedQueuePolyclinicId
                                }
                                onChange={(event) => {
                                    const value =
                                        event.target.value;

                                    handleQueuePolyclinicChange(
                                        value === ""
                                            ? ""
                                            : Number(value)
                                    );
                                }}
                            >
                                <MenuItem value="">
                                    Pilih Poliklinik
                                </MenuItem>

                                {polyclinics
                                    .filter(
                                        (polyclinic) =>
                                            polyclinic.is_active
                                    )
                                    .map((polyclinic) => (
                                        <MenuItem
                                            key={
                                                polyclinic.id
                                            }
                                            value={
                                                polyclinic.id
                                            }
                                        >
                                            {polyclinic.name}
                                        </MenuItem>
                                    ))}
                            </TextField>

                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Dokter"
                                value={
                                    selectedQueueDoctorId
                                }
                                disabled={
                                    selectedQueuePolyclinicId ===
                                    ""
                                }
                                onChange={(event) => {
                                    const value =
                                        event.target.value;

                                    handleQueueDoctorChange(
                                        value === ""
                                            ? ""
                                            : Number(value)
                                    );
                                }}
                            >
                                <MenuItem value="">
                                    Pilih Dokter
                                </MenuItem>

                                {queueDoctors
                                    .filter(
                                        (doctor) =>
                                            doctor.is_active
                                    )
                                    .map((doctor) => (
                                        <MenuItem
                                            key={
                                                doctor.id
                                            }
                                            value={
                                                doctor.id
                                            }
                                        >
                                            {doctor.full_name}
                                            {doctor.specialization
                                                ? ` - ${doctor.specialization}`
                                                : ""}
                                        </MenuItem>
                                    ))}
                            </TextField>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={
                                    <PhoneIcon />
                                }
                                onClick={
                                    handleCallNext
                                }
                                disabled={
                                    actionLoading ||
                                    selectedQueuePolyclinicId ===
                                    "" ||
                                    selectedQueueDoctorId ===
                                    "" ||
                                    waitingQueueCount === 0 ||
                                    currentCalledRegistration !==
                                    null
                                }
                                sx={{
                                    minWidth: 220,
                                    height: 40,
                                }}
                            >
                                Panggil Berikutnya
                            </Button>
                        </Box>

                        {/* Pasien yang sedang dipanggil */}
                        {selectedQueueDoctorId !== "" && (
                            <Box sx={{ mt: 2 }}>
                                {currentCalledRegistration ? (
                                    <Alert
                                        severity="info"
                                        action={
                                            canStart &&
                                                currentCalledRegistration.status ===
                                                "dipanggil" ? (
                                                <Button
                                                    color="inherit"
                                                    size="small"
                                                    startIcon={
                                                        <PlayArrowIcon />
                                                    }
                                                    onClick={() =>
                                                        handleStart(
                                                            currentCalledRegistration
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading
                                                    }
                                                >
                                                    Mulai Periksa
                                                </Button>
                                            ) : undefined
                                        }
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Pasien sedang dipanggil
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                        >
                                            Antrian{" "}
                                            <strong>
                                                {
                                                    currentCalledRegistration.queue_number
                                                }
                                            </strong>
                                            {" - "}
                                            {
                                                currentCalledRegistration.patient_name
                                            }
                                        </Typography>
                                    </Alert>
                                ) : (
                                    <Alert
                                        severity={
                                            waitingQueueCount >
                                                0
                                                ? "warning"
                                                : "success"
                                        }
                                    >
                                        {waitingQueueCount >
                                            0
                                            ? "Belum ada pasien yang sedang dipanggil. Silakan panggil pasien berikutnya."
                                            : "Tidak ada pasien yang menunggu untuk dokter ini."}
                                    </Alert>
                                )}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}
            
            {/* Tabel */}
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
                            onChange={(e) => {
                                setSearch(
                                    e.target.value
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
                            onChange={(e) => {
                                setStatusFilter(
                                    e.target
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

                            <MenuItem value="menunggu">
                                Menunggu
                            </MenuItem>

                            <MenuItem value="dipanggil">
                                Dipanggil
                            </MenuItem>

                            <MenuItem value="diperiksa">
                                Diperiksa
                            </MenuItem>

                            <MenuItem value="selesai">
                                Selesai
                            </MenuItem>

                            <MenuItem value="batal">
                                Batal
                            </MenuItem>
                        </TextField>
                    </Box>

                    <Divider
                        sx={{ mb: 2 }}
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
                                                Kunjungan
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
                                                        7
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
                                                        data
                                                        registrasi.
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
                                                                variant="h6"
                                                                sx={{
                                                                    fontWeight: 700
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
                                                                    fontWeight: 600
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
                                                                    registration.visit_type ===
                                                                        "baru"
                                                                        ? "Baru"
                                                                        : "Lama"
                                                                }
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            <Chip
                                                                size="small"
                                                                label={getStatusLabel(
                                                                    registration.status
                                                                )}
                                                                color={getStatusColor(
                                                                    registration.status
                                                                )}
                                                            />
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "center",
                                                                    gap: 0.5,
                                                                }}
                                                            >
                                                                {canCall &&
                                                                    registration.status ===
                                                                    "menunggu" && (
                                                                        <Tooltip title="Panggil">
                                                                            <IconButton
                                                                                size="small"
                                                                                color="info"
                                                                                disabled={
                                                                                    actionLoading
                                                                                }
                                                                                onClick={() =>
                                                                                    handleCall(
                                                                                        registration
                                                                                    )
                                                                                }
                                                                            >
                                                                                <PhoneIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )}

                                                                {canStart &&
                                                                    registration.status ===
                                                                    "dipanggil" && (
                                                                        <Tooltip title="Mulai Pemeriksaan">
                                                                            <IconButton
                                                                                size="small"
                                                                                color="primary"
                                                                                disabled={
                                                                                    actionLoading
                                                                                }
                                                                                onClick={() =>
                                                                                    handleStart(
                                                                                        registration
                                                                                    )
                                                                                }
                                                                            >
                                                                                <PlayArrowIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )}

                                                                {canCancel &&
                                                                    (
                                                                        registration.status ===
                                                                        "menunggu" ||
                                                                        registration.status ===
                                                                        "dipanggil"
                                                                    ) && (
                                                                        <Tooltip title="Batalkan">
                                                                            <IconButton
                                                                                size="small"
                                                                                color="error"
                                                                                disabled={
                                                                                    actionLoading
                                                                                }
                                                                                onClick={() =>
                                                                                    openCancelDialog(
                                                                                        registration
                                                                                    )
                                                                                }
                                                                            >
                                                                                <CancelIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )}
                                                            </Box>
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

            <RegistrationFormDialog
                open={formOpen}
                onClose={() =>
                    setFormOpen(false)
                }
                onSubmit={
                    handleCreate
                }
                patients={
                    patients
                }
                doctors={
                    doctors
                }
                polyclinics={
                    polyclinics
                }
                loading={
                    actionLoading
                }
            />

            <CancelRegistrationDialog
                open={cancelOpen}
                registrationNumber={
                    selectedRegistration
                        ?.registration_number ||
                    ""
                }
                patientName={
                    selectedRegistration
                        ?.patient_name ||
                    ""
                }
                onClose={() => {
                    setCancelOpen(
                        false
                    );
                    setSelectedRegistration(
                        null
                    );
                }}
                onConfirm={
                    handleCancel
                }
                loading={
                    actionLoading
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