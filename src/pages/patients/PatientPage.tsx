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
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
    createPatient,
    deletePatient,
    fetchPatients,
    updatePatient,
} from "../../services/patientService";

import type {
    Patient,
    CreatePatientRequest,
} from "../../types/patient";

import PatientFormDialog from "../../components/patients/PatientFormDialog";
import DeletePatientDialog from "../../components/patients/DeletePatientDialog";
import PatientDetailDialog from "../../components/patients/PatientDetailDialog";

import { useAuthStore } from "../../stores/authStore";

export default function PatientPage() {
    const user = useAuthStore(
        (state) => state.user
    );

    const [patients, setPatients] =
        useState<Patient[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [
        formOpen,
        setFormOpen,
    ] = useState(false);

    const [
        selectedPatient,
        setSelectedPatient,
    ] = useState<Patient | null>(null);

    const [
        deleteOpen,
        setDeleteOpen,
    ] = useState(false);

    const [
        patientToDelete,
        setPatientToDelete,
    ] = useState<Patient | null>(null);

    const [
        detailOpen,
        setDetailOpen,
    ] = useState(false);

    const [
        selectedDetailPatient,
        setSelectedDetailPatient,
    ] = useState<Patient | null>(null);

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
        user?.role === "admin" ||
        user?.role === "petugas";

    const canDelete =
        user?.role === "admin";

    const loadPatients = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await fetchPatients();

            setPatients(data);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                "Gagal mengambil data pasien."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPatients();
    }, []);

    const filteredPatients =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return patients;
            }

            return patients.filter(
                (patient) =>
                    patient.full_name
                        .toLowerCase()
                        .includes(keyword) ||
                    patient.medical_record_number
                        .toLowerCase()
                        .includes(keyword) ||
                    patient.nik
                        ?.toLowerCase()
                        .includes(keyword) ||
                    patient.phone
                        ?.toLowerCase()
                        .includes(keyword)
            );
        }, [patients, search]);

    const displayedPatients =
        filteredPatients.slice(
            page * rowsPerPage,
            page * rowsPerPage +
            rowsPerPage
        );

    const handleAdd = () => {
        setSelectedPatient(null);
        setFormOpen(true);
    };

    const handleDetail = (
        patient: Patient
    ) => {
        setSelectedDetailPatient(patient);
        setDetailOpen(true);
    };

    const handleEdit = (
        patient: Patient
    ) => {
        setSelectedPatient(patient);
        setFormOpen(true);
    };

    const handleSubmit = async (
        data: CreatePatientRequest
    ) => {
        try {
            setActionLoading(true);

            if (selectedPatient) {
                await updatePatient(
                    selectedPatient.id,
                    data
                );

                setSnackbar({
                    open: true,
                    message:
                        "Data pasien berhasil diperbarui.",
                    severity: "success",
                });
            } else {
                await createPatient(data);

                setSnackbar({
                    open: true,
                    message:
                        "Pasien berhasil ditambahkan.",
                    severity: "success",
                });
            }

            setFormOpen(false);
            setSelectedPatient(null);

            await loadPatients();
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteClick = (
        patient: Patient
    ) => {
        setPatientToDelete(patient);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!patientToDelete) return;

        try {
            setActionLoading(true);

            await deletePatient(
                patientToDelete.id
            );

            setSnackbar({
                open: true,
                message:
                    "Data pasien berhasil dihapus.",
                severity: "success",
            });

            setDeleteOpen(false);
            setPatientToDelete(null);

            await loadPatients();
        } catch (err: any) {
            setSnackbar({
                open: true,
                message:
                    err?.response?.data?.message ||
                    "Gagal menghapus pasien.",
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

    const formatDate = (
        date: string | null
    ) => {
        if (!date) return "-";

        return new Intl.DateTimeFormat(
            "id-ID",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        ).format(
            new Date(date)
        );
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
                            fontWeight: 700,
                        }}
                    >
                        Data Pasien
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Kelola data pasien rumah
                        sakit
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
                        Tambah Pasien
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
                            placeholder="Cari nama, No. RM, NIK, atau telepon..."
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
                            label={`${filteredPatients.length} pasien`}
                            variant="outlined"
                        />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {loading ? (
                        <Box
                            sx={{
                                display:
                                    "flex",
                                justifyContent:
                                    "center",
                                alignItems:
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
                                                No. RM
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Nama Pasien
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                NIK
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Jenis Kelamin
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Tanggal Lahir
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                Telepon
                                            </TableCell>

                                            <TableCell align="center" sx={{ fontWeight: 700 }}>
                                                Aksi
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {displayedPatients.length ===
                                            0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={
                                                        8
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
                                                        pasien.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            displayedPatients.map(
                                                (
                                                    patient,
                                                    index
                                                ) => (
                                                    <TableRow
                                                        key={
                                                            patient.id
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
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {
                                                                    patient.medical_record_number
                                                                }
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            {
                                                                patient.full_name
                                                            }
                                                        </TableCell>

                                                        <TableCell>
                                                            {patient.nik ||
                                                                "-"}
                                                        </TableCell>

                                                        <TableCell>
                                                            <Chip
                                                                size="small"
                                                                label={
                                                                    patient.gender
                                                                }
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            {formatDate(
                                                                patient.birth_date
                                                            )}
                                                        </TableCell>

                                                        <TableCell>
                                                            {patient.phone ||
                                                                "-"}
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Tooltip title="Detail">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() =>
                                                                        handleDetail(patient)
                                                                    }
                                                                >
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>

                                                            {canManage && (
                                                                <Tooltip title="Edit">
                                                                    <IconButton
                                                                        size="small"
                                                                        color="primary"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                patient
                                                                            )
                                                                        }
                                                                    >
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}

                                                            {canDelete && (
                                                                <Tooltip title="Hapus">
                                                                    <IconButton
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={() =>
                                                                            handleDeleteClick(
                                                                                patient
                                                                            )
                                                                        }
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
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
                                    filteredPatients.length
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

            <PatientFormDialog
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setSelectedPatient(
                        null
                    );
                }}
                onSubmit={handleSubmit}
                patient={selectedPatient}
                loading={actionLoading}
            />

            <DeletePatientDialog
                open={deleteOpen}
                patientName={
                    patientToDelete?.full_name ||
                    ""
                }
                onClose={() => {
                    setDeleteOpen(false);
                    setPatientToDelete(
                        null
                    );
                }}
                onConfirm={handleDelete}
                loading={actionLoading}
            />

            <PatientDetailDialog
                open={detailOpen}
                patient={selectedDetailPatient}
                onClose={() => {
                    setDetailOpen(false);
                    setSelectedDetailPatient(null);
                }}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar(
                        (prev) => ({
                            ...prev,
                            open: false,
                        })
                    )
                }
                message={snackbar.message}
            />
        </Box>
    );
}