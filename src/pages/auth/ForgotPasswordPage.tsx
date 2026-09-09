import {
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import {
    useNavigate,
} from "react-router-dom";

import api from "../../services/api";


interface ForgotPasswordResponse {
    success: boolean;
    message: string;
}


export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");


        const normalizedEmail =
            email.trim().toLowerCase();


        if (!normalizedEmail) {
            setError(
                "Email wajib diisi"
            );

            return;
        }


        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                normalizedEmail
            )
        ) {
            setError(
                "Format email tidak valid"
            );

            return;
        }


        try {
            setLoading(true);


            const response =
                await api.post<ForgotPasswordResponse>(
                    "/users/forgot-password",
                    {
                        email: normalizedEmail,
                    }
                );


            const result =
                response.data;


            if (!result.success) {
                setError(
                    result.message ||
                    "Gagal memproses permintaan"
                );

                return;
            }


            setSuccess(
                result.message ||
                "Jika email terdaftar, link reset password akan dikirim."
            );

        } catch (error: any) {
            console.error(
                "Forgot password error:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                "Gagal memproses forgot password"
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                backgroundColor: "#ffffff",
            }}
        >

            {/* =================================
                LEFT - BACKGROUND
            ================================== */}

            <Box
                sx={{
                    display: {
                        xs: "none",
                        md: "flex",
                    },
                    width: "80%",
                    minHeight: "100vh",
                    position: "relative",
                    overflow: "hidden",
                    backgroundImage:
                        "url('/bg-simrs-left.png')",
                    backgroundSize: "cover",
                    backgroundPosition:
                        "center",
                    backgroundRepeat:
                        "no-repeat",
                }}
            >

                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(90deg, rgba(0,0,0,0.05), rgba(255,255,255,0.05))",
                    }}
                />

            </Box>


            {/* =================================
                RIGHT - FORM
            ================================== */}

            <Box
                sx={{
                    width: {
                        xs: "100%",
                        md: "40%",
                    },
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffffff",
                    px: {
                        xs: 3,
                        sm: 5,
                        md: 7,
                    },
                    py: 4,
                }}
            >

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 430,
                    }}
                >

                    {/* Logo */}

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: 4,
                        }}
                    >

                        <Box
                            sx={{
                                width: 68,
                                height: 68,
                                borderRadius: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background:
                                    "linear-gradient(135deg, #1976d2, #42a5f5)",
                                color: "#ffffff",
                                mb: 2,
                                boxShadow:
                                    "0 8px 24px rgba(25, 118, 210, 0.25)",
                            }}
                        >
                            <LocalHospitalIcon
                                sx={{
                                    fontSize: 38,
                                }}
                            />
                        </Box>


                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: "#172b4d",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            SIMRS
                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{
                                color: "#718096",
                                textAlign: "center",
                                mt: 0.5,
                            }}
                        >
                            Sistem Informasi
                            Manajemen Rumah Sakit
                        </Typography>

                    </Box>


                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            backgroundColor:
                                "#ffffff",
                        }}
                    >

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: "#172b4d",
                                mb: 0.5,
                            }}
                        >
                            Lupa Sandi?
                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{
                                color: "#718096",
                                mb: 3,
                            }}
                        >
                            Masukkan email akun Anda.
                            Kami akan mengirimkan
                            link untuk membuat
                            password baru.
                        </Typography>


                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                }}
                            >
                                {error}
                            </Alert>
                        )}


                        {success && (
                            <Alert
                                severity="success"
                                icon={
                                    <MarkEmailReadIcon />
                                }
                                sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                }}
                            >
                                {success}
                            </Alert>
                        )}


                        <Box
                            component="form"
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(
                                    event
                                ) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                                autoComplete="email"
                                placeholder="nama@email.com"
                                margin="normal"
                                sx={{
                                    "& .MuiOutlinedInput-root":
                                    {
                                        borderRadius: 2,
                                    },
                                }}
                            />


                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    textTransform:
                                        "none",
                                    boxShadow:
                                        "0 6px 18px rgba(25, 118, 210, 0.25)",
                                }}
                            >
                                {loading ? (
                                    <CircularProgress
                                        size={24}
                                        color="inherit"
                                    />
                                ) : (
                                    "Kirim Link Reset"
                                )}
                            </Button>


                            <Button
                                fullWidth
                                type="button"
                                variant="text"
                                disabled={loading}
                                onClick={() =>
                                    navigate(
                                        "/login"
                                    )
                                }
                                sx={{
                                    mt: 1.5,
                                    textTransform:
                                        "none",
                                    fontWeight: 600,
                                    color:
                                        "primary.main",
                                }}
                            >
                                Kembali ke Login
                            </Button>

                        </Box>

                    </Paper>


                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            textAlign: "center",
                            color: "#a0aec0",
                            mt: 5,
                        }}
                    >
                        © {new Date().getFullYear()} SIMRS
                    </Typography>

                </Box>

            </Box>

        </Box>
    );
}