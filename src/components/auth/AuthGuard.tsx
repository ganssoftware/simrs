import {
    useEffect,
    useState,
} from "react";

import {
    Navigate,
    Outlet,
} from "react-router-dom";

import {
    CircularProgress,
    Box,
} from "@mui/material";

import api from "../../services/api";

import {
    useAuthStore,
} from "../../stores/authStore";

interface MeResponse {
    success: boolean;
    data: {
        id: number;
        username: string;
        full_name: string;
        role:
        | "admin"
        | "petugas"
        | "dokter"
        | "perawat";
    };
}


export default function AuthGuard() {
    const {
        token,
        setAuth,
        logout,
    } = useAuthStore();

    const [checking, setChecking] =
        useState(true);

    useEffect(() => {
        const verifyToken = async () => {

            if (!token) {
                setChecking(false);

                return;
            }

            try {
                const response =
                    await api.get<MeResponse>(
                        "/auth/me"
                    );


                const result =
                    response.data;


                if (!result.success) {
                    logout();

                    return;
                }

                setAuth(
                    token,
                    result.data
                );

            } catch (error) {
                console.error(
                    "Auth verification error:",
                    error
                );

                logout();

            } finally {
                setChecking(false);
            }
        };
        verifyToken();
    }, [
        token,
        setAuth,
        logout,
    ]);


    if (checking) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!useAuthStore.getState().token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    return <Outlet />;
}