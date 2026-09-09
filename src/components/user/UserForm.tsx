import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";

import type {
    CreateUserRequest,
    User,
    UserRole,
} from "../../types/user";

import { useUserStore } from "../../stores/userStore";

interface UserFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    editUser?: User | null;
}

const roles: {
    value: UserRole;
    label: string;
}[] = [
    {
        value: "admin",
        label: "Admin",
    },
    {
        value: "petugas",
        label: "Petugas",
    },
    {
        value: "dokter",
        label: "Dokter",
    },
    {
        value: "perawat",
        label: "Perawat",
    },
];

const UserForm = ({
    open,
    onClose,
    onSuccess,
    editUser,
}: UserFormProps) => {
    const {
        register,
        edit,
        loading,
        error,
        clearError,
    } = useUserStore();

    const isEdit =
        Boolean(editUser);

    const [
        fullName,
        setFullName,
    ] = useState("");

    const [
        username,
        setUsername,
    ] = useState("");

    const [
        email,
        setEmail,
    ] = useState("");

    const [
        password,
        setPassword,
    ] = useState("");

    const [
        role,
        setRole,
    ] = useState<UserRole>("petugas");

    const resetForm = () => {
        setFullName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("petugas");
        clearError();
    };

    useEffect(() => {
        if (!open) {
            return;
        }

        clearError();

        if (editUser) {
            setFullName(
                editUser.full_name
            );

            setUsername(
                editUser.username
            );

            setEmail(
                editUser.email || ""
            );

            setRole(
                editUser.role
            );

            setPassword("");
        } else {
            resetForm();
        }
    }, [
        open,
        editUser,
    ]);

    const handleSubmit = async () => {
        if (!fullName.trim()) {
            return;
        }

        if (username.trim().length < 3) {
            return;
        }

        if (!email.trim()) {
            return;
        }

        if (
            !isEdit &&
            password.length < 8
        ) {
            return;
        }

        if (
            isEdit &&
            password &&
            password.length < 8
        ) {
            return;
        }

        try {
            if (isEdit && editUser) {
                await edit(
                    editUser.id,
                    {
                        username:
                            username.trim(),

                        email:
                            email.trim(),

                        full_name:
                            fullName.trim(),

                        role,

                        ...(password
                            ? {
                                password,
                            }
                            : {}),
                    }
                );
            } else {
                const data: CreateUserRequest =
                    {
                        username:
                            username.trim(),

                        email:
                            email.trim(),

                        password,

                        full_name:
                            fullName.trim(),

                        role,
                    };

                await register(data);
            }

            onSuccess?.();

            onClose();

            resetForm();
        } catch {
            // error sudah disimpan di store
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {isEdit
                    ? "Edit User"
                    : "Tambah User"}
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Nama Lengkap"
                        fullWidth
                        value={fullName}
                        onChange={(e) =>
                            setFullName(
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="Username"
                        fullWidth
                        value={username}
                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                        placeholder="contoh@gmail.com"
                    />

                    <TextField
                        label={
                            isEdit
                                ? "Password Baru"
                                : "Password"
                        }
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        helperText={
                            isEdit
                                ? "Kosongkan jika password tidak ingin diubah"
                                : "Minimal 8 karakter"
                        }
                    />

                    <FormControl fullWidth>
                        <InputLabel>
                            Role
                        </InputLabel>

                        <Select
                            value={role}
                            label="Role"
                            onChange={(e) =>
                                setRole(
                                    e.target
                                        .value as UserRole
                                )
                            }
                        >
                            {roles.map(
                                (item) => (
                                    <MenuItem
                                        key={
                                            item.value
                                        }
                                        value={
                                            item.value
                                        }
                                    >
                                        {
                                            item.label
                                        }
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Batal
                </Button>

                <Button
                    variant="contained"
                    onClick={
                        handleSubmit
                    }
                    disabled={loading}
                >
                    {loading
                        ? "Menyimpan..."
                        : isEdit
                            ? "Simpan Perubahan"
                            : "Simpan"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserForm;