import axios from '~/utils/axios';

export const getMyInfoService = (userId) => {
    return axios.get('/User/profile-detail-admin', {
        params: { userId },
    });
};

export const updateMyInfoService = (data) => {
    return axios.put('/user/updateInfor', data);
};

export const getUserInfoService = (userId) => {
    return axios.get('/user/getInfor', {
        params: { userId },
    });
};

export const getPicturesOfUserService = (userId) => {
    return axios.get(`/user/pictures/${userId}`);
};

export const getNotificationsService = () => {
    return axios.get('/chat/getAllNotificationMessage');
};

// export const getNotificationsPostService = () => {
//     return axios.get('/user/notifications');
// };
export const getNotificationsUserService = () => {
    return axios.get('/user/notificationFriend');
};

export const readNotificationService = (notificationId) => {
    return axios.patch(`/user/notification/${notificationId}`);
};

export const getNotificationsTypeService = () => {
    return axios.get('/user/notifications-type');
};

export const readMenuNotificationMessengerService = () => {
    return axios.patch('/user/notification/messenger/open');
};

export const readMenuNotificationOtherService = () => {
    return axios.patch('/user/notification/other/open');
};

export const getSearchUserService = ({ keyWord, PageIndex, PageSize }) => {
    return axios.get('/user/SearchUser', {
        params: {
            keyword: keyWord,
            PageIndex: PageIndex,
            PageSize: PageSize,
        },
    });
};

export const getAllUserForAdmin = async (userName = "", phoneNumber = "", email = "", pageNumber, pageSize) => {
    return await axios.get('/user/get-all-users-admin', {
        params: {
            userName,
            phoneNumber,
            email,
            pageNumber,
            pageSize,
        }
    });
};