import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/inventory/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;