import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";

import {
    useAuthStore,
} from "../../stores/authStore";

import {
    updateProfile,
} from "../../services/profileService";

export default function ProfileForm() {
    const user = useAuthStore(
        (state) => state.user
    );

    const updateUser = useAuthStore(
        (state) => state.updateUser
    );

    const fileInputRef =
        useRef<HTMLInputElement | null>(
            null
        );

    const [
        fullName,
        setFullName,
    ] = useState("");

    const [
        email,
        setEmail,
    ] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [
        preview,
        setPreview,
    ] = useState<string | null>(
        null
    );

    const [
        selectedFile,
        setSelectedFile,
    ] = useState<File | null>(
        null
    );

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        success,
        setSuccess,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");

    useEffect(() => {
        if (!user) {
            return;
        }

        setFullName(
            user.full_name || ""
        );

        setEmail(
            user.email || ""
        );

        if (user.profile_photo) {
            setPreview(user.profile_photo);
        } else {
            setPreview(null);
        }
    }, [user]);

    if (!user) {
        return null;
    }

    const handlePhotoClick =
        () => {
            fileInputRef.current?.click();
        };

    const handlePhotoChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file =
            event.target.files?.[0];
        if (!file) {
            return;
        }

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {
            setError(
                "File harus berupa gambar."
            );
            return;
        }

        if (
            file.size >
            2 * 1024 * 1024
        ) {
            setError(
                "Ukuran foto maksimal 2 MB."
            );
            return;
        }

        setError("");
        setSuccess("");
        setSelectedFile(file);

        const objectUrl =
            URL.createObjectURL(
                file
            );
        setPreview(objectUrl);
    };


    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        if (!fullName.trim()) {
            setError(
                "Nama lengkap wajib diisi."
            );
            return;
        }

        if (!email.trim()) {
            setError(
                "Email wajib diisi."
            );
            return;
        }

        if (password && password.length < 6) {
            setError(
                "Password baru minimal 6 karakter."
            );
            return;
        }

        if (password && password !== confirmPassword) {
            setError(
                "Konfirmasi password tidak sama."
            );
            return;
        }

        try {
            setLoading(true);
            const formData =
                new FormData();
            formData.append(
                "full_name",
                fullName.trim()
            );

            formData.append(
                "email",
                email.trim()
            );

            if (password) {
                formData.append(
                    "password",
                    password
                );
            }

            if (selectedFile) {
                formData.append(
                    "profile_photo",
                    selectedFile
                );
            }

            const response =
                await updateProfile(
                    formData
                );

            if (!response.success) {
                setError(
                    response.message ||
                    "Gagal memperbarui profile."
                );
                return;
            }

            updateUser({
                full_name:
                    response.data.full_name,
                email:
                    response.data.email,
                profile_photo:
                    response.data.profile_photo,
            });

            setSelectedFile(null);

            if (
                response.data.profile_photo
            ) {
                setPreview(
                    response.data.profile_photo
                );
            }

            setSuccess(
                response.message ||
                "Profile berhasil diperbarui."
            );
        } catch (err: any) {
            console.error(
                "UPDATE PROFILE ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Gagal memperbarui profile."
            );
        } finally {
            setLoading(false);
        }
    };

    const getInitial =
        user.full_name
            ?.charAt(0)
            .toUpperCase() || "U";

    return (
        <Card
            elevation={0}
            sx={{
                // maxWidth: 900,
                borderRadius: 2,
                border:
                    "1px solid #e5e7eb",
            }}
        >
            <CardContent
                sx={{
                    px: 5,
                    py: 10,
                    mb: 10
                }}
            >
                {/* <Divider
                    sx={{
                        mb: 4,
                    }}
                /> */}

                <Box
                    component="form"
                    onSubmit={
                        handleSubmit
                    }
                >
                    <Stack
                        direction={{
                            xs: "column",
                            md: "row",
                        }}
                        spacing={4}
                    >
                        <Box
                            sx={{
                                width: {
                                    xs: "100%",
                                    md: 300,
                                },
                                display: "flex",
                                flexDirection:
                                    "column",
                                alignItems:
                                    "center",
                            }}
                        >
                            <Box
                                sx={{
                                    position:
                                        "relative",
                                }}
                            >
                                <Avatar
                                    src={
                                        preview ||
                                        undefined
                                    }
                                    sx={{
                                        width: 200,
                                        height: 200,
                                        fontSize: 52,
                                        fontWeight: 600,
                                    }}
                                >
                                    {getInitial}
                                </Avatar>

                                <IconButton
                                    onClick={
                                        handlePhotoClick
                                    }
                                    sx={{
                                        position:
                                            "absolute",
                                        right: 0,
                                        bottom: 0,
                                        width: 44,
                                        height: 44,
                                        bgcolor:
                                            "#1976d2",
                                        color:
                                            "#ffffff",

                                        "&:hover":
                                        {
                                            bgcolor:
                                                "#1565c0",
                                        },
                                    }}
                                >
                                    <PhotoCameraIcon />
                                </IconButton>
                            </Box>

                            <input
                                ref={
                                    fileInputRef
                                }
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={
                                    handlePhotoChange
                                }
                            />

                            <Button
                                variant="text"
                                onClick={
                                    handlePhotoClick
                                }
                                sx={{
                                    mt: 1,
                                    textTransform:
                                        "none",
                                }}
                            >
                                Ubah Foto
                            </Button>

                            <Typography
                                sx={{
                                    textAlign: "center"
                                }}
                                variant="caption"
                                color="text.secondary"
                            >
                                JPG, PNG, WEBP
                                <br />
                                Maksimal 2 MB
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                flex: 1,
                            }}
                        >
                            <Stack
                                spacing={2.5}
                            >
                                <TextField
                                    label="Nama Lengkap"
                                    value={
                                        fullName
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setFullName(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    fullWidth
                                    required
                                />

                                <TextField
                                    label="Email"
                                    type="email"
                                    value={
                                        email
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setEmail(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    fullWidth
                                    required
                                />

                                <TextField
                                    label="Username"
                                    value={
                                        user.username
                                    }
                                    fullWidth
                                    disabled
                                />

                                <TextField
                                    label="Role"
                                    value={
                                        user.role
                                    }
                                    fullWidth
                                    disabled
                                    sx={{
                                        "& input":
                                        {
                                            textTransform:
                                                "capitalize",
                                        },
                                    }}
                                />

                                <TextField
                                    label="Password Baru"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    fullWidth
                                    helperText="Kosongkan jika tidak ingin mengubah password"
                                />

                                <TextField
                                    label="Konfirmasi Password Baru"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    fullWidth
                                />

                                {error && (
                                    <Alert
                                        severity="error"
                                    >
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert
                                        severity="success"
                                    >
                                        {success}
                                    </Alert>
                                )}

                                <Box
                                    sx={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "flex-end",
                                        pt: 1,
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={
                                            loading ? (
                                                <CircularProgress
                                                    size={18}
                                                    color="inherit"
                                                />
                                            ) : (
                                                <SaveIcon />
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                        sx={{
                                            px: 3,
                                            py: 1.2,
                                            borderRadius: 2,
                                            textTransform:
                                                "none",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {loading
                                            ? "Menyimpan..."
                                            : "Simpan Perubahan"}
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}