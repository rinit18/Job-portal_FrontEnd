import axiosInstance from "../Interceptor/AxiosInterceptor";

export const createPost = async (post: any) => {
    return axiosInstance.post(`/posts/create`, post)
        .then(res => res.data)
        .catch(error => { throw error; });
}

export const getAllPosts = async (userId: number, sort: string) => {
    return axiosInstance.get(`/posts/all?userId=${userId}&sort=${sort}`)
        .then(res => res.data)
        .catch(error => { throw error; });
}

export const likePost = async (postId: number, profileId: number) => {
    return axiosInstance.post(`/posts/like/${postId}/${profileId}`)
        .then(res => res.data)
        .catch(error => { throw error; });
}

export const addComment = async (postId: number, comment: any) => {
    return axiosInstance.post(`/posts/comment/${postId}`, comment)
        .then(res => res.data)
        .catch(error => { throw error; });
}
