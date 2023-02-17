import React from "react";
import './input.css'


const Input = (props) => {
    const { label, errorMessage, handleChange, ...inputProps } = props;

    return (
        <div className="FormInput">
            <div className="form-group">
                <label className="form-label" >{label}</label>
                <input className="form-control" onChange={handleChange} {...inputProps} />
                <span id="error">{errorMessage}</span>
            </div>
        </div>
    )

}

export default Input