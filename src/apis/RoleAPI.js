import axios from "axios";
import { actionStart, actionSuccess, actionFailed } from "../redux/ActionSlice";



export const getAllRoles = async (dispatch) => {
    dispatch(actionStart())
    try {
        const resp = await axios.get(process.env.REACT_APP_BASE_URL + '/role', {
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

// export const createRole = async (role, dispatch) => {
//     dispatch(actionStart())
//     try {
//         const resp = await axios.post(process.env.REACT_APP_BASE_URL + '/role', role, {
//             headers: {
//                 'accept': 'application/json',
//                 'content-type': 'application/json',
//                 'Authorization': 'Bearer ' + localStorage.getItem('token')
//             }
//         })
//         dispatch(actionSuccess())
//         return resp
//     } catch (err) {
//         dispatch(actionFailed())
//         return err
//     }
// }


// export const updateRole = async (role, dispatch) => {
//     dispatch(actionStart())
//     try {
//         const resp = await axios.put(process.env.REACT_APP_BASE_URL + '/role/', role, {
//             headers: {
//                 'accept': 'application/json',
//                 'content-type': 'application/json',
//                 'Authorization': 'Bearer ' + localStorage.getItem('token')
//             }
//         })
//         dispatch(actionSuccess())
//         return resp
//     } catch (err) {
//         dispatch(actionFailed())
//         console.log(err)
//         return err
//     }
// }


// export const deleteRole = async (role, dispatch) => {
//     dispatch(actionStart())
//     try {
//         const resp = await axios.delete(process.env.REACT_APP_BASE_URL + '/role', role, {
//             headers: {
//                 'accept': 'application/json',
//                 'content-type': 'application/json',
//                 'Authorization': 'Bearer ' + localStorage.getItem('token')
//             }
//         });
//         dispatch(actionSuccess())
//         return resp
//     } catch (err) {
//         dispatch(actionFailed())
//         console.log(err)
//         return err
//     }
// }

