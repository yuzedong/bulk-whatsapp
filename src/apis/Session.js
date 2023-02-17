import axios from "axios";
import { actionStart, actionSuccess, actionFailed } from "../redux/ActionSlice";

export const loginUser = async (dispatch, user) => {
  dispatch(actionStart())
  try {
    const resp = await axios.post(process.env.REACT_APP_BASE_URL + '/token', user, {
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

export const signUpUser = async (user, dispatch) => {
  dispatch(actionStart())
  try {
    const resp = await axios.post(process.env.REACT_APP_BASE_URL + '/signup', user, {
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


export const logoutUser = (token) => {
  if (token === null) {
    return 'Token supllied is null'
  }
  const bearerIndex = token.indexOf('Bearer')
  if (bearerIndex !== -1) {
    token = token.substring(6, token.length)
  }

  return axios.get(process.env.REACT_APP_BASE_URL + `/token/logout/${token}`)
}