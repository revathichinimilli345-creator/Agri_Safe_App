import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator or web, use localhost or 127.0.0.1


// For physical devices, use the specific IP address of the machine running the Django server (e.g., your laptop's Wi-Fi IP)
const BASE_URL = 'https://agrisafeapp-production.up.railway.app/api';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const predictSuitability = async (landData) => {
    try {
        const response = await apiClient.post('/predict/', landData);
        return response.data;
    } catch (error) {
        console.error('API Error details:', error.response?.data || error.message);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post('/auth/login/', credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register/', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPredictionHistory = async () => {
    try {
        const response = await apiClient.get('/history/');
        return response.data;
    } catch (error) {
        console.error('History Fetch Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getAllUserHistory = async (userId = null) => {
    try {
        const url = userId ? `/admin/all-history/?user_id=${userId}` : '/admin/all-history/';
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        console.error('Admin History Fetch Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getAdminUsers = async () => {
    try {
        const response = await apiClient.get('/admin/users/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateAdminUser = async (userId, userData) => {
    try {
        const response = await apiClient.patch(`/admin/users/${userId}/`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        await apiClient.delete(`/admin/users/${userId}/`);
    } catch (error) {
        throw error;
    }
};

export const getAdminStats = async () => {
    try {
        const response = await apiClient.get('/admin/stats/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default apiClient;

