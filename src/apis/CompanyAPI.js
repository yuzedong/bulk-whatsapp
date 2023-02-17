import axios from "axios";
import { actionStart, actionSuccess, actionFailed } from "../redux/ActionSlice";


export const getAllCompanies = async (dispatch, rows, page, search) => {
    dispatch(actionStart())
    try {
        const resp = await axios.get(process.env.REACT_APP_BASE_URL + `/company?per_page=${rows}&page=${page}&search=${search}`, {
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


export const createCompany = async (company, dispatch) => {
    dispatch(actionStart())
    try {
        const resp = await axios.post(process.env.REACT_APP_BASE_URL + '/company', company, {
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


export const updateCompany = async (company, dispatch) => {
    dispatch(actionStart())
    try {
        const resp = await axios.put(process.env.REACT_APP_BASE_URL + '/company', company, {
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

export const activateCompany = async (id, dispatch) => {
    dispatch(actionStart())
    try {
        const resp = axios({ method: 'put', url: process.env.REACT_APP_BASE_URL + `/company/activate/${id}`, 
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
        dispatch(actionSuccess())
        return resp
    } catch (err) {
        dispatch(actionFailed())
        return err
    }
}


export const deactivateCompany = async (id, dispatch) => {
    dispatch(actionStart())
    try {
        const resp = axios({ method: 'put', url: process.env.REACT_APP_BASE_URL + `/company/deactivate/${id}`, 
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
        dispatch(actionSuccess())
        return resp
    } catch (err) {
        dispatch(actionFailed())
        return err
    }
}