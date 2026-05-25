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

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get(`/admin/users`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/admin/users/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllJobs = async () => {
    try {
        const response = await axiosInstance.get(`/admin/jobs`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteJob = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/admin/jobs/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteFeedback = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/admin/feedbacks/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteContactMessage = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/admin/contacts/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
