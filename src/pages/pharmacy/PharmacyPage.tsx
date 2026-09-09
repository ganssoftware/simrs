import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
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

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MedicationIcon from "@mui/icons-material/Medication";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import { useAuthStore } from "../../stores/authStore";

import type {
    Prescription,
    PrescriptionStatus,
} from "../../types/prescription";

import {
    fetchPrescriptions,
    fetchPrescriptionById,
    processPrescription,
    finishPrescription,
} from "../../services/prescriptionService";

import PrescriptionDetailDialog from "../../components/pharmacy/PrescriptionDetailDialog";
import ProcessPrescriptionDialog from "../../components/pharmacy/ProcessPrescriptionDialog";
import FinishPrescriptionDialog from "../../components/pharmacy/FinishPrescriptionDialog";

type StatusFilter =
    | "semua"
    | PrescriptionStatus;

interface SnackbarState {
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
}

const getStatusLabel = (
    status: PrescriptionStatus
) => {
    switch (status) {
        case "menunggu":
            return "Menunggu";

        case "diproses":
            return "Diproses";

        case "selesai":
            return "Selesai";

        case "batal":
            return "Batal";

        default:
            return status;
    }
};

const getStatusColor = (
    status: PrescriptionStatus
):
    | "warning"
    | "info"
    | "success"
    | "error"
    | "default" => {
    switch (status) {
        case "menunggu":
            return "warning";

        case "diproses":
            return "info";

        case "selesai":
            return "success";

        case "batal":
            return "error";

        default:
            return "default";
    }
};

const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color?: "primary" | "warning" | "info" | "success";
}

function StatCard({
    title,
    value,
    icon,
    color = "primary",
}: StatCardProps) {
    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
            }}
        >
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 1
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700
                            }}
                        >
                            {value}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: `${color}.lighter`,
                            color: `${color}.main`,
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default function PharmacyPage() {
    const user = useAuthStore(
        (state) => state.user
    );

    const [prescriptions, setPrescriptions] =
        useState<Prescription[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("semua");

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [
        selectedPrescription,
        setSelectedPrescription,
    ] = useState<Prescription | null>(null);

    const [
        detailOpen,
        setDetailOpen,
    ] = useState(false);

    const [
        processOpen,
        setProcessOpen,
    ] = useState(false);

    const [
        finishOpen,
        setFinishOpen,
    ] = useState(false);

    const [
        snackbar,
        setSnackbar,
    ] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "info",
    });

    const canProcess =
        user?.role === "admin" ||
        user?.role === "petugas";

    const canFinish =
        user?.role === "admin" ||
        user?.role === "petugas";

    const showSnackbar = (
        message: string,
        severity:
            | "success"
            | "error"
            | "info"
            | "warning"
    ) => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    const loadPrescriptions =
        async () => {
            try {
                setLoading(true);

                const data =
                    await fetchPrescriptions();

                setPrescriptions(data);
            } catch (error: any) {
                console.error(error);

                showSnackbar(
                    error?.response?.data?.message ||
                    "Gagal memuat data resep.",
                    "error"
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadPrescriptions();
    }, []);

    const filteredPrescriptions =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            return prescriptions.filter(
                (prescription) => {
                    const matchesStatus =
                        statusFilter === "semua" ||
                        prescription.status ===
                        statusFilter;

                    const matchesSearch =
                        !keyword ||
                        prescription.patient_name
                            .toLowerCase()
                            .includes(keyword) ||
                        prescription.medical_record_number
                            .toLowerCase()
                            .includes(keyword) ||
                        prescription.registration_number
                            .toLowerCase()
                            .includes(keyword) ||
                        prescription.doctor_name
                            .toLowerCase()
                            .includes(keyword) ||
                        prescription.polyclinic_name
                            .toLowerCase()
                            .includes(keyword);

                    return (
                        matchesStatus &&
                        matchesSearch
                    );
                }
            );
        }, [
            prescriptions,
            search,
            statusFilter,
        ]);

    const paginatedPrescriptions =
        useMemo(() => {
            const start =
                page * rowsPerPage;

            return filteredPrescriptions.slice(
                start,
                start + rowsPerPage
            );
        }, [
            filteredPrescriptions,
            page,
            rowsPerPage,
        ]);

    const waitingCount =
        prescriptions.filter(
            (item) =>
                item.status === "menunggu"
        ).length;

    const processingCount =
        prescriptions.filter(
            (item) =>
                item.status === "diproses"
        ).length;

    const completedCount =
        prescriptions.filter(
            (item) =>
                item.status === "selesai"
        ).length;

    const handleSearchChange = (
        value: string
    ) => {
        setSearch(value);
        setPage(0);
    };

    const handleStatusChange = (
        value: StatusFilter
    ) => {
        setStatusFilter(value);
        setPage(0);
    };

    const handleView = async (
        prescription: Prescription
    ) => {
        try {
            setActionLoading(true);

            const detail =
                await fetchPrescriptionById(
                    prescription.id
                );

            setSelectedPrescription(detail);
            setDetailOpen(true);
        } catch (error: any) {
            console.error(error);

            showSnackbar(
                error?.response?.data?.message ||
                "Gagal mengambil detail resep.",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleProcess = async (
        prescription: Prescription
    ) => {
        try {
            setActionLoading(true);

            const detail =
                await fetchPrescriptionById(
                    prescription.id
                );

            setSelectedPrescription(detail);
            setProcessOpen(true);
        } catch (error: any) {
            console.error(error);

            showSnackbar(
                error?.response?.data?.message ||
                "Gagal mengambil detail resep.",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleFinish = async (
        prescription: Prescription
    ) => {
        try {
            setActionLoading(true);

            const detail =
                await fetchPrescriptionById(
                    prescription.id
                );

            setSelectedPrescription(detail);
            setFinishOpen(true);
        } catch (error: any) {
            console.error(error);

            showSnackbar(
                error?.response?.data?.message ||
                "Gagal mengambil detail resep.",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmProcess =
        async () => {
            if (!selectedPrescription) {
                return;
            }

            try {
                setActionLoading(true);

                await processPrescription(
                    selectedPrescription.id
                );

                showSnackbar(
                    "Resep berhasil diproses dan stok obat telah diperbarui.",
                    "success"
                );

                setProcessOpen(false);
                setSelectedPrescription(null);

                await loadPrescriptions();
            } catch (error: any) {
                console.error(error);

                showSnackbar(
                    error?.response?.data?.message ||
                    "Gagal memproses resep.",
                    "error"
                );
            } finally {
                setActionLoading(false);
            }
        };

    const handleConfirmFinish =
        async () => {
            if (!selectedPrescription) {
                return;
            }

            try {
                setActionLoading(true);

                await finishPrescription(
                    selectedPrescription.id
                );

                showSnackbar(
                    "Resep berhasil diselesaikan.",
                    "success"
                );

                setFinishOpen(false);
                setSelectedPrescription(null);

                await loadPrescriptions();
            } catch (error: any) {
                console.error(error);

                showSnackbar(
                    error?.response?.data?.message ||
                    "Gagal menyelesaikan resep.",
                    "error"
                );
            } finally {
                setActionLoading(false);
            }
        };

    const handleCloseDetail = () => {
        if (actionLoading) return;

        setDetailOpen(false);
        setSelectedPrescription(null);
    };

    const handleCloseProcess = () => {
        if (actionLoading) return;

        setProcessOpen(false);
        setSelectedPrescription(null);
    };

    const handleCloseFinish = () => {
        if (actionLoading) return;

        setFinishOpen(false);
        setSelectedPrescription(null);
    };

    return (
        <Box>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center"
                    },
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700
                        }}
                    >
                        Farmasi
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mt: 0.5
                        }}
                    >
                        Kelola resep dan pelayanan obat
                    </Typography>
                </Box>

                <Tooltip title="Refresh">
                    <IconButton
                        onClick={
                            loadPrescriptions
                        }
                        disabled={loading}
                        sx={{
                            border: "1px solid",
                            borderColor:
                                "divider",
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Statistics */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        lg: "1fr 1fr 1fr 1fr",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                <StatCard
                    title="Total Resep"
                    value={
                        prescriptions.length
                    }
                    icon={
                        <MedicationIcon />
                    }
                    color="primary"
                />

                <StatCard
                    title="Menunggu"
                    value={waitingCount}
                    icon={
                        <PendingActionsIcon />
                    }
                    color="warning"
                />

                <StatCard
                    title="Diproses"
                    value={processingCount}
                    icon={
                        <LocalShippingIcon />
                    }
                    color="info"
                />

                <StatCard
                    title="Selesai"
                    value={completedCount}
                    icon={
                        <DoneAllIcon />
                    }
                    color="success"
                />
            </Box>

            {/* Main Card */}
            <Card
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <CardContent>
                    {/* Filter */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mb: 3,
                            flexDirection: {
                                xs: "column",
                                md: "row",
                            }
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Cari pasien, no. RM, resep, dokter..."
                            value={search}
                            onChange={(event) =>
                                handleSearchChange(event.target.value)
                            }
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <Select
                            value={statusFilter}
                            onChange={(event) =>
                                handleStatusChange(
                                    event.target
                                        .value as StatusFilter
                                )
                            }
                            sx={{
                                minWidth: {
                                    xs: "100%",
                                    md: 180,
                                },
                            }}
                        >
                            <MenuItem value="semua">
                                Semua Status
                            </MenuItem>

                            <MenuItem value="menunggu">
                                Menunggu
                            </MenuItem>

                            <MenuItem value="diproses">
                                Diproses
                            </MenuItem>

                            <MenuItem value="selesai">
                                Selesai
                            </MenuItem>

                            <MenuItem value="batal">
                                Batal
                            </MenuItem>
                        </Select>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Table */}
                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: 300
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TableContainer
                                component={
                                    Paper
                                }
                                variant="outlined"
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>
                                                No
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Resep
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
                                                Tanggal
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Status
                                            </TableCell>

                                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                                                Aksi
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {paginatedPrescriptions.length ===
                                            0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={
                                                        8
                                                    }
                                                    align="center"
                                                >
                                                    <Box
                                                        sx={{
                                                            py: 5
                                                        }}
                                                    >
                                                        <MedicationIcon
                                                            sx={{
                                                                fontSize: 48,
                                                                color: "text.disabled",
                                                            }}
                                                        />

                                                        <Typography
                                                            sx={{
                                                                mt: 1
                                                            }}
                                                            color="text.secondary"
                                                        >
                                                            Tidak
                                                            ada
                                                            data
                                                            resep.
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedPrescriptions.map(
                                                (
                                                    prescription,
                                                    index
                                                ) => (
                                                    <TableRow
                                                        key={
                                                            prescription.id
                                                        }
                                                        hover
                                                    >
                                                        <TableCell>
                                                            {page *
                                                                rowsPerPage +
                                                                index +
                                                                1}
                                                        </TableCell>

                                                        <TableCell>
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                #
                                                                {
                                                                    prescription.id
                                                                }
                                                            </Typography>

                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {
                                                                    prescription.registration_number
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
                                                                    prescription.patient_name
                                                                }
                                                            </Typography>

                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {
                                                                    prescription.medical_record_number
                                                                }
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            {
                                                                prescription.polyclinic_name
                                                            }
                                                        </TableCell>

                                                        <TableCell>
                                                            {
                                                                prescription.doctor_name
                                                            }
                                                        </TableCell>

                                                        <TableCell>
                                                            {formatDate(
                                                                prescription.visit_date
                                                            )}
                                                        </TableCell>

                                                        <TableCell>
                                                            <Chip
                                                                size="small"
                                                                label={getStatusLabel(
                                                                    prescription.status
                                                                )}
                                                                color={getStatusColor(
                                                                    prescription.status
                                                                )}
                                                            />
                                                        </TableCell>

                                                        <TableCell align="right">
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    justifyContent: "flex-end",
                                                                    gap: 0.5
                                                                }}
                                                            >
                                                                <Tooltip title="Detail">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() =>
                                                                            handleView(
                                                                                prescription
                                                                            )
                                                                        }
                                                                    >
                                                                        <VisibilityIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>

                                                                {canProcess &&
                                                                    prescription.status ===
                                                                    "menunggu" && (
                                                                        <Tooltip title="Proses Resep">
                                                                            <IconButton
                                                                                size="small"
                                                                                color="primary"
                                                                                onClick={() =>
                                                                                    handleProcess(
                                                                                        prescription
                                                                                    )
                                                                                }
                                                                            >
                                                                                <PlayArrowIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )}

                                                                {canFinish &&
                                                                    prescription.status ===
                                                                    "diproses" && (
                                                                        <Tooltip title="Selesaikan Resep">
                                                                            <IconButton
                                                                                size="small"
                                                                                color="success"
                                                                                onClick={() =>
                                                                                    handleFinish(
                                                                                        prescription
                                                                                    )
                                                                                }
                                                                            >
                                                                                <CheckCircleIcon fontSize="small" />
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
                                    filteredPrescriptions.length
                                }
                                page={page}
                                onPageChange={(
                                    _event,
                                    newPage
                                ) =>
                                    setPage(
                                        newPage
                                    )
                                }
                                rowsPerPage={
                                    rowsPerPage
                                }
                                onRowsPerPageChange={(
                                    event
                                ) => {
                                    setRowsPerPage(
                                        parseInt(
                                            event
                                                .target
                                                .value,
                                            10
                                        )
                                    );

                                    setPage(
                                        0
                                    );
                                }}
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

            {/* Detail */}
            <PrescriptionDetailDialog
                open={detailOpen}
                onClose={
                    handleCloseDetail
                }
                prescription={
                    selectedPrescription
                }
            />

            {/* Process */}
            <ProcessPrescriptionDialog
                open={processOpen}
                onClose={
                    handleCloseProcess
                }
                onConfirm={
                    handleConfirmProcess
                }
                prescription={
                    selectedPrescription
                }
                loading={actionLoading}
            />

            {/* Finish */}
            <FinishPrescriptionDialog
                open={finishOpen}
                onClose={
                    handleCloseFinish
                }
                onConfirm={
                    handleConfirmFinish
                }
                prescription={
                    selectedPrescription
                }
                loading={actionLoading}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar(
                        (prev) => ({
                            ...prev,
                            open: false,
                        })
                    )
                }
            >
                <Alert
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    onClose={() =>
                        setSnackbar(
                            (prev) => ({
                                ...prev,
                                open: false,
                            })
                        )
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}