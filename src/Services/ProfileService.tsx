import axiosInstance from "../Interceptor/AxiosInterceptor";

const getProfile = async (id:any)=>{
    return axiosInstance.get(`/profiles/get/${id}`)
        .then((result:any) => result.data)
        .catch((error:any) =>{throw error;});
}
const updateProfile = async (profile:any)=>{
    return axiosInstance.put(`/profiles/update`, profile)
        .then((result:any) => result.data)
        .catch((error:any) =>{throw error;});
}
const getAllProfiles = async ()=>{
    return axiosInstance.get(`/profiles/getAll`)
        .then((result:any) => result.data)
        .catch((error:any) =>{throw error;});
}
const searchProfiles = async (query: string)=>{
    return axiosInstance.get(`/profiles/search?query=${encodeURIComponent(query)}`)
        .then((result:any) => result.data)
        .catch((error:any) =>{throw error;});
}
export {getProfile, updateProfile, getAllProfiles, searchProfiles};