import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api",

    headers: {
        "Content-Type": "application/json",
    },

    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem(
                "simrs_token"
            );

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    }
);

let isRefreshing = false;

let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}[] = [];


const processQueue = (
    error: any,
    token: string | null
) => {
    failedQueue.forEach(
        (promise) => {
            if (error) {
                promise.reject(error);
            } else {
                promise.resolve(token!);
            }
        }
    );

    failedQueue = [];
};


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest =
            error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise(
                (resolve, reject) => {
                    failedQueue.push({
                        resolve,
                        reject,
                    });
                }
            ).then((token) => {
                originalRequest.headers.Authorization =
                    `Bearer ${token}`;

                return api(
                    originalRequest
                );
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const response =
                await axios.post(
                    `${
                        import.meta.env.VITE_API_URL ||
                        "http://localhost:5000/api"
                    }/auth/refresh`,
                    {},
                    {
                        withCredentials: true,
                    }
                );

            const newToken =
                response.data.data.token;

            localStorage.setItem(
                "simrs_token",
                newToken
            );

            processQueue(
                null,
                newToken
            );

            originalRequest.headers.Authorization =
                `Bearer ${newToken}`;

            return api(
                originalRequest
            );
        } catch (refreshError) {

            processQueue(
                refreshError,
                null
            );

            localStorage.removeItem(
                "simrs_token"
            );

            localStorage.removeItem(
                "simrs_user"
            );

            window.location.href =
                "/login";

            return Promise.reject(
                refreshError
            );
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;