import axios from "axios";
import { actionStart, actionSuccess, actionFailed } from "../redux/ActionSlice";


export const getGroups = async (dispatch, rows) => {
    dispatch(actionStart())
    try {
        const resp = await axios.get(process.env.REACT_APP_BASE_URL + `/contacts/groups`, {
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