import api from "./api";

import type {
    UpdateProfileResponse,
} from "../types/profile";

export const updateProfile =
    async (
        formData: FormData
    ): Promise<UpdateProfileResponse> => {
        const response =
            await api.put<UpdateProfileResponse>(
                "/users/profile",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

        return response.data;
    };