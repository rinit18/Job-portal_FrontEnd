import axiosInstance from "../Interceptor/AxiosInterceptor";

export const sendConnectionRequest = async (senderId: number, receiverId: number) => {
    return axiosInstance.post(`/connections/send/${senderId}/${receiverId}`)
        .then(res => res.data)
        .catch(error => { throw error; });
}

export const acceptConnectionRequest = async (requestId: number) => {
    return axiosInstance.post(`/connections/accept/${requestId}`)
        .then(res => res.data)
        .catch(error => { throw error; });
}

export const rejectConnectionRequest = async (requestId: number) => {
    return axiosInstance.post(`/connections/reject/${requestId}`)
        .then(res => res.data)
        .catch(error => { throw error; });
}

export const withdrawConnectionRequest = async (senderId: number, receiverId: number) => {
    return axiosInstance.delete(`/connections/withdraw/${senderId}/${receiverId}`)
        .then(res => res.data)
        .catch(error => { throw error; });
}

export const removeConnection = async (userId1: number, userId2: number) => {
    return axiosInstance.delete(`/connections/remove/${userId1}/${userId2}`)
        .then(res => res.data)
        .catch(error => { throw error; });
}

export const getPendingRequests = async (userId: number) => {
    return axiosInstance.get(`/connections/requests/${userId}`)
        .then(res => res.data)
        .catch(error => { throw error; });
}

export const getConnections = async (userId: number) => {
    return axiosInstance.get(`/connections/user/${userId}`)
        .then(res => res.data)
        .catch(error => { throw error; });
}

export const getSuggestions = async (userId: number) => {
    return axiosInstance.get(`/connections/suggestions/${userId}`)
        .then(res => res.data)
        .catch(error => { throw error; });
}

export const getConnectionStatus = async (currentUserId: number, targetUserId: number): Promise<string> => {
    return axiosInstance.get(`/connections/status/${currentUserId}/${targetUserId}`)
        .then(res => res.data)
        .catch(error => { throw error; });
}
