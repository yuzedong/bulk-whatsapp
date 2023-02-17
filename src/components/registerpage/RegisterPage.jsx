import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './register.css'

import { signUpUser } from '../../apis/Session';
import { getCountries } from '../../apis/CountryAPI';
import { useDispatch, useSelector } from 'react-redux';

import { Helmet } from 'react-helmet'
import 'react-toastify/dist/ReactToastify.css';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const RegisterPage = () => {


    const dispatch = useDispatch()
    const action = useSelector((state) => state.action)
    const [countries, setCountries] = useState([])
    const [formErrors, setFormErrors] = useState()

    let navigate = useNavigate()
    const [company, setCompany] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        country: 'Kenya',
        pricing: "Default",
        credits: 0,
        adminName: '',
        adminPhoneNumber: '',
        adminEmail: ''
    });

    const handleOnChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        getCountries(dispatch).then(resp => {
            if (resp?.status === 200) {
                resp.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
                setCountries(resp?.data)
            }
        })

    }, [dispatch])


    const loading = () => {
        return <div class="lds-dual-ring"></div>
    }

    const validate = () => {
        let errors = {}
        if (!company?.name) {
            errors['name'] = 'Name is required!'
        }
        if (!company?.email) {
            errors['email'] = 'Email is required!'
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(company.email)) {
            errors['email'] = 'Invalid email address. E.g. example@email.com'
        }
        if (!company?.phoneNumber) {
            errors['number'] = 'Number is required!'
        }

        if (!company?.adminName) {
            errors['adminName'] = 'Admin name is required!'
        }
        if (!company?.phoneNumber) {
            errors['adminNumber'] = 'Admin Number is required!'
        }
        if (!company?.adminEmail) {
            errors['adminEmail'] = 'Admin Email is required!'
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(company?.adminEmail)) {
            errors['adminEmail'] = 'Invalid email address. E.g. example@email.com'
        }
        setFormErrors(errors)
        return errors
    };

    // const handleCloseModal = () => {
    //     setCompany({
    //         name: '',
    //         email: '',
    //         phoneNumber: '',
    //         country: 'Kenya',
    //         pricing: "Default",
    //         credits: 0,
    //         adminName: '',
    //         adminPhoneNumber: '',
    //         adminEmail: ''
    //     })
    //     setFormErrors([])
    //     document.getElementById("form-modal").reset();
    // }

    const handleSignUpUser = () => {
        if (Object.keys(validate()).length === 0) {
            signUpUser(company, dispatch).then(resp => {
                if (resp?.status === 200) {
                    if (resp?.data.error === false) {
                        toast.success(resp?.data.message, { theme: "colored" })
                        setTimeout(() => {
                            navigate('/auth/login')
                          }, 6000);
                       
                    }
                    else { toast.warning(resp?.data.message, { theme: "colored" }) }
                }
                else { toast.error("Error occured!", { theme: "colored" }) }
            })
        }
    }

    return (
        <div className='signup-page'>
            <Helmet> <title>Sign Up | Lipachat</title> </Helmet>


            <div className='signup-left-side'>
                <div className='left-content'>
                    <img src={process.env.PUBLIC_URL + "/images/lipachat-logo.png"} alt="welcome-logo" className="signup-lipachat-logo" />
                    <p className='left-content-header'>Do More on WhatsApp with Lipachat's Bulk Whatsapp Messenger</p>
                    <ul id='content-list'>
                        <li id='content-item'>Send broadcasts to all your contacts in minutes</li>
                        <li id='content-item'>Manage your contacts</li>
                        <li id='content-item'>Save money by saving time</li>
                    </ul>
                    <a id='website-link' href='https://lipachat.com' target="_blank" rel="noreferrer">LEARN MORE</a>
                </div>
            </div>

            <div className='signup-form-section'>
                <form id='form-modal' className='signup-form'>
                    <p className='welcome-header'>Create Account</p>

                    <div className='signup-input-group'>
                        <label className='signup-label'>Company Name*</label>
                        <input type="text" name='name' className='signup-input' onChange={(e) => handleOnChange(e)} />
                        <span id='form-error'>{formErrors?.name}</span>
                    </div>

                    <div className='signup-input-group'>
                        <label className='signup-label'>Email*</label>
                        <input type="email" name='email' className='signup-input' onChange={(e) => handleOnChange(e)} />
                        <span id='form-error'>{formErrors?.email}</span>
                    </div>

                    <div className='inputs-section'>
                        <div className="signup-input-group">
                            <label className='signup-label'>Country*</label>
                            <select name='country' className='signup-input' defaultValue={'Kenya'} onChange={(e) => handleOnChange(e)}>
                                <option selected disabled hidden value="Kenya">Kenya</option>
                                {countries.map((country, id) =>
                                    <option id='option' key={id} style={{ fontSize: '14px' }} value={country.name.common}>{country.name.common}</option>
                                )}
                            </select>
                            <span className="error">{formErrors?.country}</span>
                        </div>

                        <div className='signup-input-group'>
                            <label className='signup-label'>Phone Number*</label>
                            <input type="text" name='phoneNumber' className='signup-input' placeholder='Example: 254712123456'
                                onChange={(e) => handleOnChange(e)} />
                            <span id='form-error'>{formErrors?.number}</span>
                        </div>
                    </div>

                    <div className='signup-input-group'>
                        <label className='signup-label'>Admin Name*</label>
                        <input type="text" name='adminName' className='signup-input' onChange={(e) => handleOnChange(e)} />
                        <span id='form-error'>{formErrors?.adminName}</span>
                    </div>

                    <div className='signup-input-group'>
                        <label className='signup-label'>Admin Phone Number*</label>
                        <input type="text" name='adminPhoneNumber' className='signup-input' placeholder='Example: 254712123456'
                            onChange={(e) => handleOnChange(e)} />
                        <span id='form-error'>{formErrors?.adminNumber}</span>
                    </div>

                    <div className='signup-input-group'>
                        <label className='signup-label'>Admin Email*</label>
                        <input type="email" name='adminEmail' className='signup-input' onChange={(e) => handleOnChange(e)} />
                        <span id='form-error'>{formErrors?.adminEmail}</span>
                    </div>

                    <div>
                        {!action.pending ?
                            <button type='button' className="login-button" onClick={handleSignUpUser}>Sign Up</button> :
                            <button type='button' className="login-disable" disabled="disabled">{loading()}</button>
                        }
                    </div>

                    <div className='signup-actions'>
                        <p className="signup-section">Already a Member? <NavLink to="/auth/login" className="login-link">Login</NavLink></p>
                    </div>

                </form>
            </div>


            <ToastContainer
                position="top-right"
                autoClose={5000}
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

export default RegisterPage