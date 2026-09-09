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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
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
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BadgeIcon from "@mui/icons-material/Badge";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import UserForm from "../../components/user/UserForm";

import {
    useUserStore,
} from "../../stores/userStore";

import type {
    User,
    UserRole,
} from "../../types/user";


const roleLabels: Record<
    UserRole,
    string
> = {
    admin: "Admin",
    petugas: "Petugas",
    dokter: "Dokter",
    perawat: "Perawat",
};


export default function UserManagementPage() {

    // ===============================
    // STATE
    // ===============================

    const [openForm, setOpenForm] =
        useState(false);

    const [selectedUser, setSelectedUser] =
        useState<User | null>(null);

    const [confirmUser, setConfirmUser] =
        useState<User | null>(null);

    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);


    // ===============================
    // STORE
    // ===============================

    const users =
        useUserStore(
            (state) => state.users
        );

    const loading =
        useUserStore(
            (state) => state.loading
        );

    const error =
        useUserStore(
            (state) => state.error
        );

    const summary =
        useUserStore(
            (state) => state.summary
        );

    const summaryLoading =
        useUserStore(
            (state) =>
                state.summaryLoading
        );

    const loadUsers =
        useUserStore(
            (state) =>
                state.loadUsers
        );

    const loadSummary =
        useUserStore(
            (state) =>
                state.loadSummary
        );

    const toggleStatus =
        useUserStore(
            (state) =>
                state.toggleStatus
        );


    // ===============================
    // LOAD DATA
    // ===============================

    useEffect(() => {

        loadUsers();

        loadSummary();

    }, [
        loadUsers,
        loadSummary,
    ]);


    // ===============================
    // FILTER
    // ===============================

    const filteredUsers =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return users;
            }

            return users.filter(
                (user) =>
                    user.full_name
                        .toLowerCase()
                        .includes(keyword) ||

                    user.username
                        .toLowerCase()
                        .includes(keyword) ||

                    user.role
                        .toLowerCase()
                        .includes(keyword)
            );

        }, [
            users,
            search,
        ]);


    // ===============================
    // PAGINATION
    // ===============================

    const displayedUsers =
        filteredUsers.slice(
            page * rowsPerPage,
            page * rowsPerPage +
            rowsPerPage
        );


    const handleChangePage = (
        _event: unknown,
        newPage: number
    ) => {

        setPage(newPage);

    };


    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<
            HTMLTextAreaElement |
            HTMLInputElement
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


    const handleSearch = (
        event: React.ChangeEvent<
            HTMLInputElement
        >
    ) => {

        setSearch(
            event.target.value
        );

        setPage(0);

    };


    // ===============================
    // TAMBAH USER
    // ===============================

    const handleAddUser = () => {

        setSelectedUser(null);

        setOpenForm(true);

    };


    // ===============================
    // EDIT USER
    // ===============================

    const handleEditUser = (
        user: User
    ) => {

        setSelectedUser(user);

        setOpenForm(true);

    };


    // ===============================
    // CLOSE FORM
    // ===============================

    const handleCloseForm = () => {

        setOpenForm(false);

        setSelectedUser(null);

    };


    // ===============================
    // FORM SUCCESS
    // ===============================

    const handleFormSuccess =
        async () => {

            await Promise.all([
                loadUsers(),
                loadSummary(),
            ]);

        };


    // ===============================
    // OPEN STATUS CONFIRMATION
    // ===============================

    const handleToggleStatus = (
        user: User
    ) => {

        setConfirmUser(user);

    };


    // ===============================
    // CONFIRM STATUS
    // ===============================

    const handleConfirmStatus =
        async () => {

            if (!confirmUser) {
                return;
            }

            try {

                await toggleStatus(
                    confirmUser.id,
                    !confirmUser.is_active
                );

                await loadSummary();

                setConfirmUser(null);

            } catch {
                // Error sudah ditangani oleh store
            }

        };


    // ===============================
    // CLOSE STATUS DIALOG
    // ===============================

    const handleCloseStatusDialog =
        () => {

            setConfirmUser(null);

        };


    return (
        <Box>

            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
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
                        Managemen User
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Kelola akun pengguna
                        SIMRS
                    </Typography>

                </Box>


                <Button
                    variant="contained"
                    startIcon={
                        <AddIcon />
                    }
                    onClick={
                        handleAddUser
                    }
                >
                    Tambah User
                </Button>

            </Box>


            {/* ========================= */}
            {/* ERROR */}
            {/* ========================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
                >
                    {error}
                </Alert>
            )}


            {/* ========================= */}
            {/* SUMMARY */}
            {/* ========================= */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(5, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >

                {/* TOTAL USER */}

                <Card>

                    <CardContent>

                        <PeopleIcon
                            color="primary"
                            sx={{
                                fontSize: 32,
                            }}
                        />

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mt: 1,
                            }}
                        >
                            {summaryLoading ? (
                                <CircularProgress
                                    size={28}
                                />
                            ) : (
                                summary.total_user
                            )}
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Total User
                        </Typography>

                    </CardContent>

                </Card>


                {/* ADMIN */}

                <Card>

                    <CardContent>

                        <AdminPanelSettingsIcon
                            color="primary"
                            sx={{
                                fontSize: 32,
                            }}
                        />

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mt: 1,
                            }}
                        >
                            {summaryLoading ? (
                                <CircularProgress
                                    size={28}
                                />
                            ) : (
                                summary.total_admin
                            )}
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Total Admin
                        </Typography>

                    </CardContent>

                </Card>


                {/* PETUGAS */}

                <Card>

                    <CardContent>

                        <BadgeIcon
                            color="primary"
                            sx={{
                                fontSize: 32,
                            }}
                        />

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mt: 1,
                            }}
                        >
                            {summaryLoading ? (
                                <CircularProgress
                                    size={28}
                                />
                            ) : (
                                summary.total_petugas
                            )}
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Total Petugas
                        </Typography>

                    </CardContent>

                </Card>


                {/* DOKTER */}

                <Card>

                    <CardContent>

                        <LocalHospitalIcon
                            color="primary"
                            sx={{
                                fontSize: 32,
                            }}
                        />

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mt: 1,
                            }}
                        >
                            {summaryLoading ? (
                                <CircularProgress
                                    size={28}
                                />
                            ) : (
                                summary.total_dokter
                            )}
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Total Dokter
                        </Typography>

                    </CardContent>

                </Card>


                {/* PERAWAT */}

                <Card>

                    <CardContent>

                        <MedicalServicesIcon
                            color="primary"
                            sx={{
                                fontSize: 32,
                            }}
                        />

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mt: 1,
                            }}
                        >
                            {summaryLoading ? (
                                <CircularProgress
                                    size={28}
                                />
                            ) : (
                                summary.total_perawat
                            )}
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Total Perawat
                        </Typography>

                    </CardContent>

                </Card>

            </Box>


            {/* ========================= */}
            {/* TABLE CARD */}
            {/* ========================= */}

            <Card>

                <CardContent>

                    {/* SEARCH */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                        }}
                    >

                        <TextField
                            size="small"
                            placeholder="Cari user..."
                            value={search}
                            onChange={
                                handleSearch
                            }
                            sx={{
                                minWidth: {
                                    xs: "100%",
                                    sm: 300,
                                },
                            }}
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

                        <Chip
                            label={`${filteredUsers.length} user`}
                            color="primary"
                            variant="outlined"
                        />

                    </Box>


                    <Divider
                        sx={{
                            mb: 2,
                        }}
                    />


                    {/* ========================= */}
                    {/* MUI TABLE */}
                    {/* ========================= */}

                    <TableContainer>

                        <Table>

                            <TableHead>

                                <TableRow>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        No
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Nama
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Username
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Role
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Status
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Dibuat
                                    </TableCell>

                                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                                        Aksi
                                    </TableCell>

                                </TableRow>

                            </TableHead>


                            <TableBody>

                                {loading &&
                                    users.length === 0 ? (

                                    <TableRow>

                                        <TableCell
                                            colSpan={7}
                                            align="center"
                                        >

                                            <Box
                                                sx={{
                                                    py: 4,
                                                }}
                                            >

                                                <CircularProgress
                                                    size={30}
                                                />

                                            </Box>

                                        </TableCell>

                                    </TableRow>

                                ) : displayedUsers.length ===
                                    0 ? (

                                    <TableRow>

                                        <TableCell
                                            colSpan={7}
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
                                                user.
                                            </Typography>

                                        </TableCell>

                                    </TableRow>

                                ) : (

                                    displayedUsers.map(
                                        (
                                            user,
                                            index
                                        ) => (

                                            <TableRow
                                                key={
                                                    user.id
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
                                                            user.full_name
                                                        }
                                                    </Typography>

                                                </TableCell>


                                                <TableCell>
                                                    {
                                                        user.username
                                                    }
                                                </TableCell>


                                                <TableCell>

                                                    <Chip
                                                        size="small"
                                                        label={
                                                            roleLabels[
                                                            user.role
                                                            ]
                                                        }
                                                    />

                                                </TableCell>


                                                <TableCell>

                                                    <Chip
                                                        size="small"
                                                        label={
                                                            user.is_active
                                                                ? "Aktif"
                                                                : "Nonaktif"
                                                        }
                                                        color={
                                                            user.is_active
                                                                ? "success"
                                                                : "default"
                                                        }
                                                    />

                                                </TableCell>


                                                <TableCell>
                                                    {new Date(
                                                        user.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </TableCell>


                                                {/* AKSI */}

                                                <TableCell align="center">

                                                    <Tooltip title="Edit">

                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() =>
                                                                handleEditUser(
                                                                    user
                                                                )
                                                            }
                                                        >

                                                            <EditIcon
                                                                fontSize="small"
                                                            />

                                                        </IconButton>

                                                    </Tooltip>


                                                    <Tooltip
                                                        title={
                                                            user.is_active
                                                                ? "Nonaktifkan"
                                                                : "Aktifkan"
                                                        }
                                                    >

                                                        <IconButton
                                                            size="small"
                                                            color={
                                                                user.is_active
                                                                    ? "error"
                                                                    : "success"
                                                            }
                                                            onClick={() =>
                                                                handleToggleStatus(
                                                                    user
                                                                )
                                                            }
                                                        >

                                                            {user.is_active ? (

                                                                <BlockIcon
                                                                    fontSize="small"
                                                                />

                                                            ) : (

                                                                <CheckCircleIcon
                                                                    fontSize="small"
                                                                />

                                                            )}

                                                        </IconButton>

                                                    </Tooltip>

                                                </TableCell>

                                            </TableRow>

                                        )
                                    )

                                )}

                            </TableBody>

                        </Table>

                    </TableContainer>


                    {/* ========================= */}
                    {/* PAGINATION */}
                    {/* ========================= */}

                    <TablePagination
                        component="div"
                        count={
                            filteredUsers.length
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

                </CardContent>

            </Card>


            {/* ========================= */}
            {/* USER FORM */}
            {/* ========================= */}

            <UserForm
                open={openForm}
                onClose={
                    handleCloseForm
                }
                onSuccess={
                    handleFormSuccess
                }
                editUser={
                    selectedUser
                }
            />


            {/* ========================= */}
            {/* CONFIRM STATUS DIALOG */}
            {/* ========================= */}

            <Dialog
                open={
                    Boolean(confirmUser)
                }
                onClose={
                    handleCloseStatusDialog
                }
                maxWidth="xs"
                fullWidth
            >

                <DialogTitle>
                    {confirmUser?.is_active
                        ? "Nonaktifkan User"
                        : "Aktifkan User"}
                </DialogTitle>


                <DialogContent>

                    <Typography>
                        Apakah kamu yakin ingin{" "}
                        {confirmUser?.is_active
                            ? "menonaktifkan"
                            : "mengaktifkan"}{" "}
                        user{" "}

                        <strong>
                            {
                                confirmUser?.username
                            }
                        </strong>
                        ?
                    </Typography>

                    {confirmUser?.is_active && (
                        <Alert
                            severity="warning"
                            sx={{
                                mt: 2,
                            }}
                        >
                            User yang
                            dinonaktifkan
                            tidak dapat
                            login ke
                            sistem.
                        </Alert>
                    )}

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={
                            handleCloseStatusDialog
                        }
                    >
                        Batal
                    </Button>


                    <Button
                        variant="contained"
                        color={
                            confirmUser?.is_active
                                ? "error"
                                : "success"
                        }
                        onClick={
                            handleConfirmStatus
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Memproses..."
                            : confirmUser?.is_active
                                ? "Nonaktifkan"
                                : "Aktifkan"}
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
}