import axios from "axios";
import { CompaniesHouseBase_Url } from "../Base-Url/Base_Url";

const c_h_axiosInstance = axios.create({
    baseURL: `${CompaniesHouseBase_Url}`,
});
// Search company api
c_h_axiosInstance.interceptors.request.use(
    (config) => {
        const COMPANY_HOUSE_API_KEY =
            "bm9uT2Y4Snk5X2thX2ZnRzJndEZ5TkxwYThsSm1zVkd2ekZadlRiRjo=";
        if (COMPANY_HOUSE_API_KEY) {
            config.headers["Authorization"] = `Basic ${COMPANY_HOUSE_API_KEY}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default c_h_axiosInstance;
