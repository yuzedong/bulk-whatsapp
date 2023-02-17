import axios from "axios";
import { actionStart, actionSuccess, actionFailed } from "../../redux/ActionSlice";


export const getAllPermissions = async (dispatch) => {
    dispatch(actionStart())
    try {
        const resp = await axios.get(process.env.REACT_APP_BASE_URL + '/permission', {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
            }
        })
        dispatch(actionSuccess())
        return resp
    } catch (err) {
        dispatch(actionFailed(err.response.data.message))
    }
}

export const createPermission = async (permission, dispatch) => {
    dispatch(actionStart())
    try {
        await axios.post(process.env.REACT_APP_BASE_URL + '/permission', permission, {
            headers: {
                'content-type': 'application/json',
            }
        })
        dispatch(actionSuccess())
    } catch (err) {
        dispatch(actionFailed(err.response.data.message))
    }
}


export const updatePermission = async (id, permission, dispatch) => {
    dispatch(actionStart())
    try {
        await axios.put(process.env.REACT_APP_BASE_URL + '/permission/' + id, permission, {
            headers: {
                'content-type': 'application/json',
            }
        })
        dispatch(actionSuccess())
    } catch (err) {
        dispatch(actionFailed(err.response.data.message))
    }
}


export const deletePermission = async (id, dispatch) => {
    dispatch(actionStart())
    try {
        await axios.delete(process.env.REACT_APP_BASE_URL + '/permission/' + id);
        dispatch(actionSuccess())
    } catch (err) {
        dispatch(actionFailed(err.response.data.message))
    }
}