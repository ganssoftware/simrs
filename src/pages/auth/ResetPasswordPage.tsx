import {
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import api from "../../services/api";


interface ResetPasswordResponse {
    success: boolean;
    message: string;
}


export default function ResetPasswordPage() {
    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();


    const token =
        searchParams.get("token");


    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

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


        if (!token) {
            setError(
                "Token reset password tidak ditemukan."
            );

            return;
        }


        if (!password) {
            setError(
                "Password wajib diisi"
            );

            return;
        }


        if (password.length < 8) {
            setError(
                "Password minimal 8 karakter"
            );

            return;
        }


        if (password !== confirmPassword) {
            setError(
                "Konfirmasi password tidak sama"
            );

            return;
        }


        try {
            setLoading(true);


            const response =
                await api.post<ResetPasswordResponse>(
                    "/users/reset-password",
                    {
                        token,
                        password,
                    }
                );


            const result =
                response.data;


            if (!result.success) {
                setError(
                    result.message ||
                    "Gagal mereset password"
                );

                return;
            }


            setSuccess(
                result.message ||
                "Password berhasil direset."
            );


            /*
             * Berikan waktu agar user
             * membaca pesan sukses.
             */

            setTimeout(() => {
                navigate(
                    "/login",
                    {
                        replace: true,
                    }
                );
            }, 1800);

        } catch (error: any) {
            console.error(
                "Reset password error:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                "Gagal mereset password"
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
                            Reset Password
                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{
                                color: "#718096",
                                mb: 3,
                            }}
                        >
                            Silakan buat password baru
                            untuk akun SIMRS Anda.
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
                                sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                }}
                            >
                                {success}
                            </Alert>
                        )}


                        {!token ? (
                            <>
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 2,
                                        borderRadius: 2,
                                    }}
                                >
                                    Link reset password
                                    tidak valid karena
                                    token tidak ditemukan.
                                </Alert>


                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() =>
                                        navigate(
                                            "/forgot-password"
                                        )
                                    }
                                    sx={{
                                        mt: 1,
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        textTransform:
                                            "none",
                                    }}
                                >
                                    Minta Link Reset Baru
                                </Button>
                            </>
                        ) : (

                            <Box
                                component="form"
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                <TextField
                                    fullWidth
                                    label="Password Baru"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(
                                        event
                                    ) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    disabled={
                                        loading ||
                                        Boolean(success)
                                    }
                                    autoComplete="new-password"
                                    margin="normal"
                                    helperText="Minimal 8 karakter"
                                    sx={{
                                        "& .MuiOutlinedInput-root":
                                        {
                                            borderRadius: 2,
                                        },
                                    }}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() =>
                                                            setShowPassword(
                                                                (prev) =>
                                                                    !prev
                                                            )
                                                        }
                                                        edge="end"
                                                        disabled={
                                                            loading
                                                        }
                                                        aria-label={
                                                            showPassword
                                                                ? "Sembunyikan password"
                                                                : "Tampilkan password"
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOffIcon />
                                                        ) : (
                                                            <VisibilityIcon />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />


                                <TextField
                                    fullWidth
                                    label="Konfirmasi Password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setConfirmPassword(
                                            event.target.value
                                        )
                                    }
                                    disabled={
                                        loading ||
                                        Boolean(success)
                                    }
                                    autoComplete="new-password"
                                    margin="normal"
                                    sx={{
                                        "& .MuiOutlinedInput-root":
                                        {
                                            borderRadius: 2,
                                        },
                                    }}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                (prev) =>
                                                                    !prev
                                                            )
                                                        }
                                                        edge="end"
                                                        disabled={
                                                            loading
                                                        }
                                                        aria-label={
                                                            showConfirmPassword
                                                                ? "Sembunyikan password"
                                                                : "Tampilkan password"
                                                        }
                                                    >
                                                        {showConfirmPassword ? (
                                                            <VisibilityOffIcon />
                                                        ) : (
                                                            <VisibilityIcon />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />


                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={
                                        loading ||
                                        Boolean(success)
                                    }
                                    sx={{
                                        mt: 3,
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontSize:
                                            "1rem",
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
                                        "Reset Password"
                                    )}
                                </Button>


                                <Button
                                    fullWidth
                                    type="button"
                                    variant="text"
                                    disabled={
                                        loading
                                    }
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
                                    }}
                                >
                                    Kembali ke Login
                                </Button>

                            </Box>

                        )}

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