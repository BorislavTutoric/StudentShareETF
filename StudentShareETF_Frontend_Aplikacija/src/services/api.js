import axios from "axios";

const API_URL = "http://localhost:8080";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
    const token = localStorage.getItem("jwtToken");
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            const requestUrl = error.config.url;

            if(requestUrl.endsWith("/login")){
                return Promise.reject(error);
            }
            localStorage.removeItem("jwtToken");
            localStorage.setItem("showLoginModal", "true");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;