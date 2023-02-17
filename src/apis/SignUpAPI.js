
import axios from "axios";
import { actionStart, actionSuccess, actionFailed } from "../redux/ActionSlice";


export const getTokenDetails = async (dispatch, token) => {
    dispatch(actionStart())
    try {
        const resp = await axios.get(process.env.REACT_APP_BASE_URL + '/registration/'+token, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
            }
        })
        dispatch(actionSuccess())
        return resp
    } catch (err) {
        dispatch(actionFailed())
        return err
    }
}


export const completeRegistration = async (dispatch, user) => {
    dispatch(actionStart())
    try {
        const resp = await axios.post(process.env.REACT_APP_BASE_URL + '/registration/complete', user, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
            }
        })
        dispatch(actionSuccess())
        return resp
    } catch (err) {
        dispatch(actionFailed())
        return err
    }
}


