import React, { useState, useEffect } from 'react'
import './profile.css'

import Input from '../ReUsedComponents/inputField/Input'
import SubmitButton from '../ReUsedComponents/submitButton/SubmitButton';

import { updateUser } from '../../apis/UsersAPI';
import { getAllRoles } from '../../apis/RoleAPI';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dateFormat from 'dateformat';

const Profile = () => {

    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.session.user)
    const action = useSelector((state) => state.action)

    const [user, setUser] = useState(userInfo);
    const [roles, setRoles] = useState([])
    const [formErrors, setFormErrors] = useState()

    const handleOnChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }


    //////////GETTING ALL USERS/ROLES//////////
    useEffect(() => {
        getAllRoles(dispatch).then(resp => {
            if (resp?.status === 200) { setRoles(resp?.data) }
            else { toast.error("Unabled to fetch roles!", { theme: "colored" }) }
        })
    }, [dispatch])

    //////////VALIDATING FORM//////////
    const validate = () => {
        let errors = {}
        if (!user?.name) {
            errors['name'] = 'Name is required!'
        }
        if (!user?.phoneNumber) {
            errors['number'] = 'Number is required!'
        }
        if (!user?.username) {
            errors['username'] = 'Email is required!'
        }
      
        if (!user?.roleId) {
            errors['role'] = 'Role is required!'
        }
        setFormErrors(errors)
        return errors
    };

    //////////UPDATE USER//////////
    const handleUpdateUser = () => {
        if (Object.keys(validate()).length === 0) {
            updateUser(user, dispatch).then(resp => {
                if (resp?.status === 200) {
                    toast.success("Updated successful!", { theme: "colored" })
                    window.location.reload()
                }
                else { toast.error("Unable to update!", { theme: "colored" }) }
            })
        }
    }

    return (

        <div className='table-list-page'>
            <Helmet> <title>My Profile | Lipachat</title> </Helmet>
            <div className='page-header-section'>
                <p className='page-title'>Profile<p className='sub-title'>Manage Your Profile</p></p>
            </div>

            <div className='main-profile-section'>
                <div className='user-info-section'>
               
                <i id='user-profile-avatar' className="pi pi-user" />

                    <div>
                    <p id='user-profile-info'><span id='info-header'>Name: </span>{userInfo.name}</p>
                    <p id='user-profile-info'><span id='info-header'>Phone Number: </span>{userInfo.phoneNumber}</p>
                    <p id='user-profile-info'><span id='info-header'>Username: </span>{userInfo.username}</p>
                    <p id='user-profile-info'><span id='info-header'>Role: </span>{userInfo.role.name}</p>
                    <p id='user-profile-info'><span id='info-header'>Company: </span>{userInfo.company.name}</p>
                    <p id='user-profile-info'><span id='info-header'>Created At: </span>{dateFormat(userInfo.createdAt, "dd/mm/yyyy HH:MM")}</p>
                    </div>
                </div>

                {/* ///Profile Edit form */}
                <form className="user-profile-form">
                    <p className='modal-title'>Update Profile</p>
                    <div className="profile-dialog-inputs">
                        <Input label="Name *" name='name' type='text' defaultValue={user?.name} handleChange={(e) => handleOnChange(e)} />
                        <Input label="Phone Number *" name='phoneNumber' defaultValue={user?.phoneNumber} type='number' handleChange={(e) => handleOnChange(e)} />
                        <Input label="Email *" name='username' type='email' defaultValue={user?.username} handleChange={(e) => handleOnChange(e)} />
                        <div className="select-group">
                            <label className='form-label'>Role</label>
                            <select name='roleId' className='select-control' defaultValue={user?.role?.id} onChange={(e) => handleOnChange(e)}>
                                <option value={user?.role?.id}>{user?.role?.name}</option>
                                {roles.map((role, id) =>
                                    <option id='option' key={id} style={{ fontSize: '14px' }} value={parseInt(role?.id)}>{role?.name}</option>
                                )}
                            </select>
                            <span id="error">{formErrors?.role}</span>
                        </div>

                    </div>
                    <div className='dialog-footer'>
                        <SubmitButton pending={action.pending} handleOnSubmit={handleUpdateUser} />
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

export default Profile