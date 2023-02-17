import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router";
import './passwordpage.css'

import { getTokenDetails, completeRegistration } from '../../apis/SignUpAPI';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PasswordPage = () => {

    const dispatch = useDispatch()
    const loginPending = useSelector((state) => state.action)
    let navigate = useNavigate()

    const [userPassword, setUserPassword] = useState('')
    const { token } = useParams();
    const [user, setUser] = useState()

    const [formErrors, setFormErrors] = useState()
    
    const loading = () => {
        return <div class="lds-dual-ring"></div>
    }

    useEffect(() => {
        getTokenDetails(dispatch, token).then(resp => {
            setUser({username:resp.data.username, password:userPassword, token: token})
        })
    }, [dispatch, token, userPassword])


    //Handling form validation
    const validate = () => {
        let errors = {}
        if (!user?.password) {
            errors['password'] = 'Password is required!'
        }
        setFormErrors(errors)
        return errors
    };

    const handleViewPassword = () => {
        var x = document.getElementById("myInput");
        if (x.type === "password") {
          x.type = "text";
        } else {
          x.type = "password";
        }
      }

    /////////Handling password setup////////////////
    const handleSetUserPassword = () => {
        if (Object.keys(validate(user)).length === 0) {
            completeRegistration(dispatch, user).then((resp) => {
                if (resp?.status === 200) {
                    toast.success("Registration successful", { theme: "colored" })
                    navigate('/auth/login')
                }
                else {
                    toast.error("Something went wrong.Try again!", { theme: "colored" })
                    console.log(resp)
                    console.log(user)
                }

            })
        }
    }

    return (
        <div className='password-page'>
            <Helmet> <title>Complete Registration | Lipachat</title> </Helmet>

            <div className='password-page-section'>
            
                <div className='password-left-content'>
                <img src={process.env.PUBLIC_URL + "/images/lipachat-logo.png"} alt="welcome-logo" className="password-lipachat-logo" />
                    <p className='password-welcome-header'>Welcome</p>
                    <p className='password-welcome-p'>Setup your password to gain access to your account</p>
                </div>

                <div className='password-form-section'>
                    <form className='password-form'>
                        
                        <p className='password-form-header'>Password Setup</p>
                        <p className='password-form-hint'><strong>Hint: </strong>Your password should be</p>
                        <ul id='password-content-list'>
                            <li id='content-list-item'>6 characters or more</li>
                            <li id='content-list-item'>Have at least 1 Uppercase letter, 1 Lowercase letter and 1 Number</li>
                            <li id='content-list-item'>Should not be a common word</li>
                        </ul>
                        <div className='input-group'>
                            <label className='password-label'>Password</label>
                            <input id="myInput" type="password" name='password' className='password-input' onChange={(e) => setUserPassword(e.target.value)} />
                            <span id='form-error'>{formErrors?.password}</span>

                            <p id="show-password"> 
                            <p><input type="checkbox" onChange={handleViewPassword}/><span>Show Password</span></p>
                            </p>
                           
                        </div>

                        <div>
                            {!loginPending.pending ?
                                <button type='button' className="password-button" onClick={handleSetUserPassword}>Complete Registration</button> :
                                <button type='button' className="password-disable" disabled="disabled">{loading()}</button>
                            }
                        </div>
                    </form>
                </div>
            </div>


            <ToastContainer
                position="top-right"
                autoClose={3000}
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

export default PasswordPage