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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
    fetchPolyclinics,
    createPolyclinic,
    updatePolyclinic,
    deletePolyclinic,
} from "../../services/polyclinicService";

import type {
    Polyclinic,
    CreatePolyclinicRequest,
} from "../../types/polyclinic";

import {
    fetchDoctors,
} from "../../services/doctorService";

import type {
    Doctor,
} from "../../types/doctor";

import PolyclinicFormDialog from "../../components/polyclinics/PolyclinicFormDialog";

import DeletePolyclinicDialog from "../../components/polyclinics/DeletePolyclinicDialog";

import { useAuthStore } from "../../stores/authStore";

export default function PolyclinicPage() {
    const user = useAuthStore(
        (state) => state.user
    );

    const [
        polyclinics,
        setPolyclinics,
    ] = useState<Polyclinic[]>([]);

    const [doctors, setDoctors] =
        useState<Doctor[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [
        actionLoading,
        setActionLoading,
    ] = useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState<
        "semua" | "aktif" | "nonaktif"
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
        deleteOpen,
        setDeleteOpen,
    ] = useState(false);

    const [
        selectedPolyclinic,
        setSelectedPolyclinic,
    ] = useState<Polyclinic | null>(
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

    const isAdmin =
        user?.role === "admin";

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                polyclinicData,
                doctorData,
            ] = await Promise.all([
                fetchPolyclinics(),
                fetchDoctors(),
            ]);

            setPolyclinics(
                polyclinicData
            );

            setDoctors(
                doctorData
            );
        } catch (err: any) {
            setError(
                err?.response?.data
                    ?.message ||
                    "Gagal mengambil data poliklinik."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getDoctorCount = (
        polyclinicId: number
    ) => {
        return doctors.filter(
            (doctor) =>
                doctor.polyclinic_id ===
                polyclinicId
        ).length;
    };

    const filteredPolyclinics =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            return polyclinics.filter(
                (polyclinic) => {
                    const matchesSearch =
                        !keyword ||
                        polyclinic.name
                            .toLowerCase()
                            .includes(
                                keyword
                            ) ||
                        (
                            polyclinic.description ||
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                keyword
                            );

                    const matchesStatus =
                        statusFilter ===
                            "semua" ||
                        (
                            statusFilter ===
                                "aktif" &&
                            polyclinic.is_active
                        ) ||
                        (
                            statusFilter ===
                                "nonaktif" &&
                            !polyclinic.is_active
                        );

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            polyclinics,
            search,
            statusFilter,
        ]);

    const displayedPolyclinics =
        filteredPolyclinics.slice(
            page * rowsPerPage,
            page * rowsPerPage +
                rowsPerPage
        );

    const activeCount =
        polyclinics.filter(
            (item) =>
                item.is_active
        ).length;

    const inactiveCount =
        polyclinics.filter(
            (item) =>
                !item.is_active
        ).length;

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
        data: CreatePolyclinicRequest
    ) => {
        try {
            setActionLoading(true);

            await createPolyclinic(
                data
            );

            setFormOpen(false);

            showSnackbar(
                "Poliklinik berhasil ditambahkan.",
                "success"
            );

            await loadData();
        } catch (err: any) {
            showSnackbar(
                err?.response?.data
                    ?.message ||
                    "Gagal menambahkan poliklinik.",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async (
        data: CreatePolyclinicRequest
    ) => {
        if (!selectedPolyclinic) {
            return;
        }

        try {
            setActionLoading(true);

            await updatePolyclinic(
                selectedPolyclinic.id,
                data
            );

            setFormOpen(false);
            setSelectedPolyclinic(
                null
            );

            showSnackbar(
                "Poliklinik berhasil diperbarui.",
                "success"
            );

            await loadData();
        } catch (err: any) {
            showSnackbar(
                err?.response?.data
                    ?.message ||
                    "Gagal memperbarui poliklinik.",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmit = async (
        data: CreatePolyclinicRequest
    ) => {
        if (selectedPolyclinic) {
            await handleUpdate(data);
        } else {
            await handleCreate(data);
        }
    };

    const handleDelete = async () => {
        if (!selectedPolyclinic) {
            return;
        }

        try {
            setActionLoading(true);

            await deletePolyclinic(
                selectedPolyclinic.id
            );

            setDeleteOpen(false);
            setSelectedPolyclinic(
                null
            );

            showSnackbar(
                "Poliklinik berhasil dihapus.",
                "success"
            );

            await loadData();
        } catch (err: any) {
            showSnackbar(
                err?.response?.data
                    ?.message ||
                    "Gagal menghapus poliklinik.",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const openCreateDialog = () => {
        setSelectedPolyclinic(
            null
        );

        setFormOpen(true);
    };

    const openEditDialog = (
        polyclinic: Polyclinic
    ) => {
        setSelectedPolyclinic(
            polyclinic
        );

        setFormOpen(true);
    };

    const openDeleteDialog = (
        polyclinic: Polyclinic
    ) => {
        setSelectedPolyclinic(
            polyclinic
        );

        setDeleteOpen(true);
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
                        Poliklinik
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Kelola data poliklinik
                        rumah sakit
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

                    {isAdmin && (
                        <Button
                            variant="contained"
                            startIcon={
                                <AddIcon />
                            }
                            onClick={
                                openCreateDialog
                            }
                        >
                            Tambah
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
                            Poliklinik Aktif
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mt: 1,
                            }}
                        >
                            {activeCount}
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Poliklinik Nonaktif
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mt: 1,
                            }}
                        >
                            {inactiveCount}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

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
                            placeholder="Cari poliklinik..."
                            value={search}
                            onChange={(
                                event
                            ) => {
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
                                        | "semua"
                                        | "aktif"
                                        | "nonaktif"
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

                            <MenuItem value="aktif">
                                Aktif
                            </MenuItem>

                            <MenuItem value="nonaktif">
                                Nonaktif
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
                                                Nama Poliklinik
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Deskripsi
                                            </TableCell>

                                            <TableCell align="center" sx={{ fontWeight: 700 }}>
                                                Dokter
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Status
                                            </TableCell>

                                            {isAdmin && (
                                                <TableCell align="center" sx={{ fontWeight: 700 }}>
                                                    Aksi
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {displayedPolyclinics.length ===
                                        0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={
                                                        isAdmin
                                                            ? 5
                                                            : 4
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
                                                        poliklinik.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            displayedPolyclinics.map(
                                                (
                                                    polyclinic
                                                ) => (
                                                    <TableRow
                                                        key={
                                                            polyclinic.id
                                                        }
                                                        hover
                                                    >
                                                        <TableCell>
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {
                                                                    polyclinic.name
                                                                }
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    maxWidth: 400,
                                                                }}
                                                            >
                                                                {polyclinic.description ||
                                                                    "-"}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Chip
                                                                size="small"
                                                                label={getDoctorCount(
                                                                    polyclinic.id
                                                                )}
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            <Chip
                                                                size="small"
                                                                label={
                                                                    polyclinic.is_active
                                                                        ? "Aktif"
                                                                        : "Nonaktif"
                                                                }
                                                                color={
                                                                    polyclinic.is_active
                                                                        ? "success"
                                                                        : "default"
                                                                }
                                                            />
                                                        </TableCell>

                                                        {isAdmin && (
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
                                                                    <Tooltip title="Edit">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="primary"
                                                                            disabled={
                                                                                actionLoading
                                                                            }
                                                                            onClick={() =>
                                                                                openEditDialog(
                                                                                    polyclinic
                                                                                )
                                                                            }
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                    <Tooltip title="Hapus">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="error"
                                                                            disabled={
                                                                                actionLoading
                                                                            }
                                                                            onClick={() =>
                                                                                openDeleteDialog(
                                                                                    polyclinic
                                                                                )
                                                                            }
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            </TableCell>
                                                        )}
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
                                    filteredPolyclinics.length
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

            {/* Form */}
            <PolyclinicFormDialog
                open={formOpen}
                onClose={() => {
                    setFormOpen(
                        false
                    );

                    setSelectedPolyclinic(
                        null
                    );
                }}
                onSubmit={
                    handleSubmit
                }
                editingPolyclinic={
                    selectedPolyclinic
                }
                loading={
                    actionLoading
                }
            />

            {/* Delete */}
            <DeletePolyclinicDialog
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(
                        false
                    );

                    setSelectedPolyclinic(
                        null
                    );
                }}
                onConfirm={
                    handleDelete
                }
                polyclinicName={
                    selectedPolyclinic
                        ?.name || ""
                }
                loading={
                    actionLoading
                }
            />

            {/* Snackbar */}
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