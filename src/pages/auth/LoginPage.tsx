import {
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Checkbox,
    FormControlLabel,
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
} from "react-router-dom";

import api from "../../services/api";

import {
    useAuthStore,
} from "../../stores/authStore";


interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: {
            id: number;
            username: string;
            full_name: string;
            role:
            | "admin"
            | "petugas"
            | "dokter"
            | "perawat";
        };
    };
}


export default function LoginPage() {
    const navigate = useNavigate();

    const setAuth = useAuthStore(
        (state) => state.setAuth
    );


    const [username, setUsername] =
        useState(() => {
            return (
                localStorage.getItem(
                    "simrs_remembered_username"
                ) || ""
            );
        });

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [rememberMe, setRememberMe] =
        useState(() => {
            return Boolean(
                localStorage.getItem(
                    "simrs_remembered_username"
                )
            );
        });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError("");


        if (!username.trim()) {
            setError(
                "Username wajib diisi"
            );

            return;
        }


        if (!password) {
            setError(
                "Password wajib diisi"
            );

            return;
        }


        try {
            setLoading(true);

            const response =
                await api.post<LoginResponse>(
                    "/auth/login",
                    {
                        username:
                            username.trim(),
                        password,
                    }
                );


            const result =
                response.data;


            if (!result.success) {
                setError(
                    result.message ||
                    "Login gagal"
                );

                return;
            }

            setAuth(
                result.data.token,
                result.data.user
            );

            if (rememberMe) {
                localStorage.setItem(
                    "simrs_remembered_username",
                    username.trim()
                );
            } else {
                localStorage.removeItem(
                    "simrs_remembered_username"
                );
            }

            navigate(
                "/dashboard",
                {
                    replace: true,
                }
            );

        } catch (error: any) {
            console.error(
                "Login error:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                "Username atau password salah"
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

            {/* =========================
                LEFT - LOGIN FORM
            ========================== */}

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
                        md: 8,
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


                    {/* Login Card */}
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            p: {
                                xs: 0,
                                md: 1,
                            },
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
                            Selamat Datang
                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{
                                color: "#718096",
                                mb: 3,
                            }}
                        >
                            Silakan masuk untuk
                            melanjutkan ke sistem.
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


                        <Box
                            component="form"
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <TextField
                                fullWidth
                                label="Username"
                                value={username}
                                onChange={(
                                    event
                                ) =>
                                    setUsername(
                                        event.target
                                            .value
                                    )
                                }
                                disabled={loading}
                                margin="normal"
                                autoComplete="username"
                                sx={{
                                    "& .MuiOutlinedInput-root":
                                    {
                                        borderRadius: 2,
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                                margin="normal"
                                autoComplete="current-password"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
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
                                                    disabled={loading}
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

                            {/* Ingat Saya & Lupa Sandi */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    mt: 1,
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={rememberMe}
                                            onChange={(event) =>
                                                setRememberMe(
                                                    event.target.checked
                                                )
                                            }
                                            disabled={loading}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#718096",
                                            }}
                                        >
                                            Ingat Saya
                                        </Typography>
                                    }
                                    sx={{
                                        ml: 0,
                                    }}
                                />

                                <Button
                                    type="button"
                                    variant="text"
                                    size="small"
                                    onClick={() => {
                                        navigate("/forgot-password");
                                    }}
                                    disabled={loading}
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: 600,
                                        color: "primary.main",
                                        minWidth: "auto",
                                        px: 0,
                                    }}
                                >
                                    Lupa Sandi?
                                </Button>
                            </Box>

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
                                    "Masuk"
                                )}
                            </Button>

                        </Box>

                    </Paper>


                    {/* Footer */}
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


            {/* =========================
                RIGHT - BACKGROUND IMAGE
            ========================== */}

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
                        "url('/bg-simrs-right.png')",
                    backgroundSize: "cover",
                    backgroundPosition:
                        "center",
                    backgroundRepeat:
                        "no-repeat",
                }}
            >

                {/* Overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(0,0,0,0.08))",
                    }}
                />

            </Box>

        </Box>
    );
}