import axios from 'axios';
import store from '~/redux/store';
import { clearUserInfo } from '~/redux/actions';

const instance = axios.create({
    // baseURL: "https://localhost:7072/api",
    baseURL: "https://localhost:7165/api",
    withCredentials: true,
});

export const SetupInterceptors = (navigate) => {
    instance.interceptors.request.use(
        function (config) {
            return config;
        },
        function (error) {
            return Promise.reject(error);
        },
    );

    instance.interceptors.response.use(
        function (response) {
            return response.data;
        },
        async function (error) {
            const { config } = error;

            if (error.response?.status == 401) {
                navigate('/login');
                store.dispatch(clearUserInfo());
                localStorage.removeItem('isAuthenticated');
                localStorage.setItem('showToastOnLogin', true);
            } else {
                try {
                    const retryResponse = await axios(config);
                    return retryResponse.data;
                } catch (retryError) {
                    return Promise.reject(retryError.response);
                }
            }

            return Promise.reject(error.response);
        },
    );
};

export default instance;
