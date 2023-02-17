import React, { useEffect, useState } from "react";
import './navbar.css'

import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { logoutUser } from "../../apis/Session";
import { logout } from "../../redux/SessionSlice";
import { getCompanyCredits } from "../../apis/Analytics";

import { useDispatch, useSelector } from 'react-redux';


const Navbar = ({ toggleSideBar }) => {

  const userData = useSelector(state => state.session)
  const dispatch = useDispatch()
  let navigate = useNavigate()

  const [credits, setCredits] = useState(0)

  useEffect(() => {
    getCompanyCredits(dispatch).then(resp => {
      if (resp?.status === 200) { setCredits(resp?.data) }
    })

  }, [dispatch])

  const handleLogout = () => {
    localStorage.clear()
    dispatch(logout())
    logoutUser(userData.token)
    navigate('/auth/login')
  }

  const togleProfileMenu = () => {
    var x = document.getElementById("myProfile");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

  return (
    <div className="navbar">

      <div className="toggle-section">
         <i onClick={toggleSideBar} id='toggle-icon' className="pi pi-bars" style={{ 'fontSize': '1.5em' }} />
        
         <p className="company-name">
         <i className="pi pi-building" id='company-icon'/>
          {userData?.user?.company?.name} <span> <i className="pi pi-phone" id='company-icon'/></span>
          {userData?.user?.company?.phoneNumber? " "+ userData?.user?.company?.phoneNumber : 'none' }
          </p>
        
         
      </div>

      <div className="widgets-section">

        <div className="topup-section">
          <div class="credit-balance">
            <p class="credit">Balance</p>
            <span id="balance">KES {credits}</span>
          </div>
          <NavLink className="topup-btn" to="/app/topup"><i className="pi pi-wallet" style={{ 'fontSize': '1em', 'paddingRight':'4px' }} />Top Up</NavLink>
        </div>

        <div className="dropdown-section">
          <div onClick={togleProfileMenu} className="dropdown-trigger">
            <i id='profile-avatar' className="pi pi-user" style={{ 'fontSize': '1.5em' }} />
            <div className="profile-details">
              <span className="profile-name">{userData.user?.name}</span><br />
              <span className="role-name">{userData.user?.role.name}</span>
            </div>
          </div>

          <div id="myProfile" className="dropdown-menu-container">
            <div className="dropdown-menu">
              <NavLink className="dropdown-menu-item" to="/app/account/profile">
                <i className="pi pi-user" id="dropdown-icon" /> My Profile</NavLink>

              <p onClick={handleLogout} className="dropdown-menu-item logout">
                <i className="pi pi-sign-out" id="dropdown-icon" /> Logout</p>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default Navbar