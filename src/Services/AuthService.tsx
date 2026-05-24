import axios from 'axios';
import { API_BASE_URL } from '../config';

const base_url = `${API_BASE_URL}/auth/`;
const loginUser = async (login:any)=> {
    return axios.post(`${base_url}login`, login)
        .then((result:any) => result.data)
        .catch((error:any) =>{throw error;});
}

export {loginUser};