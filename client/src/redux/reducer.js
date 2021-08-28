import {
    USER_LOADING,
    USER_ERROR,
    USER_SAVED,
    GET_USERS,
    PLAY_SOUND
} from "./type";

const initialState = {
    users: null,
    loading: false,
    error: {},
    play: false,
    saved: false,
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case USER_LOADING:
            return {
                ...state,
                loading: true,
            };
        case GET_USERS:
            return {
                ...state,
                users: payload,
                loading: false,
                saved: false,

            };
        case USER_SAVED:
            return {
                ...state,
                user: payload,
                saved: true,
                loading: false,
            }
        case PLAY_SOUND:
            return {
                ...state,
                play: payload,
            }

        case USER_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
                saved: false,
            };
        default:
            return state;
    }
}