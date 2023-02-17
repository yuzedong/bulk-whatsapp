
import React from 'react'
import './selectField.css'

function SelectField(props){

    const {label, errorMessage ,handleChange, name, value, selects, placeholder} = props


    return(
    <div className="select-group">
        <label className='form-label'>{label}</label>
        <select name={name} className='select-control' value={value} onChange={handleChange} >
        <option disabled style={{fontSize:'14px', opacity: 0.5}} selected value=''>{placeholder}</option>
            {selects.map((select ,id) => 
                 <option id='option' key={id} style={{fontSize:'14px'}} value={value}>{select}</option>
            )}
        </select>
        <span id="error">{errorMessage}</span>
    </div>
    )
    
}

export default SelectField