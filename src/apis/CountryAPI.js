
import axios from "axios";
import { actionStart, actionSuccess, actionFailed } from "../redux/ActionSlice";

export const getCountries = async (dispatch) => {
    dispatch(actionStart())
    try {
        const resp = axios.get('https://restcountries.com/v3.1/all');
        dispatch(actionSuccess())
        return resp
    } catch (err) {
        dispatch(actionFailed())
        return err
    }
}