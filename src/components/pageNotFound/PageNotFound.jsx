import React from 'react'
import './pagenotfound.css'
import { NavLink } from 'react-router-dom'


const PageNotFound = () => {

    return (
        <div id="main">
            <div className="fof">
                <h1>Error 404</h1><br />
                <p>Sorry! The page you were looking for doesn't exist.</p>
                <NavLink className="back-link" to="/app/dashboard">Go back to home</NavLink>
            </div>
        </div>
    )

}

export default PageNotFound