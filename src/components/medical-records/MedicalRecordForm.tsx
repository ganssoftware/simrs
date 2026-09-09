import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    TextField,
    Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import type {
    MedicalRecord,
    CreateMedicalRecordRequest,
    UpdateMedicalRecordRequest,
} from "../../types/medicalRecord";

import type {
    Prescription,
    CreatePrescriptionRequest,
} from "../../types/prescription";

import type { Medicine } from "../../types/medicine";

import PrescriptionSection from "./PrescriptionSection";

interface MedicalRecordFormProps {
    registrationId: number;
    medicalRecord: MedicalRecord | null;
    loading: boolean;

    prescriptions: Prescription[];
    medicines: Medicine[];

    onCreate: (
        data: CreateMedicalRecordRequest
    ) => Promise<void>;

    onUpdate: (
        data: UpdateMedicalRecordRequest
    ) => Promise<void>;

    onFinish: () => Promise<void>;

    onCreatePrescription: (
        data: CreatePrescriptionRequest
    ) => Promise<void>;
}

export default function MedicalRecordForm({
    registrationId,
    medicalRecord,
    loading,
    prescriptions,
    medicines,
    onCreate,
    onUpdate,
    onFinish,
    onCreatePrescription,
}: MedicalRecordFormProps) {
    const [anamnesis, setAnamnesis] = useState("");
    const [examination, setExamination] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [treatment, setTreatment] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (medicalRecord) {
            setAnamnesis(medicalRecord.anamnesis || "");
            setExamination(medicalRecord.examination || "");
            setDiagnosis(medicalRecord.diagnosis || "");
            setTreatment(medicalRecord.treatment || "");
            setNotes(medicalRecord.notes || "");
        } else {
            setAnamnesis("");
            setExamination("");
            setDiagnosis("");
            setTreatment("");
            setNotes("");
        }

        setError("");
    }, [medicalRecord]);

    const handleSave = async () => {
        if (!diagnosis.trim()) {
            setError("Diagnosis wajib diisi.");
            return;
        }

        setError("");

        if (medicalRecord) {
            await onUpdate({
                anamnesis: anamnesis.trim(),
                examination: examination.trim(),
                diagnosis: diagnosis.trim(),
                treatment: treatment.trim(),
                notes: notes.trim(),
            });
        } else {
            await onCreate({
                registration_id: registrationId,
                anamnesis: anamnesis.trim(),
                examination: examination.trim(),
                diagnosis: diagnosis.trim(),
                treatment: treatment.trim(),
                notes: notes.trim(),
            });
        }
    };

    return (
        <Box>
            <Card>
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                        }}
                    >
                        Rekam Medis
                    </Typography>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Anamnesis"
                            value={anamnesis}
                            onChange={(event) =>
                                setAnamnesis(event.target.value)
                            }
                            multiline
                            minRows={5}
                            fullWidth
                            disabled={loading}
                            placeholder="Keluhan utama, riwayat penyakit, dan informasi terkait..."
                        />

                        <TextField
                            label="Pemeriksaan"
                            value={examination}
                            onChange={(event) =>
                                setExamination(event.target.value)
                            }
                            multiline
                            minRows={5}
                            fullWidth
                            disabled={loading}
                            placeholder="Hasil pemeriksaan fisik dan pemeriksaan lainnya..."
                        />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Diagnosis"
                            value={diagnosis}
                            onChange={(event) =>
                                setDiagnosis(event.target.value)
                            }
                            multiline
                            minRows={4}
                            fullWidth
                            required
                            disabled={loading}
                            placeholder="Diagnosis pasien..."
                        />

                        <TextField
                            label="Tindakan / Terapi"
                            value={treatment}
                            onChange={(event) =>
                                setTreatment(event.target.value)
                            }
                            multiline
                            minRows={4}
                            fullWidth
                            disabled={loading}
                            placeholder="Tindakan atau terapi yang diberikan..."
                        />
                    </Box>

                    <TextField
                        label="Catatan"
                        value={notes}
                        onChange={(event) =>
                            setNotes(event.target.value)
                        }
                        multiline
                        minRows={3}
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                        placeholder="Catatan tambahan..."
                    />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                            mt: 3,
                        }}
                    >
                        {medicalRecord && (
                            <Button
                                variant="outlined"
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                onClick={onFinish}
                                disabled={loading}
                            >
                                Selesaikan Rekam Medis
                            </Button>
                        )}

                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {medicalRecord
                                ? "Simpan Perubahan"
                                : "Simpan Rekam Medis"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {medicalRecord && (
                <Box sx={{ mt: 3 }}>
                    <PrescriptionSection
                        medicalRecordId={medicalRecord.id}
                        prescriptions={prescriptions}
                        medicines={medicines}
                        disabled={loading}
                        onCreate={onCreatePrescription}
                    />
                </Box>
            )}
        </Box>
    );
}