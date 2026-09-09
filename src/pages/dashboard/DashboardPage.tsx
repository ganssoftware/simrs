import {
    useEffect,
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
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicationIcon from "@mui/icons-material/Medication";
import WarningIcon from "@mui/icons-material/Warning";

import {
    useAuthStore,
} from "../../stores/authStore";

import StatCard from "../../components/dashboard/StatCard";

import RegistrationStatusChip from "../../components/dashboard/RegistrationStatusChip";

import {
    fetchDashboardSummary,
    fetchTodayQueue,
    fetchPolyclinicStatistics,
    fetchLowStockMedicines,
    fetchRegistrationTrend,
} from "../../services/dashboardService";

import type {
    DashboardSummary,
    QueueItem,
    PolyclinicStatistic,
    LowStockMedicine,
    RegistrationTrend,
} from "../../types/dashboard";


export default function DashboardPage() {
    const user = useAuthStore(
        (state) => state.user
    );


    const [summary, setSummary] =
        useState<DashboardSummary | null>(
            null
        );

    const [queue, setQueue] =
        useState<QueueItem[]>([]);

    const [
        polyclinicStatistics,
        setPolyclinicStatistics,
    ] = useState<
        PolyclinicStatistic[]
    >([]);

    const [
        lowStockMedicines,
        setLowStockMedicines,
    ] = useState<
        LowStockMedicine[]
    >([]);

    const [
        registrationTrend,
        setRegistrationTrend,
    ] = useState<
        RegistrationTrend[]
    >([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                summaryData,
                queueData,
                polyclinicData,
                lowStockData,
                trendData,
            ] = await Promise.all([
                fetchDashboardSummary(),
                fetchTodayQueue(),
                fetchPolyclinicStatistics(),
                fetchLowStockMedicines(),
                fetchRegistrationTrend(),
            ]);

            console.log("SUMMARY:", summaryData);
            console.log("QUEUE:", queueData);
            console.log("POLYCLINIC:", polyclinicData);
            console.log("LOW STOCK:", lowStockData);
            console.log("TREND:", trendData);

            setSummary(summaryData);
            setQueue(queueData);
            setPolyclinicStatistics(
                polyclinicData
            );
            setLowStockMedicines(
                lowStockData
            );
            setRegistrationTrend(
                trendData
            );
        } catch (error: any) {
            console.error(
                "Dashboard error:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                "Gagal mengambil data dashboard"
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadDashboard();
    }, []);


    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 400,
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }


    if (error) {
        return (
            <Alert severity="error">
                {error}
            </Alert>
        );
    }


    if (!summary) {
        return (
            <Alert severity="warning">
                Data dashboard tidak tersedia.
            </Alert>
        );
    }


    return (
        <Box>
            {/* HEADER */}

            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    Dashboard
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    Selamat datang,{" "}
                    <strong>
                        {user?.full_name}
                    </strong>
                </Typography>
            </Box>


            {/* STAT CARDS */}

            <Grid
                container
                spacing={2}
            >
                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 2.4,
                    }}
                >
                    <StatCard
                        title="Total Pasien"
                        value={
                            summary.total_patients
                        }
                        subtitle="Semua pasien"
                        icon={
                            <PeopleIcon color="primary" />
                        }
                    />
                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 2.4,
                    }}
                >
                    <StatCard
                        title="Registrasi Hari Ini"
                        value={
                            summary.registrations_today
                        }
                        subtitle="Pasien terdaftar"
                        icon={
                            <EventNoteIcon color="primary" />
                        }
                    />
                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 2.4,
                    }}
                >
                    <StatCard
                        title="Menunggu"
                        value={
                            summary.waiting_patients
                        }
                        subtitle="Antrean aktif"
                        icon={
                            <HourglassTopIcon color="warning" />
                        }
                    />
                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 2.4,
                    }}
                >
                    <StatCard
                        title="Diperiksa"
                        value={
                            summary.examining_patients
                        }
                        subtitle="Sedang diperiksa"
                        icon={
                            <MedicalServicesIcon color="info" />
                        }
                    />
                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 2.4,
                    }}
                >
                    <StatCard
                        title="Selesai"
                        value={
                            summary.completed_patients
                        }
                        subtitle="Hari ini"
                        icon={
                            <CheckCircleIcon color="success" />
                        }
                    />
                </Grid>
            </Grid>


            {/* SECONDARY STATS */}

            <Grid
                container
                spacing={2}
                sx={{ mt: 1 }}
            >
                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 3,
                    }}
                >
                    <StatCard
                        title="Dokter Aktif"
                        value={
                            summary.active_doctors
                        }
                        icon={
                            <LocalHospitalIcon color="primary" />
                        }
                    />
                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 3,
                    }}
                >
                    <StatCard
                        title="Poliklinik Aktif"
                        value={
                            summary.active_polyclinics
                        }
                        icon={
                            <LocalHospitalIcon color="secondary" />
                        }
                    />
                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 3,
                    }}
                >
                    <StatCard
                        title="Resep Menunggu"
                        value={
                            summary.waiting_prescriptions
                        }
                        icon={
                            <MedicationIcon color="info" />
                        }
                    />
                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 3,
                    }}
                >
                    <StatCard
                        title="Stok Menipis"
                        value={
                            summary.low_stock_medicines
                        }
                        subtitle="Obat ≤ 10"
                        icon={
                            <WarningIcon color="warning" />
                        }
                    />
                </Grid>
            </Grid>


            {/* MAIN CONTENT */}

            <Grid
                container
                spacing={2}
                sx={{ mt: 1 }}
            >
                {/* QUEUE */}

                <Grid
                    size={{
                        xs: 12,
                        lg: 8,
                    }}
                >
                    <Card
                        elevation={0}
                        sx={{
                            border:
                                "1px solid",
                            borderColor:
                                "divider",
                            borderRadius: 3,
                        }}
                    >
                        <CardContent>
                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
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
                                        Antrean Hari Ini
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Daftar pasien
                                        berdasarkan
                                        status
                                    </Typography>
                                </Box>

                                <Chip
                                    label={`${queue.length} pasien`}
                                    size="small"
                                />
                            </Box>

                            <Divider
                                sx={{
                                    mb: 2,
                                }}
                            />


                            {queue.length ===
                                0 ? (
                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        py: 4,
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    Belum ada
                                    antrean hari
                                    ini.
                                </Typography>
                            ) : (
                                <TableContainer
                                    component={
                                        Paper
                                    }
                                    elevation={0}
                                >
                                    <Table
                                        size="small"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700 }}>
                                                    No
                                                </TableCell>

                                                <TableCell sx={{ fontWeight: 700 }}>
                                                    Pasien
                                                </TableCell>

                                                <TableCell sx={{ fontWeight: 700 }}>
                                                    Poli
                                                </TableCell>

                                                <TableCell sx={{ fontWeight: 700 }}>
                                                    Dokter
                                                </TableCell>

                                                <TableCell sx={{ fontWeight: 700 }}>
                                                    Status
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {queue
                                                .slice(
                                                    0,
                                                    10
                                                )
                                                .map(
                                                    (
                                                        item
                                                    ) => (
                                                        <TableRow
                                                            key={
                                                                item.id
                                                            }
                                                            hover
                                                        >
                                                            <TableCell>
                                                                <Typography
                                                                    sx={{
                                                                        fontWeight: 700,
                                                                    }}
                                                                >
                                                                    {
                                                                        item.queue_number
                                                                    }
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    {
                                                                        item.patient_name
                                                                    }
                                                                </Typography>

                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >
                                                                    {
                                                                        item.medical_record_number
                                                                    }
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                {
                                                                    item.polyclinic_name
                                                                }
                                                            </TableCell>

                                                            <TableCell>
                                                                {
                                                                    item.doctor_name
                                                                }
                                                            </TableCell>

                                                            <TableCell>
                                                                <RegistrationStatusChip
                                                                    status={
                                                                        item.status
                                                                    }
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>


                {/* POLYCLINIC */}

                <Grid
                    size={{
                        xs: 12,
                        lg: 4,
                    }}
                >
                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            border:
                                "1px solid",
                            borderColor:
                                "divider",
                            borderRadius: 3,
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                Statistik Poli
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mb: 2,
                                }}
                            >
                                Registrasi hari
                                ini
                            </Typography>

                            <Divider
                                sx={{
                                    mb: 1,
                                }}
                            />


                            {polyclinicStatistics.map(
                                (
                                    poli
                                ) => (
                                    <Box
                                        key={
                                            poli.id
                                        }
                                        sx={{
                                            py: 1.5,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                mb: 0.5,
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {
                                                    poli.name
                                                }
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {
                                                    poli.total
                                                }
                                            </Typography>
                                        </Box>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Menunggu:{" "}
                                            {
                                                poli.waiting
                                            }{" "}
                                            • Diperiksa:{" "}
                                            {
                                                poli.examining
                                            }{" "}
                                            • Selesai:{" "}
                                            {
                                                poli.completed
                                            }
                                        </Typography>
                                    </Box>
                                )
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


            {/* LOW STOCK */}

            <Card
                elevation={0}
                sx={{
                    mt: 2,
                    border: "1px solid",
                    borderColor:
                        "divider",
                    borderRadius: 3,
                }}
            >
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
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
                                Stok Obat Menipis
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Obat dengan stok
                                10 atau kurang
                            </Typography>
                        </Box>

                        <WarningIcon color="warning" />
                    </Box>

                    <Divider
                        sx={{ mb: 2 }}
                    />


                    {lowStockMedicines.length ===
                        0 ? (
                        <Typography
                            color="text.secondary"
                            sx={{
                                py: 3,
                                textAlign:
                                    "center",
                            }}
                        >
                            Tidak ada obat
                            dengan stok
                            menipis.
                        </Typography>
                    ) : (
                        <TableContainer>
                            <Table
                                size="small"
                            >
                                <TableHead>
                                    <TableRow>
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
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {lowStockMedicines.map(
                                        (
                                            medicine
                                        ) => (
                                            <TableRow
                                                key={
                                                    medicine.id
                                                }
                                            >
                                                <TableCell>
                                                    {
                                                        medicine.code
                                                    }
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
                                                    <Chip
                                                        label={
                                                            medicine.stock
                                                        }
                                                        color={
                                                            medicine.stock <=
                                                                5
                                                                ? "error"
                                                                : "warning"
                                                        }
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>


            {/* REGISTRATION TREND */}

            <Card
                elevation={0}
                sx={{
                    mt: 2,
                    border: "1px solid",
                    borderColor:
                        "divider",
                    borderRadius: 3,
                }}
            >
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Registrasi 7 Hari
                        Terakhir
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                        }}
                    >
                        Ringkasan jumlah
                        kunjungan pasien
                    </Typography>

                    <Divider
                        sx={{ mb: 2 }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            overflowX:
                                "auto",
                            pb: 1,
                        }}
                    >
                        {registrationTrend.map(
                            (item) => {
                                const date =
                                    new Date(
                                        item.visit_date
                                    );

                                return (
                                    <Paper
                                        key={
                                            item.visit_date
                                        }
                                        elevation={0}
                                        sx={{
                                            minWidth: 130,
                                            p: 2,
                                            border:
                                                "1px solid",
                                            borderColor:
                                                "divider",
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {date.toLocaleDateString(
                                                "id-ID",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                }
                                            )}
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            {
                                                item.total
                                            }
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="success.main"
                                        >
                                            {
                                                item.completed
                                            }{" "}
                                            selesai
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="error.main"
                                            sx={{
                                                display: "block"
                                            }}
                                        >
                                            {
                                                item.cancelled
                                            }{" "}
                                            batal
                                        </Typography>
                                    </Paper>
                                );
                            }
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}