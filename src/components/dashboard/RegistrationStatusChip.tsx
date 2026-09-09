import {
    Chip,
} from "@mui/material";

import type {
    QueueItem,
} from "../../types/dashboard";


interface Props {
    status: QueueItem["status"];
}


export default function RegistrationStatusChip({
    status,
}: Props) {
    const config = {
        menunggu: {
            label: "Menunggu",
            color: "warning" as const,
        },

        dipanggil: {
            label: "Dipanggil",
            color: "info" as const,
        },

        diperiksa: {
            label: "Diperiksa",
            color: "primary" as const,
        },

        selesai: {
            label: "Selesai",
            color: "success" as const,
        },

        batal: {
            label: "Batal",
            color: "error" as const,
        },
    };

    const current = config[status];

    return (
        <Chip
            label={current.label}
            color={current.color}
            size="small"
        />
    );
}