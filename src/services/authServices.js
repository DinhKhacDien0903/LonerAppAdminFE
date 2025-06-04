import axios from '~/utils/axios';

export const verifyOtpService = ({ email, otp, isLoggingIn = true }) => {
    return axios.post('/Auth/verify-mail-otp-and-register', {
        email,
        otp,
        isLoggingIn
    });
};

export const loginService = ({ email }) => {
    return axios.post('/Auth/send-mail-otp-admin', {
        email
    });
};

export const logoutService = (userId, refreshToken) => {
    return axios.post('/Auth/logout', {
        userId,
        refreshToken
    });
};

export const deleteAccountService = (password) => {
    return axios.delete('/auth/delete-account', { data: { password } });
};

export const recoverAccountService = ({ username, password }) => {
    return axios.post('/auth/recover-account', { username, password });
};

export const changePasswordService = ({ currentPassword, newPassword }) => {
    return axios.patch('/auth/change-password', {
        currentPassword,
        newPassword,
    });
};
