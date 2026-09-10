const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://be-simrs.vercel.app/api";

const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

export const getProfilePhotoUrl = (
    profilePhoto?: string | null
): string | undefined => {
    console.log(
        "PROFILE PHOTO RAW:",
        profilePhoto
    );

    if (!profilePhoto) {
        return undefined;
    }

    if (
        profilePhoto.startsWith("http://") ||
        profilePhoto.startsWith("https://")
    ) {
        console.log(
            "PROFILE PHOTO FULL URL:",
            profilePhoto
        );

        return profilePhoto;
    }

    console.log(
        "PROFILE PHOTO RELATIVE:",
        profilePhoto
    );

    return `${SERVER_URL}${profilePhoto}`;
};