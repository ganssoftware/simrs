import {
    Box,
    Typography,
} from "@mui/material";

import ProfileForm from "../../components/profile/ProfileForm";


export default function ProfilePage() {
    return (
        <Box>
            <Box
                sx={{
                    mb: 3,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    Profil Akun
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 3,
                    }}
                >
                    Kelola informasi profile
                    akun kamu.
                </Typography>
            </Box>
            <ProfileForm />
        </Box>
    );
}