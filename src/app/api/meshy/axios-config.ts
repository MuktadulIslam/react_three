import axios from 'axios';
import { meshyAPIConfig } from '../../../components/canvas/meshy/config/index';

// Create unprotected axios instance - will not check for tokens
const meshyAxiosInstance = axios.create({
    baseURL: meshyAPIConfig.baseUrl,
    timeout: meshyAPIConfig.timeout,
    headers: {
        'Authorization': `Bearer ${meshyAPIConfig.apiKey}`,
        'Content-Type': 'application/json',
    },
});

export default meshyAxiosInstance;