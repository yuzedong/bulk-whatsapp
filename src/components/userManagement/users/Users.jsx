import React, { useState, useEffect } from 'react'
import '../../globalStyles/table.css'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Input from '../../ReUsedComponents/inputField/Input'
import SubmitButton from '../../ReUsedComponents/submitButton/SubmitButton';
import Loading from '../../ReUsedComponents/loadingScreen/Loading';
import RoleSelectField from '../../ReUsedComponents/selectField/RoleSelectField'

import { getAllUsers, createUser, updateUser } from '../../../apis/UsersAPI';
import { useDispatch, useSelector } from 'react-redux';
import { openCreateModal, openViewModal, closeModal } from '../../../redux/ModalSlice.js';
import { Helmet } from 'react-helmet'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Users = () => {

  const dispatch = useDispatch()
  const selector = useSelector((state) => state.modal)
  const action = useSelector((state) => state.action)

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10)
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('')
  const [formErrors, setFormErrors] = useState()

  const [allUsers, setAllUsers] = useState([])
  const [user, setUser] = useState({name: '', username: '', phoneNumber: '', roleId: '' });


  const handleOnChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  //Validating form
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
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(user.username)) {
      errors['username'] = 'Invalid email address. E.g. example@email.com'
    }
    if (!user?.roleId) {
      errors['role'] = 'Role is required!'
    }
    setFormErrors(errors)
    return errors
  };


  // Close modal
  const handleCloseModal = (dispatch) => {
    setUser({ name: '', username: '', phoneNumber: '', roleId: '' })
    setFormErrors([])
    document.getElementById("form-modal").reset();
    dispatch(closeModal())
  }

  // Getting all users
  useEffect(() => {
    getAllUsers(dispatch, rows, currentPage, searchQuery).then(resp => {
      if (resp?.status === 200) { setAllUsers(resp?.data) }
      else { toast.error("Unable to load data!", { theme: "colored" }) }
    })
  }, [dispatch, rows, currentPage, searchQuery])



  // Creating new user
  const handleCreateUser = () => {
    if (Object.keys(validate()).length === 0) {
      createUser(user, dispatch).then(resp => {
        if (resp?.status === 200) {
          handleCloseModal(dispatch)
          toast.success("Created successful!", { theme: "colored" })
          window.location.reload()
        }
        else { toast.error("Email already exists!", { theme: "colored" }) }
      })
    }
  }

  // Getting single user info
  const handleGetUser = (userInfo) => {
    setUser(userInfo)
    dispatch(openViewModal())
  }


  // Updating user
  const handleUpdateUser = () => {
    if (Object.keys(validate()).length === 0) {
      updateUser(user, dispatch).then(resp => {
        if (resp?.status === 200) {
          handleCloseModal(dispatch)
          toast.success("Updated successful!", { theme: "colored" })
          window.location.reload()
        }
        else { toast.error("Unable to update!", { theme: "colored" }) }
      })
    }
  }


  const actionsBodyTemplate = (rowData) => {
    return <div className='table-actions'>
      <i onClick={() => handleGetUser(rowData)} id="edit-action-icon" className="pi pi-pencil"></i>
    </div>
  }

  const paginationTemplate = {
    layout: 'RowsPerPageDropdown CurrentPageReport',
    'RowsPerPageDropdown': (options) => {
      const dropdownOptions = [10, 20, 50, 100]

      return (
        <div>
          <label className='form-label'>Items per page: </label>
          <select type='number' className='rows-select-field' value={rows} onChange={(e) =>{setCurrentPage(1); setRows(e.target.value)}}>
            {dropdownOptions.map((select, id) =>
              <option id='option' key={id} style={{ fontSize: '14px' }} type='number' value={select}>{select}</option>
            )}
          </select>
        </div>
      );
    },
    'CurrentPageReport': (options) => {
      return (
        <div  style={{ display: 'flex', width: '200px', alignItems: 'center', textAlign: 'center'  }}>

          <span style={{  width: '200px'}}>Page {currentPage} of {allUsers.totalPages}</span>

          <span  style={{ display: 'flex', width: '150px', alignItems: 'center', textAlign: 'center'  }}>
          {currentPage === 1 ? '' :
          <i onClick={() => setCurrentPage(currentPage - 1)} className="pi pi-angle-left"
            style={{ width: '40px', cursor: 'pointer', 'fontSize': '1.1em', 'display': 'flex', 'textAlign': 'center' }} />}

            {currentPage === allUsers.totalPages ? '' :
              <i onClick={() => setCurrentPage(currentPage + 1)} className="pi pi-angle-right"
                style={{ width: '40px', cursor: 'pointer', 'fontSize': '1.1em', 'display': 'flex', 'textAlign': 'center' }} />}
          </span>
        </div>
      )
    },
  };

  return (

    <div className='table-list-page'>
      <Helmet> <title>Users | Lipachat</title> </Helmet>

      <div className='page-header-section'>
        <p className='page-title'>User List<p className='sub-title'>Manage Your Users</p></p>
        <button onClick={() => dispatch(openCreateModal())} type='button' className='create-btn'><i id="btn-icon" className="pi pi-plus"></i> Add New User</button>
      </div>

      <div className='data-table'>
        <div className='table-toolbar'>
          
        <div></div>
          <div className='search-table-input'>
            <span id='search-icon' class="material-symbols-outlined">search</span>
            <input type='text' className="s-table-input" placeholder='Search this table' onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

        </div>
        {action.pending || allUsers.length === 0? <Loading /> :
          <DataTable value={allUsers.data} removableSort responsive="true" rows={rows} responsiveLayout="stack" breakpoint="1200px"
            paginator paginatorTemplate={paginationTemplate} first={first} onPage={(event) => { setFirst(event.first); setRows(event.rows) }} paginatorClassName="justify-content-end">
            <Column field="name" header="Name" sortable />
            <Column field="username" header="Email" sortable />
            <Column field="phoneNumber" header="Phone Number" sortable />
            <Column field="role.name" header="Role" sortable />
            <Column header="Actions" body={actionsBodyTemplate} />
          </DataTable>}
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

      {/* /////////////////////CREATING MODAL //////////// */}
      <div className={selector.create ? 'create-modal-active' : 'create-modal-inactive'} >
        <form id="form-modal" className='view-modal-content'>
          <p className='modal-title'> Create
          <i id='close-button' className="pi pi-times" onClick={() => handleCloseModal(dispatch)} /></p>
          <div className="dialog-inputs">
            <Input label="Name *" name='name' type='text' errorMessage={formErrors?.name}
              handleChange={(e) => handleOnChange(e)} />
            <Input label="Email *" name='username' type='email' errorMessage={formErrors?.username}
              handleChange={(e) => handleOnChange(e)} />
            <Input label="Phone Number *" name='phoneNumber' type='text' errorMessage={formErrors?.number}
              handleChange={(e) => handleOnChange(e)} placeholder="Example: 254123456789"/>
            <RoleSelectField errorMessage={formErrors?.role} handleChange={(e) => handleOnChange(e)} />
          </div>
          <div className='dialog-footer'>
            <SubmitButton pending={action.pending} handleOnSubmit={handleCreateUser} />
          </div>
        </form>
      </div>


      {/* /////////////////////EDITNG MODAL //////////// */}

      <div className={selector.view ? 'view-modal-active' : 'view-modal-inactive'}>
        <form id="form-modal" className='view-modal-content'>
          <p className='modal-title'> Edit
            <span id='close-button' onClick={() => handleCloseModal(dispatch)}
              class="material-symbols-outlined">close</span> </p>
          <div className="dialog-inputs">
            <Input label="Name *" name='name' type='text' value={user?.name}
              errorMessage={formErrors?.name} handleChange={(e) => handleOnChange(e)} />
            <Input label="Email *" name='username' type='email' value={user?.username}
              errorMessage={formErrors?.username} handleChange={(e) => handleOnChange(e)} />
            <Input label="Phone Number *" name='phoneNumber' value={user?.phoneNumber} type='number'
              errorMessage={formErrors?.number} handleChange={(e) => handleOnChange(e)} />
            <RoleSelectField errorMessage={formErrors?.role} handleChange={(e) => handleOnChange(e)} />
          </div>
          <div className='dialog-footer'>
            <SubmitButton pending={action.pending} handleOnSubmit={handleUpdateUser} />
          </div>
        </form>
      </div>


    </div>

  );
}

export default Users