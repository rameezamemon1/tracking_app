import axios from "axios";
import { USER_SAVED, GET_USERS, USER_LOADING, USER_ERROR, PLAY_SOUND } from "./type";
const config = {
    headers: {
        "Content-Type": "application/json",
    }
}
// Add new user
export const addNewUser = (user) => async (dispatch) => {
    dispatch({ type: USER_LOADING });
    try {
        const res = await axios.post("/api/users/add", user, config);
        dispatch({
            type: USER_SAVED,
            payload: res.data
        });
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            dispatch({
                type: USER_ERROR,
                payload: errors.msg
            });
        }

    }
};


// get All Users
export const getAllUsers = () => async (dispatch) => {
    dispatch({ type: USER_LOADING });
    try {
        const res = await axios.get(`/api/users`);
        if (res.data) {
            dispatch({
                type: GET_USERS,
                payload: res.data,
            });
        }
    } catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: err.response,
        });
    }
};

// get All Users
export const getPlay = () => async (dispatch) => {
    const res = await axios.get(`/api/users/play/notification`);
    dispatch({
        type: PLAY_SOUND,
        payload: res.data,
    });
};
export const updatePlay = () => async (dispatch) => {
    const res = await axios.put(`/api/users/play/notification`);
    dispatch({
        type: PLAY_SOUND,
        payload: res.data,
    });
};