import axios from '~/utils/axios';

export const submitPostService = ({ content = '', images = [] }) => {
    return axios.post(`/Post`, {
        content,
        images,
    });
};

export const getAllPostsService = (pageIndex, pageSize) => {
    return axios.get('/Post/All', {
        params: {
            pageIndex,
            pageSize,
        },
    });
};
export const getAllUserPostsService = async (userId, pageIndex, pageSize) => {
    var postUser = await axios.get(`/Post/User`, {
        params: {
            userId,
            pageIndex,
            pageSize,
        },
    });
    return postUser;
};

export const getAllEmotionsService = () => {
    return axios.get('/Post/AllEmotion');
};

export const releaseEmotionPostService = ({ postId, emotionId }) => {
    return axios.put(`/Post/emotion/${postId}`, { emotionTypeId: emotionId });
};

export const cancelReleasedEmotionPostService = ({ postId }) => {
    return axios.delete(`/Post/emotion/${postId}`);
};

export const releaseEmotionCommentService = ({ postId, emotionId }) => {
    return axios.put(`/Comment/emotion/${postId}`, { emotionTypeId: emotionId });
};

export const cancelReleasedEmotionCommentService = ({ postId }) => {
    return axios.delete(`/Comment/emotion/${postId}`);
};

export const getMyPostService = (userId) => {
    return axios.get(`/Post/user/${userId}`);
};

export const sendCommentService = ({ postId, parentCommentId = null, content }) => {
    return axios.post('/Comment', {
        postId,
        parentCommentId,
        content,
    });
};

export const getCommentsService = ({ postId, sortField = 'createdAt', sortType = 'DESC' }) => {
    return axios.get(`/Comment/${postId}`, {
        params: {
            sortField,
            sortType,
        },
    });
};

export const postsNotApprovedService = () => {
    return axios.get('/post/not-approved');
};

export const RemovePost = (postId) => {
    return axios.post(`/post/deletePost/${postId}`);
};
