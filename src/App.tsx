import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import UserManagementPage from "./pages/user/UserManagementPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import MainLayout from "./layouts/MainLayout";
import AuthGuard from "./components/auth/AuthGuard";
import PatientPage from "./pages/patients/PatientPage";
import DoctorPage from "./pages/doctors/DoctorPage";
import PolyclinicPage from "./pages/polyclinics/PolyclinicPage";
import RegistrationPage from "./pages/registrations/RegistrationPage";
import MedicalRecordPage from "./pages/medical-records/MedicalRecordPage";
import PharmacyPage from "./pages/pharmacy/PharmacyPage";
import MedicinePage from "./pages/medicines/MedicinePage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProfilePage from "./pages/profile/ProfilePage";

function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPasswordPage />}
            />

            <Route
                path="/reset-password"
                element={<ResetPasswordPage />}
            />

            <Route
                element={<AuthGuard />}
            >
                <Route
                    element={
                        <MainLayout />
                    }
                >
                    <Route
                        path="/dashboard"
                        element={
                            <DashboardPage />
                        }
                    />
                    <Route
                        path="/user-management"
                        element={
                            <UserManagementPage />
                        }
                    />
                    <Route
                        path="/medicines"
                        element={<MedicinePage />}
                    />
                    <Route
                        path="/patients"
                        element={<PatientPage />}
                    />
                    <Route
                        path="/doctors"
                        element={<DoctorPage />}
                    />
                    <Route
                        path="/polyclinics"
                        element={<PolyclinicPage />}
                    />
                    <Route
                        path="/registrations"
                        element={<RegistrationPage />}
                    />
                    <Route
                        path="/medical-records"
                        element={
                            <MedicalRecordPage />
                        }
                    />
                    <Route
                        path="/prescriptions"
                        element={<PharmacyPage />}
                    />
                    <Route
                        path="/profile"
                        element={<ProfilePage />}
                    />
                </Route>
            </Route>


            <Route
                path="*"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />
        </Routes>
    );
}

export default App
