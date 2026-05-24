import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/support`;

export const getFAQs = async () => {
    try {
        const response = await axios.get(`${API_URL}/faqs`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const submitContact = async (contactData: any) => {
    try {
        const response = await axios.post(`${API_URL}/contact`, contactData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const submitFeedback = async (feedbackData: any) => {
    try {
        const response = await axios.post(`${API_URL}/feedback`, feedbackData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
