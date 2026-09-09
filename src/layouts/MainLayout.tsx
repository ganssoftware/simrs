import {
    useEffect,
    useState,
} from "react";

import {
    AppBar,
    Avatar,
    Box,
    Button,
    Collapse,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import MedicationIcon from "@mui/icons-material/Medication";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    useAuthStore,
} from "../stores/authStore";

import {
    getProfilePhotoUrl,
} from "../utils/profilePhoto";

const drawerWidth = 250;


export default function MainLayout() {
    const navigate = useNavigate();

    const location = useLocation();

    const user = useAuthStore(
        (state) => state.user
    );

    const [
        profileMenuAnchor,
        setProfileMenuAnchor,
    ] = useState<null | HTMLElement>(null);

    const profileMenuOpen =
        Boolean(profileMenuAnchor);

    const handleProfileMenuOpen = (
        event: React.MouseEvent<HTMLElement>
    ) => {
        setProfileMenuAnchor(
            event.currentTarget
        );
    };

    const handleProfileMenuClose = () => {
        setProfileMenuAnchor(null);
    };

    const handleProfile = () => {
        handleProfileMenuClose();

        navigate("/profile");
    };

    const logout = useAuthStore(
        (state) => state.logout
    );

    const [
        masterOpen,
        setMasterOpen,
    ] = useState<boolean>(() => {
        return (
            location.pathname ===
            "/user-management" ||
            location.pathname ===
            "/medicines"
        );
    });

    useEffect(() => {
        const isMasterPage =
            location.pathname ===
            "/user-management" ||
            location.pathname ===
            "/medicines";

        if (!isMasterPage) {
            setMasterOpen(false);
        }
    }, [
        location.pathname,
    ]);

    const handleLogout = () => {
        logout();

        navigate(
            "/login",
            {
                replace: true,
            }
        );
    };


    const handleMasterClick = () => {
        setMasterOpen(
            (prev) => !prev
        );
    };


    const menuItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: (
                <DashboardIcon />
            ),
            roles: [
                "admin",
                "petugas",
                "dokter",
                "perawat",
            ],
        },
        {
            label: "Pasien",
            path: "/patients",
            icon: (
                <PeopleIcon />
            ),
            roles: [
                "admin",
                "petugas",
                "dokter",
                "perawat",
            ],
        },
        {
            label: "Registrasi",
            path: "/registrations",
            icon: (
                <EventNoteIcon />
            ),
            roles: [
                "admin",
                "petugas",
            ],
        },
        {
            label: "Rekam Medis",
            path: "/medical-records",
            icon: (
                <MedicalInformationIcon />
            ),
            roles: [
                "admin",
                "petugas",
                "dokter",
                "perawat",
            ],
        },
        {
            label: "Farmasi",
            path: "/prescriptions",
            icon: (
                <MedicationIcon />
            ),
            roles: [
                "admin",
                "petugas",
                "dokter",
                "perawat",
            ],
        },
    ];

    const masterItems = [
        {
            label: "Manajemen User",
            path: "/user-management",
            icon: (
                <PeopleIcon />
            ),
            roles: [
                "admin",
            ],
        },
        {
            label: "Dokter",
            path: "/doctors",
            icon: (
                <LocalHospitalIcon />
            ),
            roles: [
                "admin",
            ],
        },
        {
            label: "Poliklinik",
            path: "/polyclinics",
            icon: (
                <LocalHospitalIcon />
            ),
            roles: [
                "admin",
            ],
        },
        {
            label: "Master Obat",
            path: "/medicines",
            icon: (
                <MedicationIcon />
            ),
            roles: [
                "admin",
                "petugas",
                "dokter",
                "perawat",
            ],
        },
    ];

    const visibleMenu =
        menuItems.filter((item) =>
            item.roles.includes(
                user?.role || ""
            )
        );

    const visibleMasterItems =
        masterItems.filter(
            (item) =>
                item.roles.includes(
                    user?.role || ""
                )
        );

    const isMasterActive =
        visibleMasterItems.some(
            (item) =>
                location.pathname ===
                item.path
        );

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "#f5f7fa",
            }}
        >
            {/* =========================
                APP BAR
            ========================= */}
            <AppBar
                position="fixed"
                sx={{
                    py: 0.5,
                    zIndex: (
                        theme
                    ) =>
                        theme.zIndex.drawer +
                        1,
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            flexGrow: 1,
                        }}
                    >
                        SIMRS
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            color="inherit"
                            onClick={handleProfileMenuOpen}
                            sx={{
                                textTransform: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                px: 1.5,
                                borderRadius: 0,
                                // backgroundColor: "rgba(255, 255, 255, 0.87)",
                                // color: "#333",
                                // "&:hover": {
                                //     backgroundColor: "#f5f5f5",
                                // },
                            }}
                        >
                            <Avatar
                                src={getProfilePhotoUrl(
                                    user?.profile_photo
                                        ? user.profile_photo
                                        : undefined
                                )}
                                alt={
                                    user?.full_name || "User"
                                }
                                sx={{
                                    width: 50,
                                    height: 50,
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                {user?.full_name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </Avatar>

                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 500,
                                    color: "inherit",
                                }}
                            >
                                {user?.full_name}
                            </Typography>
                        </Button>

                        <Menu
                            anchorEl={profileMenuAnchor}
                            open={profileMenuOpen}
                            onClose={handleProfileMenuClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            <MenuItem
                                onClick={handleProfile}
                            >
                                <ListItemIcon>
                                    <AccountCircleIcon
                                        fontSize="small"
                                    />
                                </ListItemIcon>

                                <ListItemText>
                                    Profil Akun
                                </ListItemText>
                            </MenuItem>

                            <MenuItem
                                onClick={handleLogout}
                            >
                                <ListItemIcon>
                                    <LogoutIcon
                                        fontSize="small"
                                    />
                                </ListItemIcon>

                                <ListItemText>
                                    Keluar
                                </ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width:
                        drawerWidth,
                    flexShrink: 0,

                    "& .MuiDrawer-paper":
                    {
                        width:
                            drawerWidth,
                        boxSizing:
                            "border-box",
                    },
                }}
            >
                <Toolbar />

                <Box
                    sx={{
                        overflow:
                            "auto",
                    }}
                >
                    {/* HEADER SIDEBAR */}
                    <Box
                        sx={{
                            p: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            Sistem Informasi
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Manajemen Rumah
                            Sakit
                        </Typography>
                    </Box>

                    <Divider />

                    <List>
                        {visibleMenu
                            .filter(
                                (item) =>
                                    item.path ===
                                    "/dashboard"
                            )
                            .map((item) => (
                                <ListItemButton
                                    key={item.path}
                                    selected={
                                        location.pathname ===
                                        item.path
                                    }
                                    onClick={() =>
                                        navigate(item.path)
                                    }
                                    sx={{
                                        mx: 1,
                                        mb: 1.5,
                                        borderRadius: 1.5,
                                        transition:
                                            "all 0.2s ease",

                                        "&:hover": {
                                            bgcolor: "#469cff",
                                            color: "#ffffff",

                                            "& .MuiListItemIcon-root":
                                            {
                                                color:
                                                    "#ffffff",
                                            },
                                        },

                                        "&.Mui-selected": {
                                            bgcolor: "#469cff",
                                            color: "#ffffff",

                                            "& .MuiListItemIcon-root":
                                            {
                                                color:
                                                    "#ffffff",
                                            },
                                        },

                                        "&.Mui-selected:hover":
                                        {
                                            bgcolor: "#83bdff",
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={item.label}
                                    />
                                </ListItemButton>
                            ))}

                        {visibleMasterItems.length >
                            0 && (
                                <>
                                    <ListItemButton
                                        selected={
                                            isMasterActive
                                        }
                                        onClick={
                                            handleMasterClick
                                        }
                                        sx={{
                                            mx: 1,
                                            mb: 1,
                                            borderRadius: 1.5,
                                            transition:
                                                "all 0.2s ease",

                                            "&:hover": {
                                                bgcolor: "#469cff",
                                                color: "#ffffff",

                                                "& .MuiListItemIcon-root":
                                                {
                                                    color:
                                                        "#ffffff",
                                                },
                                            },

                                            "&.Mui-selected": {
                                                bgcolor: "#469cff",
                                                color: "#ffffff",

                                                "& .MuiListItemIcon-root":
                                                {
                                                    color:
                                                        "#ffffff",
                                                },
                                            },

                                            "&.Mui-selected:hover":
                                            {
                                                bgcolor: "#83bdff",
                                            },
                                        }}
                                    >
                                        <ListItemIcon>
                                            <LocalHospitalIcon />
                                        </ListItemIcon>

                                        <ListItemText
                                            primary="Data Master"
                                        />

                                        {masterOpen ? (
                                            <ExpandLessIcon />
                                        ) : (
                                            <ExpandMoreIcon />
                                        )}
                                    </ListItemButton>


                                    <Collapse
                                        in={masterOpen}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <List
                                            component="div"
                                            disablePadding
                                        >
                                            {visibleMasterItems.map(
                                                (item) => {
                                                    const active =
                                                        location.pathname ===
                                                        item.path;

                                                    return (
                                                        <ListItemButton
                                                            key={
                                                                item.path
                                                            }
                                                            selected={
                                                                active
                                                            }
                                                            onClick={() =>
                                                                navigate(
                                                                    item.path
                                                                )
                                                            }
                                                            sx={{
                                                                mx: 1,
                                                                mb: 1,
                                                                pl: 5,
                                                                borderRadius:
                                                                    1.5,

                                                                transition:
                                                                    "all 0.2s ease",

                                                                "&:hover":
                                                                {
                                                                    bgcolor:
                                                                        "#469cff",
                                                                    color:
                                                                        "#ffffff",

                                                                    "& .MuiListItemIcon-root":
                                                                    {
                                                                        color:
                                                                            "#ffffff",
                                                                    },
                                                                },

                                                                "&.Mui-selected":
                                                                {
                                                                    bgcolor:
                                                                        "#469cff",
                                                                    color:
                                                                        "#ffffff",

                                                                    "& .MuiListItemIcon-root":
                                                                    {
                                                                        color:
                                                                            "#ffffff",
                                                                    },
                                                                },

                                                                "&.Mui-selected:hover":
                                                                {
                                                                    bgcolor:
                                                                        "#83bdff",
                                                                },
                                                            }}
                                                        >
                                                            <ListItemIcon>
                                                                {
                                                                    item.icon
                                                                }
                                                            </ListItemIcon>

                                                            <ListItemText
                                                                primary={
                                                                    item.label
                                                                }
                                                            />
                                                        </ListItemButton>
                                                    );
                                                }
                                            )}
                                        </List>
                                    </Collapse>
                                </>
                            )}
                        {visibleMenu
                            .filter(
                                (item) =>
                                    item.path !==
                                    "/dashboard"
                            )
                            .map((item) => (
                                <ListItemButton
                                    key={item.path}
                                    selected={
                                        location.pathname ===
                                        item.path
                                    }
                                    onClick={() =>
                                        navigate(item.path)
                                    }
                                    sx={{
                                        mx: 1,
                                        mb: 1.5,
                                        borderRadius: 1.5,
                                        transition:
                                            "all 0.2s ease",

                                        "&:hover": {
                                            bgcolor: "#469cff",
                                            color: "#ffffff",

                                            "& .MuiListItemIcon-root":
                                            {
                                                color:
                                                    "#ffffff",
                                            },
                                        },

                                        "&.Mui-selected": {
                                            bgcolor: "#469cff",
                                            color: "#ffffff",

                                            "& .MuiListItemIcon-root":
                                            {
                                                color:
                                                    "#ffffff",
                                            },
                                        },

                                        "&.Mui-selected:hover":
                                        {
                                            bgcolor: "#83bdff",
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={item.label}
                                    />
                                </ListItemButton>
                            ))}
                    </List>
                </Box>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: 0,
                }}
            >
                <Toolbar />

                <Outlet />
            </Box>
        </Box>
    );
}
