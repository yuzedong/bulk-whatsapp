import React from 'react'
import './footer.css'


function Footer(){

    return(
        <div className='footer'>
            <p>© {new Date().getFullYear()} Bulk WhatsApp - Lipachat</p> 
        </div>

    );
}

export default Footer