import axios from "axios";
import { actionStart, actionSuccess, actionFailed } from "../redux/ActionSlice";


export const getAllUsers = async (dispatch, rows, page, search) => {
    dispatch(actionStart())
    try {
        const resp = await axios.get(process.env.REACT_APP_BASE_URL + `/user?per_page=${rows}&page=${page}&search=${search}`, {
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


export const createUser = async (user, dispatch) => {
    dispatch(actionStart())
    try {
        const resp = await axios.post(process.env.REACT_APP_BASE_URL + '/user', user, {
            headers: {
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


export const updateUser = async (user, dispatch) => {
    dispatch(actionStart())
    try {
        const resp = axios.put(process.env.REACT_APP_BASE_URL + '/user/', user, {
            headers: {
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


// export const deleteUser = async (id, dispatch) => {
//     dispatch(actionStart())
//     try {
//         await axios.delete(process.env.REACT_APP_BASE_URL + '/user/' + id);
//         dispatch(actionSuccess())
//     } catch (err) {
//         dispatch(actionFailed(err.response.data.message))
//     }
// }



// export const getUserInfo = async (token, dispatch) => {
//     const cancelToken = axios.CancelToken.source()
//     dispatch(actionStart())
//     try {
//         const resp = await axios.get(process.env.REACT_APP_BASE_URL + '/user/' + token, {
//             cancelToken: cancelToken.token,
//             headers: {
//                 'accept': 'application/json',
//                 'content-type': 'application/json',
//                 'Authorization': 'Bearer ' + sessionStorage.getItem('token')
//             }
//         });
//         return resp
//     } catch (err) {
//         dispatch(actionFailed())
//         return err
//     }
// }

export const completeRegistration = async (user, dispatch) => {
    const cancelToken = axios.CancelToken.source()
    try {
        return await axios.get(process.env.REACT_APP_BASE_URL + '/registration/complete' + user, {
            cancelToken: cancelToken.token,
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
            }
        });
    } catch (err) {
        dispatch(actionFailed())
        return err
    }
}