import React, { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom';
import './loginpage.css'

import { loginUser } from '../../apis/Session';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, setUserToken, setLoginState } from '../../redux/SessionSlice';
import { Helmet } from 'react-helmet'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {

    const dispatch = useDispatch()
    const loginPending = useSelector((state) => state.action)
    let navigate = useNavigate()

    const [user, setUser] = useState()
    const [formErrors, setFormErrors] = useState()


    // Handling setting user info
    const handleOnChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const loading = () => {
        return <div class="lds-dual-ring"></div>
    }

    // Handling form validation
    const validate = () => {
        let errors = {}

        if (!user?.username) {
            errors['username'] = 'Username is required!'
        }
        // else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(user.username)) {
        //      errors['username'] = 'Invalid email address. E.g. example@email.com'
        // }
        if (!user?.password) {
            errors['password'] = 'Password is required!'
        }
        setFormErrors(errors)
        return errors
    };

    // Handling user login
    const handleLoginUser = () => {
        if (Object.keys(validate(user)).length === 0) {
            loginUser(dispatch, user).then((resp) => {
                if (resp?.status === 200) {
                    localStorage.setItem("token", resp.data.token)
                    localStorage.setItem("userinfo", JSON.stringify(resp.data.user))
                    localStorage.setItem("loginState", true)
                    dispatch(setUserToken(localStorage.getItem("token")))
                    dispatch(setUserInfo(JSON.parse(localStorage.getItem("userinfo"))))
                    dispatch(setLoginState(JSON.parse(localStorage.getItem("loginState"))))
                    toast.success("Login successful", { theme: "colored" })
                    navigate('/app/dashboard')
                }
                if (resp?.response?.status === 401) {
                    toast.error("Invalid username or password!", { theme: "colored" })
                }

                else {
                    toast.warning("Something went wrong.Check your connection!", { theme: "colored" })
                }

            })
        }
    }


    return (
        <div className='login-page'>
            <Helmet> <title>Login | Lipachat</title> </Helmet>
            <div className='left-side'>
                <div className='left-content'>
                    <img src={process.env.PUBLIC_URL + "/images/lipachat-logo.png"} alt="welcome-logo" className="login-lipachat-logo" />
                    <p className='left-content-header'>Do More on WhatsApp with Lipachat's Bulk Whatsapp Messenger</p>
                    <ul id='content-list'>
                        <li id='content-item'>Send broadcasts to all your contacts in minutes</li>
                        <li id='content-item'>Manage your contacts</li>
                        <li id='content-item'>Save money by saving time</li>
                    </ul>
                    <a id='website-link' href='https://lipachat.com' target="_blank" rel="noreferrer">LEARN MORE</a>
                </div>
            </div>

            <div className='login-form-section'>
                <form className='login-form'>
                    <p className='welcome-header'>Welcome Back :)</p>
                    <p className="login-title2">Use Your Credentials To Login</p>

                    <div className='input-group'>
                        <label className='login-label'>Username</label>
                        <input type="email" name='username' className='login-input' onChange={(e) => handleOnChange(e)} />
                        <span id='form-error'>{formErrors?.username}</span>
                    </div>

                    <div className='input-group'>
                        <label className='login-label'>Password</label>
                        <input type="password" name='password' className='login-input' onChange={(e) => handleOnChange(e)} />
                        <span id='form-error'>{formErrors?.password}</span>
                    </div>
                    <NavLink to="/reset-password" className="forgot-link">Forgot Your Password?</NavLink>

                    <div>
                        {!loginPending.pending ?
                            <button type='button' className="login-button" onClick={handleLoginUser}>Login</button> :
                            <button type='button' className="login-disable" disabled="disabled">{loading()}</button>
                        }
                    </div>

                    <div className='login-actions'>
                        <p className="signup-section">New on our platform? <NavLink to="/auth/signup" className="signup-link">Sign Up Here</NavLink></p>
                    </div>
                </form>
            </div>


            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}

export default LoginPage