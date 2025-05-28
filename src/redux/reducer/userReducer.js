import { SAVE_USER_INFO, CLEAR_USER_INFO } from '../actions/userActions';

const initialState = {
    id: null,
    userName: null,
    email: null,
    phoneNumber: null,
    about: null,
    about: null,
    avatarUrl: null,
    university: null,
    address: null,
    work: null,
    isActive: false,
    gender: null,
    age: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_USER_INFO:
            return {
                ...state,
                ...Object.keys(action.payload || {}).reduce((acc, key) => {
                    if (action.payload[key] !== null) {
                        acc[key] = action.payload[key];
                    }
                    return acc;
                }, {}),
            };
        case CLEAR_USER_INFO:
            return {
                id: null,
                userName: null,
                email: null,
                phoneNumber: null,
                about: null,
                about: null,
                avatarUrl: null,
                university: null,
                address: null,
                work: null,
                isActive: false,
                gender: null,
                age: null,
            };
        default:
            return state;
    }
};

export default userReducer;
