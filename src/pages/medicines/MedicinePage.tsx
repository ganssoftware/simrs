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
    FormControl,
    InputLabel,
    MenuItem,
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
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";

import {
    fetchMedicines,
    createMedicine,
    updateMedicine,
} from "../../services/medicineService";

import type {
    Medicine,
    CreateMedicineRequest,
    UpdateMedicineRequest,
} from "../../types/medicine";

import MedicineFormDialog from "../../components/medicines/MedicineFormDialog";

const MedicinePage = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const [dialogOpen, setDialogOpen] =
        useState<boolean>(false);

    const [selectedMedicine, setSelectedMedicine] =
        useState<Medicine | null>(null);

    const [search, setSearch] =
        useState<string>("");

    const [statusFilter, setStatusFilter] =
        useState<"all" | "active" | "inactive">(
            "active"
        );

    const [page, setPage] =
        useState<number>(0);

    const [rowsPerPage, setRowsPerPage] =
        useState<number>(10);

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    /**
     * =========================
     * LOAD DATA
     * =========================
     */
    const loadMedicines = async () => {
        try {
            setLoading(true);

            const data =
                await fetchMedicines();

            setMedicines(data);
        } catch (error: any) {
            console.error(
                "Gagal mengambil data obat:",
                error
            );

            showSnackbar(
                error?.response?.data?.message ||
                    "Gagal mengambil data obat.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMedicines();
    }, []);

    /**
     * =========================
     * FILTER
     * =========================
     */
    const filteredMedicines = useMemo(() => {
        const keyword =
            search.trim().toLowerCase();

        return medicines.filter((medicine) => {
            const matchesSearch =
                !keyword ||
                medicine.code
                    .toLowerCase()
                    .includes(keyword) ||
                medicine.name
                    .toLowerCase()
                    .includes(keyword);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" &&
                    medicine.is_active) ||
                (statusFilter === "inactive" &&
                    !medicine.is_active);

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        medicines,
        search,
        statusFilter,
    ]);

    /**
     * =========================
     * PAGINATION
     * =========================
     */
    const paginatedMedicines =
        filteredMedicines.slice(
            page * rowsPerPage,
            page * rowsPerPage +
                rowsPerPage
        );

    /**
     * =========================
     * DIALOG
     * =========================
     */
    const handleAdd = () => {
        setSelectedMedicine(null);
        setDialogOpen(true);
    };

    const handleEdit = (
        medicine: Medicine
    ) => {
        setSelectedMedicine(medicine);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedMedicine(null);
    };

    /**
     * =========================
     * CREATE / UPDATE
     * =========================
     */
    const handleSubmit = async (
        data:
            | CreateMedicineRequest
            | UpdateMedicineRequest
    ) => {
        try {
            if (selectedMedicine) {
                await updateMedicine(
                    selectedMedicine.id,
                    data as UpdateMedicineRequest
                );

                showSnackbar(
                    "Data obat berhasil diperbarui.",
                    "success"
                );
            } else {
                await createMedicine(
                    data as CreateMedicineRequest
                );

                showSnackbar(
                    "Obat berhasil ditambahkan.",
                    "success"
                );
            }

            handleCloseDialog();

            await loadMedicines();
        } catch (error: any) {
            console.error(
                "Gagal menyimpan obat:",
                error
            );

            const message =
                error?.response?.data?.message ||
                "Gagal menyimpan data obat.";

            showSnackbar(
                message,
                "error"
            );

            throw error;
        }
    };

    /**
     * =========================
     * STATUS TOGGLE
     * =========================
     */
    const handleToggleStatus = async (
        medicine: Medicine
    ) => {
        try {
            await updateMedicine(
                medicine.id,
                {
                    is_active:
                        !medicine.is_active,
                }
            );

            showSnackbar(
                medicine.is_active
                    ? "Obat berhasil dinonaktifkan."
                    : "Obat berhasil diaktifkan.",
                "success"
            );

            await loadMedicines();
        } catch (error: any) {
            console.error(
                "Gagal mengubah status obat:",
                error
            );

            showSnackbar(
                error?.response?.data?.message ||
                    "Gagal mengubah status obat.",
                "error"
            );
        }
    };

    /**
     * =========================
     * PAGINATION HANDLER
     * =========================
     */
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

    /**
     * =========================
     * SNACKBAR
     * =========================
     */
    const showSnackbar = (
        message: string,
        severity: "success" | "error"
    ) => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({
            ...prev,
            open: false,
        }));
    };

    /**
     * =========================
     * RENDER
     * =========================
     */
    return (
        <Box>
            {/* HEADER */}
            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Master Obat
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Kelola data obat yang
                        digunakan dalam resep
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Tambah Obat
                </Button>
            </Box>

            {/* FILTER */}
            <Card
                sx={{
                    mb: 3,
                }}
            >
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        <TextField
                            label="Cari obat"
                            placeholder="Kode atau nama obat"
                            value={search}
                            onChange={(event) => {
                                setSearch(
                                    event.target
                                        .value
                                );
                                setPage(0);
                            }}
                            size="small"
                            sx={{
                                minWidth: 280,
                                flex: 1,
                            }}
                            slotProps={{
                                input: {
                                    startAdornment:
                                        <SearchIcon
                                            sx={{
                                                mr: 1,
                                                color:
                                                    "text.secondary",
                                            }}
                                        />,
                                },
                            }}
                        />

                        <FormControl
                            size="small"
                            sx={{
                                minWidth: 180,
                            }}
                        >
                            <InputLabel>
                                Status
                            </InputLabel>

                            <Select
                                label="Status"
                                value={
                                    statusFilter
                                }
                                onChange={(
                                    event
                                ) => {
                                    setStatusFilter(
                                        event
                                            .target
                                            .value as
                                            | "all"
                                            | "active"
                                            | "inactive"
                                    );

                                    setPage(0);
                                }}
                            >
                                <MenuItem value="active">
                                    Aktif
                                </MenuItem>

                                <MenuItem value="inactive">
                                    Tidak Aktif
                                </MenuItem>

                                <MenuItem value="all">
                                    Semua
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </CardContent>
            </Card>

            {/* TABLE */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    No
                                </TableCell>

                                <TableCell>
                                    Kode
                                </TableCell>

                                <TableCell>
                                    Nama Obat
                                </TableCell>

                                <TableCell>
                                    Satuan
                                </TableCell>

                                <TableCell align="right">
                                    Stok
                                </TableCell>

                                <TableCell align="right">
                                    Harga
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>

                                <TableCell align="center">
                                    Aksi
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        align="center"
                                        sx={{
                                            py: 5,
                                        }}
                                    >
                                        <CircularProgress
                                            size={30}
                                        />

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mt: 1,
                                            }}
                                        >
                                            Memuat data
                                            obat...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : paginatedMedicines.length ===
                              0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        align="center"
                                        sx={{
                                            py: 5,
                                        }}
                                    >
                                        <Typography
                                            color="text.secondary"
                                        >
                                            Tidak ada
                                            data obat.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedMedicines.map(
                                    (
                                        medicine,
                                        index
                                    ) => (
                                        <TableRow
                                            key={
                                                medicine.id
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
                                                        fontWeight:
                                                            600,
                                                    }}
                                                >
                                                    {
                                                        medicine.code
                                                    }
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    medicine.name
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    medicine.unit
                                                }
                                            </TableCell>

                                            <TableCell align="right">
                                                {medicine.stock.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </TableCell>

                                            <TableCell align="right">
                                                Rp{" "}
                                                {Number(
                                                    medicine.price
                                                ).toLocaleString(
                                                    "id-ID"
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={
                                                        medicine.is_active
                                                            ? "Aktif"
                                                            : "Tidak Aktif"
                                                    }
                                                    color={
                                                        medicine.is_active
                                                            ? "success"
                                                            : "default"
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>

                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={
                                                            <EditIcon />
                                                        }
                                                        onClick={() =>
                                                            handleEdit(
                                                                medicine
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color={
                                                            medicine.is_active
                                                                ? "warning"
                                                                : "success"
                                                        }
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                medicine
                                                            )
                                                        }
                                                    >
                                                        {medicine.is_active
                                                            ? "Nonaktifkan"
                                                            : "Aktifkan"}
                                                    </Button>
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
                        filteredMedicines.length
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
                    labelDisplayedRows={({
                        from,
                        to,
                        count,
                    }) =>
                        `${from}-${to} dari ${
                            count !== -1
                                ? count
                                : `lebih dari ${to}`
                        }`
                    }
                />
            </Card>

            {/* FORM DIALOG */}
            <MedicineFormDialog
                open={dialogOpen}
                medicine={
                    selectedMedicine
                }
                onClose={
                    handleCloseDialog
                }
                onSubmit={
                    handleSubmit
                }
            />

            {/* SNACKBAR */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={
                    handleCloseSnackbar
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    onClose={
                        handleCloseSnackbar
                    }
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    sx={{
                        width: "100%",
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MedicinePage;
