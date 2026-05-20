import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/support`;

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
