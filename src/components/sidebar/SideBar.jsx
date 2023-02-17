
import React from 'react'
import './sidebar.css'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux';

const SideBar = ({ idName }) => {

  const session = useSelector(state => state.session)

  const togleMenu = () => {
    var x = document.getElementById("list-group-items");
    var y = document.getElementById("arrow");
    if (x.style.display === "block") {
      x.style.display = "none";
      y.style.transform = "rotate(0deg)";
    } else {
      x.style.display = "block";
      y.style.transform = "rotate(90deg)";
    }
  }

  return (
    <div id={ idName} className='sidebar'>

      <div href='/app/dashboard' className='logo-link'>
        <img src={process.env.PUBLIC_URL + "/images/lipachat-logo.png"} alt="lipachat" className="company-logo" />
      </div>

      {/* ...........DASHBOARD SECTION........... */}

      <NavLink to='/app/dashboard' className='heading-link'>
        <i className="pi pi-chart-bar" id='h-icon' /> Dashboard
      </NavLink>

      <NavLink to='/app/contacts' className='heading-link'>
        <i className="pi pi-users" id='h-icon' />Contacts
      </NavLink>

      <NavLink to='/app/campaigns' className='heading-link'>
        <i className="pi pi-megaphone" id='h-icon' />Campaigns
      </NavLink>

      {session.user?.role.name === 'Admin' && session.user?.company.name === "Lipachat" ?
        <NavLink to='/app/company' className='heading-link'>
          <i className="pi pi-building" id='h-icon' />Company
        </NavLink> : ''}

      <NavLink to='/app/messages' className='heading-link'>
        <i className="pi pi-comment" id='h-icon' />Messages
      </NavLink>

      <NavLink to='/app/billing' className='heading-link'>
        <i className="pi pi-credit-card" id='h-icon' />Billing
      </NavLink>


      <div className='submenu-list-item'>
        <h3 onClick={togleMenu} className='menu-title'>
          <p className='submenu-title'><i className="pi pi-user-edit" id="h-icon" />User Management</p>
          <i className="pi pi-chevron-right" id="arrow" />
        </h3>
        <div id='list-group-items'>
          <NavLink to='/app/users' className='sidebar-item'>
            <i className="pi pi-users" id='icons' /> User List</NavLink>
          {/* <NavLink to='/app/roles' className='sidebar-item'>
                    <i className="pi pi-id-card" id='icons'/> Roles</NavLink> */}
        </div>
      </div>



    </div>
  )

}

export default SideBar