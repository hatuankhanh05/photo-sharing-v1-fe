import axios from 'axios';

const axiosClient = axios.create({
    baseURL: "https://yjnw85-8080.csb.app/api",
    withCredentials: true,
});

export default axiosClient;