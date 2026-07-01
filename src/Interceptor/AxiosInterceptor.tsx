import axios, { InternalAxiosRequestConfig } from "axios";
import { removeUser } from "../Slices/UserSlice";
import { removeJwt } from "../Slices/JwtSlice";
import { API_BASE_URL } from "../config";
import { errorNotification } from "../Services/NotificationService";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export const setupResponseInterceptor = (navigate: any, dispatch: any) => {
    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response?.status === 401) {
                // Ignore 401s on login routes to prevent spam
                if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
                    errorNotification("Session Expired", "Please log in again.");
                }
                dispatch(removeUser());
                dispatch(removeJwt());
                navigate('/login');
            }
            return Promise.reject(error);
        }
    )
}

export default axiosInstance;
