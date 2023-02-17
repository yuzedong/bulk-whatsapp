import axios from "axios";
import { actionStart, actionSuccess, actionFailed } from "../redux/ActionSlice";


export const getAllContacts = async (dispatch, rows, page, search) => {
    dispatch(actionStart())
    try {
        const resp = await axios.get(process.env.REACT_APP_BASE_URL + `/contacts?per_page=${rows}&page=${page}&search=${search}`, {
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


export const createContact = async (contact, dispatch) => {
    dispatch(actionStart())
    try {
        const resp = await axios.post(process.env.REACT_APP_BASE_URL + '/contacts', contact, {
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


export const updateContact = async (contact, dispatch) => {
    dispatch(actionStart())
    try {
        const resp = await axios.put(process.env.REACT_APP_BASE_URL + '/contacts', contact, {
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

export const contactsBulkImport = async (contactsFile, dispatch) => {
    dispatch(actionStart())
    try {
        const resp = await axios.post(process.env.REACT_APP_BASE_URL + '/contacts/bulk', contactsFile, {
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


export const deleteContact = async (contact, dispatch) => {
    dispatch(actionStart())
    try {
        const resp = axios({ method: 'delete', url: process.env.REACT_APP_BASE_URL + '/contacts', data: contact, 
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
        dispatch(actionSuccess())
        return resp
    } catch (err) {
        console.log(err)
        dispatch(actionFailed())
        return err
    }
}