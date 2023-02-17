import React, { useState, useEffect } from 'react'
import '../globalStyles/table.css'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Input from '../ReUsedComponents/inputField/Input'
import SubmitButton from '../ReUsedComponents/submitButton/SubmitButton';
import Loading from '../ReUsedComponents/loadingScreen/Loading';
import InputSwitchButton from '../ReUsedComponents/inputSwitchButton/InputSwitchButton';

import { getAllCompanies, createCompany, updateCompany, activateCompany, deactivateCompany } from '../../apis/CompanyAPI';
import { getCountries } from '../../apis/CountryAPI';
import { useDispatch, useSelector } from 'react-redux';
import { openCreateModal, openViewModal, closeModal } from '../../redux/ModalSlice.js';
import { Helmet } from 'react-helmet'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dateFormat from 'dateformat';


const Company = () => {

  const dispatch = useDispatch()
  const selector = useSelector((state) => state.modal)
  const action = useSelector((state) => state.action)

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10)
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('')

  const [viewCompany, setViewCompany] = useState(false)

  const [company, setCompany] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    country: 'Kenya',
    pricing: "Default",
    credits: 0,
    adminName: '',
    adminPhoneNumber: '',
    adminEmail: '',
    token: ''
  });

  const [allCompanies, setAllCompanies] = useState([])
  const [countries, setCountries] = useState([])
  const [formErrors, setFormErrors] = useState()


  const handleOnChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value })
  }

  const handleCloseModal = (dispatch) => {
    setCompany({
      name: '',
      email: '',
      phoneNumber: '',
      country: 'Kenya',
      pricing: "Default",
      credits: 0,
      adminName: '',
      adminPhoneNumber: '',
      adminEmail: ''
    })
    setFormErrors([])
    document.getElementById("form-modal").reset();
    dispatch(closeModal())
  }

  const validate = () => {
    let errors = {}
    if (!company?.name) {
      errors['name'] = 'Name is required!'
    }
    if (!company?.email) {
      errors['email'] = 'Email is required!'
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(company.email)) {
      errors['email'] = 'Invalid email address. E.g. example@email.com'
    }
    if (!company?.phoneNumber) {
      errors['number'] = 'Number is required!'
    }

    if (!company?.adminName) {
      errors['adminName'] = 'Admin name is required!'
    }
    if (!company?.phoneNumber) {
      errors['adminNumber'] = 'Admin Number is required!'
    }
    if (!company?.adminEmail) {
      errors['adminEmail'] = 'Admin Email is required!'
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(company?.adminEmail)) {
      errors['adminEmail'] = 'Invalid email address. E.g. example@email.com'
    }
    setFormErrors(errors)
    return errors
  };


  const validateUpdate = () => {
    let errors = {}
    if (!company?.name) {
      errors['name'] = 'Name is required!'
    }
    if (!company?.email) {
      errors['email'] = 'Email is required!'
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(company.email)) {
      errors['email'] = 'Invalid email address. E.g. example@email.com'
    }
    if (!company?.phoneNumber) {
      errors['number'] = 'Number is required!'
    }
    setFormErrors(errors)
    return errors
  };

  useEffect(() => {
    getAllCompanies(dispatch, rows, currentPage, searchQuery).then(resp => {
      if (resp?.status === 200) { setAllCompanies(resp?.data); }
      else { toast.error("Unable to load data!", { theme: "colored" }) }
    })
    getCountries(dispatch).then(resp => {
      if (resp?.status === 200) {
        resp.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(resp?.data)
      }
    })
  }, [dispatch, rows, currentPage, searchQuery])

 
  const handleCreateCompany = () => {
    if (Object.keys(validate()).length === 0) {
      createCompany(company, dispatch).then(resp => {
        if (resp?.status === 200) {
          if (resp?.data.error === true) {
            toast.warning(resp?.data.message, { theme: "colored" })
          } else {
            handleCloseModal(dispatch)
            toast.success("Created successful!", { theme: "colored" })
            window.location.reload()
          }

        }
        else {
          toast.error("Error occured!", { theme: "colored" })
        }
      })
    }
  }

  const handleUpdateCompany = () => {
    if (Object.keys(validateUpdate()).length === 0) {
      updateCompany(company, dispatch).then(resp => {
        if (resp?.status === 200) {
          handleCloseModal(dispatch)
          toast.success("Updated successful!", { theme: "colored" })
          window.location.reload()
        }
        else { console.log(resp); toast.error("Unable to update!", { theme: "colored" }) }
      })
    }
  }

  const handleActiveStatus = (status, id) => {
    if (status === 1) {
      deactivateCompany(id, dispatch).then(resp => {
        if (resp?.status === 200) {
          handleCloseModal(dispatch)
          toast.success("Deactivated successful!", { theme: "colored" })
          window.location.reload()
        }
        else { console.log(resp); toast.error("Unable to deactivate!", { theme: "colored" }) }
      })
    }
    else if (status === 0) {
      activateCompany(id, dispatch).then(resp => {
        if (resp?.status === 200) {
          handleCloseModal(dispatch)
          toast.success("Activated successful!", { theme: "colored" })
          window.location.reload()
        }
        else { console.log(resp); toast.error("Unable to deactivate!", { theme: "colored" }) }
      })
    }
  }


  const dateBodyTemplate1 = (rowData) => {
    return <span>{dateFormat(rowData.createdAt, "dd/mm/yyyy HH:MM")}</span>
  }

  const dateBodyTemplate2 = (rowData) => {
    return <span>{dateFormat(rowData?.lastActiveDate, "dd/mm/yyyy HH:MM")}</span>
  }

  const activeBodyTempalte = (rowData) => {
    return <div>
      <InputSwitchButton status={rowData.active === 1 ? true : false}
        handleSwitch={() => handleActiveStatus(rowData.active, rowData.id)} />
    </div>
  }

  const actionsBodyTemplate = (rowData) => {
    return <div className='table-actions'>
      <i onClick={() => { setCompany(rowData); dispatch(openViewModal()) }} id="edit-action-icon" class="pi pi-pencil"></i>
      <i onClick={() => { setCompany(rowData); setViewCompany(true); }} id="view-action-icon" class="pi pi-eye"></i>
    </div>
  }


  // Hanlde pagination
  const paginationTemplate = {
    layout: 'RowsPerPageDropdown CurrentPageReport',
    'RowsPerPageDropdown': (options) => {
      const dropdownOptions = [10, 20, 50, 100]

      return (
        <div>
          <label className='form-label'>Items per page: </label>
          <select type='number' className='rows-select-field' value={rows} onChange={(e) => { setCurrentPage(1); setRows(e.target.value) }}>
            {dropdownOptions.map((select, id) =>
              <option id='option' key={id} style={{ fontSize: '14px' }} type='number' value={select}>{select}</option>
            )}
          </select>
        </div>
      );
    },
    'CurrentPageReport': (options) => {
      return (
        <div style={{ display: 'flex', width: '200px', alignItems: 'center', textAlign: 'center' }}>

          <span style={{ width: '200px' }}>Page {currentPage} of {allCompanies.totalPages}</span>

          <span style={{ display: 'flex', width: '150px', alignItems: 'center', textAlign: 'center' }}>
            {currentPage === 1 ? '' :
              <i onClick={() => setCurrentPage(currentPage - 1)} className="pi pi-angle-left"
                style={{ width: '40px', cursor: 'pointer', 'fontSize': '1.1em', 'display': 'flex', 'textAlign': 'center' }} />}

            {currentPage === allCompanies.totalPages || allCompanies.totalPages === 0 ? '' :
              <i onClick={() => setCurrentPage(currentPage + 1)} className="pi pi-angle-right"
                style={{ width: '40px', cursor: 'pointer', 'fontSize': '1.1em', 'display': 'flex', 'textAlign': 'center' }} />}
          </span>
        </div>
      )
    },
  };

  return (

    <div className='table-list-page'>
      <Helmet> <title>Company | Lipachat</title> </Helmet>

      <div className='page-header-section'>
        <p className='page-title'>Company List<p className='sub-title'>Manage Your Companies</p></p>
        <button onClick={() => dispatch(openCreateModal())} type='button' className='create-btn'><i id="btn-icon" className="pi pi-plus"></i> Add New Company</button>
      </div>

      <div className='data-table'>
        <div className='table-toolbar'>
          <div></div>

          <div className='search-table-input'>
            <span id='search-icon' class="material-symbols-outlined">search</span>
            <input type='text' className="s-table-input" placeholder='Search this table' onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

        </div>
        {action.pending || allCompanies.length === 0 ? <Loading /> :
          <DataTable value={allCompanies.data} removableSort responsive="true" rows={rows} responsiveLayout="stack" breakpoint="1200px"
            paginator paginatorTemplate={paginationTemplate} first={first} onPage={(event) => { setFirst(event.first); setRows(event.rows) }} paginatorClassName="justify-content-end">
            <Column field="name" header="Name" sortable />
            <Column body={dateBodyTemplate1} header="Date Created" />
            <Column field={dateBodyTemplate2} header="Last Active" />
            <Column field="credits" header="Credits" />
            <Column field="broadcastCount" header="Campaigns" />
            <Column field="broadcastCount" header="Messages" />
            <Column field="userCount" header="Users" />
            <Column body={activeBodyTempalte} header="Active" />
            <Column header="Actions" body={actionsBodyTemplate} />
          </DataTable>}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />


      {/* Create modal */}
      <div className={selector.create ? 'create-modal-active' : 'create-modal-inactive'} >
        <form id='form-modal' className='view-modal-content'>
          <p className='modal-title'> Create
            <span id='close-button' onClick={() => handleCloseModal(dispatch)}
              class="material-symbols-outlined">close</span></p>
          <div className="dialog-inputs">
            <Input label="Company Name *" name='name' errorMessage={formErrors?.name} type='text'
              handleChange={(e) => handleOnChange(e)} />
            <Input label="Email *" name='email' errorMessage={formErrors?.email} type='email'
              handleChange={(e) => handleOnChange(e)} />
            <Input label="Phone Number *" name='phoneNumber' errorMessage={formErrors?.number} type='text'
              placeholder='Example: 254712123456' handleChange={(e) => handleOnChange(e)} />

            <div className="select-group">
              <label className='form-label'>Country*</label>
              <select name='country' className='select-control' defaultValue={'Kenya'} onChange={(e) => handleOnChange(e)}>
                <option selected disabled hidden value="Kenya">Kenya</option>
                {countries.map((country, id) =>
                  <option id='option' key={id} style={{ fontSize: '14px' }} value={country.name.common}>{country.name.common}</option>
                )}
              </select>
              <span className="error">{formErrors?.country}</span>
            </div>
            <Input label="Pricing *" name='pricing' type='text' defaultValue='Default'
              handleChange={(e) => handleOnChange(e)} />
            <Input label="Credits *" name='credits' type='number' defaultValue="0" min={0}
              handleChange={(e) => handleOnChange(e)} />
            <Input label="Admin Name *" name='adminName' errorMessage={formErrors?.adminName} type='text'
              handleChange={(e) => handleOnChange(e)} />
            <Input label="Admin Phone Number *" name='adminPhoneNumber' errorMessage={formErrors?.adminNumber} type='text'
              placeholder='Example: 254712123456' handleChange={(e) => handleOnChange(e)} />
            <Input label="Admin Email *" name='adminEmail' errorMessage={formErrors?.adminEmail} type='email'
              handleChange={(e) => handleOnChange(e)} />
          </div>
          <div className='dialog-footer'>
            <SubmitButton pending={action.pending} handleOnSubmit={handleCreateCompany} />
          </div>
        </form>
      </div>


      {/* Edit modal */}
      <div className={selector.view ? 'view-modal-active' : 'view-modal-inactive'}>
        <form id='form-modal' className='view-modal-content'>
          <p className='modal-title'> Edit
            <i id='close-button' className="pi pi-times" onClick={() => handleCloseModal(dispatch)} /></p>
          <div className="dialog-inputs">
            <Input label="Company Name *" name='name' type='text' errorMessage={formErrors?.name} value={company?.name}
              handleChange={(e) => handleOnChange(e)} />
            <Input label="Email *" name='email' type='text' errorMessage={formErrors?.email} value={company?.email}
              handleChange={(e) => handleOnChange(e)} />
            <Input label="Phone Number *" name='phoneNumber' type='text' errorMessage={formErrors?.number}
              value={company?.phoneNumber} handleChange={(e) => handleOnChange(e)} />
            <Input label="Pricing *" name='pricing' type='text' value={company?.pricing}
              handleChange={(e) => handleOnChange(e)} />
            <Input label="Credits *" name='credits' type='number' value={company?.credits}
              handleChange={(e) => handleOnChange(e)} />
            <Input label="Token *" name='token' type='text' value={company?.token}
              handleChange={(e) => handleOnChange(e)} />
          </div>
          <div className='dialog-footer'>
            <SubmitButton pending={action.pending} handleOnSubmit={handleUpdateCompany} />
          </div>

        </form>
      </div>


      {/* company details modal */}
      <div className={viewCompany ? 'view-modal-active' : 'view-modal-inactive'} >
        <div id="form-modal" className='view-modal-content'>
          <p className='modal-title'>Company Details
            <i id='close-button' className="pi pi-times" onClick={() => { setViewCompany(false) }} /></p>
          <div className="dialog-inputs-2">

            <div>
              <label className='form-label'>Company Name</label>
              <p>{company.name}</p>
            </div>

            <div>
              <label className='form-label'>Email</label>
              <p>{company.email}</p>
            </div>

            <div>
              <label className='form-label'>Phone Number</label>
              <p>{company.phoneNumber}</p>
            </div>

            <div>
              <label className='form-label'>Users</label>
              <p>{company.userCount}</p>
            </div>

            <div>
              <label className='form-label'>Credit Balance</label>
              <p>{company.credits}</p>
            </div>

            <div>
              <label className='form-label'>Broadcast Count</label>
              <p>{company.broadcastCount}</p>
            </div>

            <div>
              <label className='form-label'>Created At</label>
              <p>{dateFormat(company.createdAt, "dd/mm/yyyy HH:MM")}</p>
            </div>

            <div>
              <label className='form-label'>Last Active</label>
              <p>{dateFormat(company.lastActiveDate, "dd/mm/yyyy HH:MM")}</p>
            </div>

            <div>
              <label className='form-label'>Admin Name</label>
              <p>{company?.adminName}</p>
            </div>

            <div>
              <label className='form-label'>Admin Phone Number</label>
              <p>{company?.adminPhoneNumber}</p>
            </div>

            <div>
              <label className='form-label'>Admin Email</label>
              <p>{company?.adminEmail}</p>
            </div>

          </div>
        </div>
      </div>


    </div>

  );
}

export default Company