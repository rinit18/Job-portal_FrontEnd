import axiosInstance from "../Interceptor/AxiosInterceptor";

export const getPlatformStats = async () => {
    try {
        const response = await axiosInstance.get(`/admin/stats`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getFeedbacks = async () => {
    try {
        const response = await axiosInstance.get(`/admin/feedbacks`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getContactMessages = async () => {
    try {
        const response = await axiosInstance.get(`/admin/contacts`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
