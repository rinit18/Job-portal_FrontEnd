import axiosInstance from "../Interceptor/AxiosInterceptor";


const postJob=async (job:any)=>{
    return axiosInstance.post(`/jobs/post`, job)
    .then((result:any) => result.data)
    .catch((error:any) =>{throw error;});
}
const getAllJobs=async ()=>{
    return axiosInstance.get(`/jobs/getAll`)
    .then((result:any) => result.data)
    .catch((error:any) =>{throw error;});
}
const searchJobs=async (query: string)=>{
    return axiosInstance.get(`/jobs/search?query=${encodeURIComponent(query)}`)
    .then((result:any) => result.data)
    .catch((error:any) =>{throw error;});
}
export const getJob = async (id: any) => {
    return axiosInstance.get(`/jobs/${id}`)
        .then(res => res.data)
        .catch(error => { throw error; });
}

export const getSavedJobs = async (jobIds: number[]) => {
    return axiosInstance.post(`/jobs/saved`, jobIds)
        .then(res => res.data)
        .catch(error => { throw error; });
}

export const getJobHistory = async (userId: number, status: string) => {
    return axiosInstance.get(`/jobs/history/${userId}/${status}`)
        .then(res => res.data)
        .catch(error => { throw error; });
}

const applyJob=async (job:any, id:any)=>{
    return axiosInstance.post(`/jobs/apply/${id}`, job)
    .then((result:any) => result.data)
    .catch((error:any) =>{throw error;});
}
const getHistory=async (id:any, status:any)=>{
    return axiosInstance.get(`/jobs/history/${id}/${status}`)
    .then((result:any) => result.data)
    .catch((error:any) =>{throw error;});
}
const getJobsPostedBy=async(id:any)=>{
    return axiosInstance.get(`/jobs/postedBy/${id}`).then(result=>result.data).catch(error=>{throw error;});
}
const changeAppStatus=async (interview:any)=>{
    return axiosInstance.post(`/jobs/changeAppStatus`, interview)
    .then((result:any) => result.data)
    .catch((error:any) =>{throw error;});
}
export {postJob, getAllJobs, searchJobs, applyJob, getHistory, getJobsPostedBy, changeAppStatus};