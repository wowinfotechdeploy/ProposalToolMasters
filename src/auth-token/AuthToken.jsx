import axios from "axios";
import { Base_Url } from "../Base-Url/Base_Url";
import { store } from "../redux/store/store"; // Import your Redux store

const axiosInstance = axios.create({
    baseURL: `${Base_Url}`,
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Access the token from your Redux store
        const common = store.getState().Storage; // Adjust this to match your actual store structure
        const token = common.token;

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
