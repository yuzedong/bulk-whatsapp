import axios from "axios";
import { actionStart, actionSuccess, actionFailed } from "../redux/ActionSlice";

export const getAllMessages = async (dispatch, rows, page, search) => {
    dispatch(actionStart())
    try {
        const resp = await axios.get(process.env.REACT_APP_BASE_URL + `/message?per_page=${rows}&page=${page}&search=${search}`, {
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


export const getAllMessagesByCampaign = async (dispatch, campaign, rows, page) => {
    dispatch(actionStart())
    try {
        const resp = await axios.get(process.env.REACT_APP_BASE_URL + `/message/${campaign}?per_page=${rows}&page=${page}&search=`, {
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
