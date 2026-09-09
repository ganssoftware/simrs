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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

import {
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
} from "../../services/doctorService";

import {
    fetchPolyclinics,
} from "../../services/polyclinicService";

import type {
    Doctor,
    CreateDoctorRequest,
} from "../../types/doctor";

import type {
    Polyclinic,
} from "../../types/polyclinic";

import DoctorFormDialog from "../../components/doctors/DoctorFormDialog";

import DeleteDoctorDialog from "../../components/doctors/DeleteDoctorDialog";

import { useAuthStore } from "../../stores/authStore";

export default function DoctorPage() {
    const user = useAuthStore(
        (state) => state.user
    );

    const [doctors, setDoctors] =
        useState<Doctor[]>([]);

    const [
        polyclinics,
        setPolyclinics,
    ] = useState<Polyclinic[]>([]);

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

    const [page, setPage] =
        useState(0);

    const [
        rowsPerPage,
        setRowsPerPage,
    ] = useState(10);

    const [formOpen, setFormOpen] =
        useState(false);

    const [
        selectedDoctor,
        setSelectedDoctor,
    ] = useState<Doctor | null>(null);

    const [
        deleteOpen,
        setDeleteOpen,
    ] = useState(false);

    const [
        doctorToDelete,
        setDoctorToDelete,
    ] = useState<Doctor | null>(null);

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

    const canManage =
        user?.role === "admin";

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                doctorsData,
                polyclinicsData,
            ] = await Promise.all([
                fetchDoctors(),
                fetchPolyclinics(),
            ]);

            setDoctors(
                doctorsData
            );

            setPolyclinics(
                polyclinicsData
            );
        } catch (err: any) {
            setError(
                err?.response?.data
                    ?.message ||
                "Gagal mengambil data dokter."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredDoctors =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return doctors;
            }

            return doctors.filter(
                (doctor) =>
                    doctor.full_name
                        .toLowerCase()
                        .includes(keyword) ||
                    doctor.specialization
                        ?.toLowerCase()
                        .includes(keyword) ||
                    doctor.phone
                        ?.toLowerCase()
                        .includes(keyword) ||
                    doctor.polyclinic_name
                        ?.toLowerCase()
                        .includes(keyword)
            );
        }, [doctors, search]);

    const displayedDoctors =
        filteredDoctors.slice(
            page * rowsPerPage,
            page * rowsPerPage +
            rowsPerPage
        );

    const handleAdd = () => {
        setSelectedDoctor(null);
        setFormOpen(true);
    };

    const handleEdit = (
        doctor: Doctor
    ) => {
        setSelectedDoctor(doctor);
        setFormOpen(true);
    };

    const handleSubmit = async (
        data: CreateDoctorRequest
    ) => {
        try {
            setActionLoading(true);

            if (selectedDoctor) {
                await updateDoctor(
                    selectedDoctor.id,
                    data
                );

                setSnackbar({
                    open: true,
                    message:
                        "Data dokter berhasil diperbarui.",
                    severity: "success",
                });
            } else {
                await createDoctor(data);

                setSnackbar({
                    open: true,
                    message:
                        "Dokter berhasil ditambahkan.",
                    severity: "success",
                });
            }

            setFormOpen(false);
            setSelectedDoctor(null);

            await loadData();
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteClick = (
        doctor: Doctor
    ) => {
        setDoctorToDelete(doctor);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!doctorToDelete) {
            return;
        }

        try {
            setActionLoading(true);

            await deleteDoctor(
                doctorToDelete.id
            );

            setSnackbar({
                open: true,
                message:
                    "Dokter berhasil dihapus.",
                severity: "success",
            });

            setDeleteOpen(false);
            setDoctorToDelete(null);

            await loadData();
        } catch (err: any) {
            setSnackbar({
                open: true,
                message:
                    err?.response?.data
                        ?.message ||
                    "Gagal menghapus dokter.",
                severity: "error",
            });
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

    return (
        <Box>
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
                        Data Dokter
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Kelola data dokter dan
                        poliklinik
                    </Typography>
                </Box>

                {canManage && (
                    <Button
                        variant="contained"
                        startIcon={
                            <AddIcon />
                        }
                        onClick={handleAdd}
                    >
                        Tambah Dokter
                    </Button>
                )}
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            <Card>
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <TextField
                            value={search}
                            onChange={(e) => {
                                setSearch(
                                    e.target.value
                                );
                                setPage(0);
                            }}
                            placeholder="Cari dokter atau poliklinik..."
                            size="small"
                            sx={{
                                width: {
                                    xs: "100%",
                                    md: 400,
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

                        <Chip
                            label={`${filteredDoctors.length} dokter`}
                            variant="outlined"
                        />
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
                                                No
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Nama Dokter
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Spesialisasi
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Poliklinik
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Telepon
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Status
                                            </TableCell>

                                            {canManage && (
                                                <TableCell align="center" sx={{ fontWeight: 700 }}>
                                                    Aksi
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {displayedDoctors.length ===
                                            0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={
                                                        canManage
                                                            ? 7
                                                            : 6
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
                                                        dokter.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            displayedDoctors.map(
                                                (
                                                    doctor,
                                                    index
                                                ) => (
                                                    <TableRow
                                                        key={
                                                            doctor.id
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
                                                                    fontWeight: 700
                                                                }}
                                                            >
                                                                {
                                                                    doctor.full_name
                                                                }
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            {doctor.specialization ||
                                                                "-"}
                                                        </TableCell>

                                                        <TableCell>
                                                            {doctor.polyclinic_name ||
                                                                "-"}
                                                        </TableCell>

                                                        <TableCell>
                                                            {doctor.phone ||
                                                                "-"}
                                                        </TableCell>

                                                        <TableCell>
                                                            <Chip
                                                                size="small"
                                                                label={
                                                                    doctor.is_active
                                                                        ? "Aktif"
                                                                        : "Nonaktif"
                                                                }
                                                                color={
                                                                    doctor.is_active
                                                                        ? "success"
                                                                        : "default"
                                                                }
                                                            />
                                                        </TableCell>

                                                        {canManage && (
                                                            <TableCell align="center">
                                                                <Tooltip title="Edit">
                                                                    <IconButton
                                                                        size="small"
                                                                        color="primary"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                doctor
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
                                                                        onClick={() =>
                                                                            handleDeleteClick(
                                                                                doctor
                                                                            )
                                                                        }
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
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
                                    filteredDoctors.length
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

            <DoctorFormDialog
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setSelectedDoctor(
                        null
                    );
                }}
                onSubmit={
                    handleSubmit
                }
                doctor={
                    selectedDoctor
                }
                polyclinics={
                    polyclinics
                }
                loading={
                    actionLoading
                }
            />

            <DeleteDoctorDialog
                open={deleteOpen}
                doctorName={
                    doctorToDelete
                        ?.full_name || ""
                }
                onClose={() => {
                    setDeleteOpen(false);
                    setDoctorToDelete(
                        null
                    );
                }}
                onConfirm={
                    handleDelete
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
                    3000
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