import React from "react";
import ReactDOM from "react-dom/client";

import {
    HashRouter,
} from "react-router-dom";

import {
    CssBaseline,
    ThemeProvider,
    createTheme,
} from "@mui/material";

import App from "./App";


const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
        },

        secondary: {
            main: "#2e7d32",
        },

        background: {
            default: "#f5f7fa",
        },
    },

    typography: {
        fontFamily:
            '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },

    shape: {
        borderRadius: 10,
    },
});


ReactDOM.createRoot(
    document.getElementById(
        "root"
    )!
).render(
    <React.StrictMode>
        <HashRouter>
            <ThemeProvider
                theme={theme}
            >
                <CssBaseline />

                <App />
            </ThemeProvider>
        </HashRouter>
    </React.StrictMode>
);