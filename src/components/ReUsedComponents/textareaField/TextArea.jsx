import React from "react";
import './textarea.css'

function TextArea(props) {
    const { label, name, defaultValue, handleChange, error, readOnly } = props;

    return (
        <div className="textarea">

            <div className="textarea-group">
                <label class="form-label" >{label}</label>
                <textarea
                    minLength="1"
                    name={name}
                    className="text-control"
                    onChange={handleChange}
                    defaultValue={defaultValue}
                    disabled={readOnly}
                ></textarea>
                <span id="error">{error}</span>
            </div>
        </div>
    )

}

export default TextArea