const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

export const getProfilePhotoUrl = (
    profilePhoto?: string | null
): string | undefined => {
    if (!profilePhoto) {
        return undefined;
    }

    // Kalau sudah URL lengkap
    if (
        profilePhoto.startsWith("http://") ||
        profilePhoto.startsWith("https://")
    ) {
        return profilePhoto;
    }

    // Kalau path dari backend
    return `${SERVER_URL}${profilePhoto}`;
};