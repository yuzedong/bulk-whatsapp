
import axios from "axios";
import { actionStart, actionSuccess, actionFailed } from "../redux/ActionSlice";

export const getAllBroadcasts = async (dispatch, rows, page, search) => {
    dispatch(actionStart())
    try {
        const resp = await axios.get(process.env.REACT_APP_BASE_URL + `/campaign?per_page=${rows}&page=${page}&search=${search}`, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        dispatch(actionSuccess())
        return resp
    } catch (err) {
        dispatch(actionFailed())
        return err
    }
}


export const createBroadcast = async (campaign, dispatch) => {
    dispatch(actionStart())
    try {
       const resp = await axios.post(process.env.REACT_APP_BASE_URL + '/campaign', campaign, {
            headers: {
                'Content-Type':'multipart/form-data',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        dispatch(actionSuccess())
        return resp
    } catch (err) {
        dispatch(actionFailed())
        return err
    }
}

