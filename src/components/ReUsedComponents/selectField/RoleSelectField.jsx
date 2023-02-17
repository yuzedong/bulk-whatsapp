
import React, { useState, useEffect } from 'react'
import './selectField.css'
import { getAllRoles } from '../../../apis/RoleAPI';
import { useDispatch } from 'react-redux';


function RoleSelectField({role, handleChange, errorMessage}) {

    const dispatch = useDispatch()
    const [roles, setRoles] = useState([])


// Getting roles//////////
  useEffect(() => {
    getAllRoles(dispatch).then(resp => {
      if (resp?.status === 200) { setRoles(resp?.data) }
    })
  }, [dispatch])

    return (
        <div className="select-group">
            <label className='form-label'>Role*</label>
            <select name='roleId' className='select-control' value={role?.role.id} onChange={handleChange} >
                <option selected disabled hidden value=''>Select Role</option>
                {roles.map((role, id) =>
                    <option id='option' key={id} style={{ fontSize: '14px' }} value={parseInt(role?.id)}>{role?.name}</option>
                )}
            </select>
            <span id="error">{errorMessage}</span>
        </div>
    )

}

export default RoleSelectField