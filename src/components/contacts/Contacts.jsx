import React, { useState, useEffect } from 'react'
import '../globalStyles/table.css'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as XLSX from 'xlsx'

import Input from '../ReUsedComponents/inputField/Input'
import SubmitButton from '../ReUsedComponents/submitButton/SubmitButton';
import Loading from '../ReUsedComponents/loadingScreen/Loading';
import DeleteModal from '../ReUsedComponents/deleteModal/DeleteModal'

import { getGroups } from '../../apis/GroupAPI';
import { getAllContacts, createContact, updateContact, deleteContact, contactsBulkImport } from '../../apis/ContactsAPI';
import { useDispatch, useSelector } from 'react-redux';
import { openCreateModal, openViewModal, closeModal } from '../../redux/ModalSlice.js';
import { Helmet } from 'react-helmet'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dateFormat from 'dateformat';

const Contacts = () => {

  const dispatch = useDispatch()
  const selector = useSelector((state) => state.modal)
  const action = useSelector((state) => state.action)

  const [contact, setContact] = useState({ name: '', phoneNumber: '', groupName: 'Default' });
  const [allContacts, setAllContacts] = useState([])
  const [groups, setGroups] = useState([])
  const [contactsFile, setContactsFile] = useState()

  const [rows, setRows] = useState(10)
  const [first, setFirst] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("")
  const [uploadTemplate, setUploadTemplate] = useState(false)
  const [groupQuery, setGroupQuery] = useState('')
  const [formErrors, setFormErrors] = useState()
  const [deleteAction, setDeleteAction] = useState(false)
 


  const handleOnChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value })
  }

  const handleCloseModal = (dispatch) => {
    setContact({ name: '', phoneNumber: '', groupName: 'Default' })
    setContactsFile()
    setFormErrors([])
    setUploadTemplate(false)
    setDeleteAction(false)
    document.getElementById("form-modal").reset();
    document.getElementById('import-btn').value = "";
    dispatch(closeModal())
  }

  const validate = () => {
    let errors = {}
    if (!contact?.phoneNumber) {
      errors['number'] = 'Number is required!'
    }
    setFormErrors(errors)
    return errors
  };


  useEffect(() => {
    if (groupQuery) {
      getAllContacts(dispatch, rows, currentPage, groupQuery).then(resp => {
        if (resp?.status === 200) { setAllContacts(resp?.data); }
        else { toast.error("Unable to load data!", { theme: "colored" }) }
      })
    }
    else {
      getAllContacts(dispatch, rows, currentPage, searchQuery).then(resp => {
        if (resp?.status === 200) { setAllContacts(resp?.data);
         }
        else { toast.error("Unable to load data!", { theme: "colored" }) }
      })
    }

    getGroups(dispatch).then(resp => {
      if (resp?.status === 200) { setGroups(resp?.data) }
      else { toast.error("Unable to load groups!", { theme: "colored" }) }
    })
    
  }, [dispatch, rows, currentPage, allContacts.totalItemsInPage, groupQuery, searchQuery])

  const handleCreateContact = () => {
    if (Object.keys(validate()).length === 0) {
      createContact(contact, dispatch).then(resp => {
        if (resp?.status === 200) {
          if (resp?.data.error === true) {
            toast.error(resp?.data.message, { theme: "colored" })
          } else {
            handleCloseModal(dispatch)
            toast.success("Created successful!", { theme: "colored" })
            window.location.reload()
          }
        }
        else { toast.error("Phone Number already exist!", { theme: "colored" }) }
      })
    }

  }


  const handleBulkImport = (e) => {
    if (!contactsFile) {
      toast.warning('Please select file!', { theme: "colored" })
    } else {

      contactsBulkImport(contactsFile, dispatch).then(resp => {
        console.log(contactsFile)
        if (resp?.status === 200) {
          if (resp?.data.error === true) {
            toast.error(resp?.data.message, { theme: "colored" })
            document.getElementById('import-btn').value = "";
            setContactsFile()
          }
          else {
            toast.success("Import was successful!", { theme: "colored" })
            window.location.reload()
          }
        }

        else {
          console.log(resp)
          toast.error(resp?.response.data.message, { theme: "colored" })
          document.getElementById('import-btn').value = "";
          setContactsFile()
        }
      })
    }

  }

  const handleUpdateContact = () => {
    if (Object.keys(validate()).length === 0) {
      updateContact(contact, dispatch).then(resp => {
        if (resp?.status === 200) {
          handleCloseModal(dispatch)
          toast.success("Update successful!", { theme: "colored" })
          window.location.reload()
        }
        else {
          toast.error("Error occured!", { theme: "colored" })
        }
      })
    }
  }

  const handleDeleteContact = (contact) => {
    deleteContact(contact, dispatch).then(resp => {
      if (resp?.status === 200) {
        handleCloseModal(dispatch)
        toast.success("Deleted successful!", { theme: "colored" })
        window.location.reload()
      }
      else {
        toast.error("Error occured!", { theme: "colored" })
        
      }
    })
    setContact({ name: '', phoneNumber: '', groupName: 'Default' })
    setDeleteAction(false)
  }

  const actionsBodyTemplate = (rowData) => {
    return <div className='table-actions'>
      <i onClick={() => { setContact({ id: rowData.id, name: rowData?.name, phoneNumber: rowData?.phoneNumber, groupName: rowData.group?.name }); dispatch(openViewModal()) }} id="edit-action-icon" class="pi pi-pencil" />
      <i onClick={() => { setContact(rowData); setDeleteAction(true) }} id="delete-action-icon" class="pi pi-trash" />
    </div>
  }

  const dateBodyTemplate = (rowData) => {
    return <span>{dateFormat(rowData.createdAt, "dd/mm/yyyy HH:MM")}</span>
  }

  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        });

        module.default.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
      }
    });
  };


  const exportExcel = () => {
    let exportData = allContacts?.data?.map(item => (
      {'PhoneNumber':item.phoneNumber, 'Name':item.name,
      'GroupName':item.group.name,
      'Date Created':dateFormat(item.createdAt, "dd/mm/yyyy HH:MM")}
      )
      )
     const worksheet = XLSX.utils.json_to_sheet(exportData);
     const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
     saveAsExcelFile(excelBuffer, 'contacts');
  };

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
        <div style={{ display: 'flex', width: '180px', alignItems: 'center', textAlign: 'center' }}>

          <span style={{ width: '200px' }}>Page {currentPage} of {allContacts.totalPages}</span>

          <span style={{ display: 'flex', width: '150px', alignItems: 'center', textAlign: 'center' }}>
            {currentPage === 1 ? '' :
              <i onClick={() => setCurrentPage(currentPage - 1)} className="pi pi-angle-left"
                style={{ width: '40px', cursor: 'pointer', 'fontSize': '1.1em', 'display': 'flex', 'textAlign': 'center' }} />}

            {currentPage === allContacts.totalPages || allContacts.totalPages === 0 ? '' :
              <i onClick={() => setCurrentPage(currentPage + 1)} className="pi pi-angle-right"
                style={{ width: '40px', cursor: 'pointer', 'fontSize': '1.1em', 'display': 'flex', 'textAlign': 'center' }} />}
          </span>
        </div>
      )
    },
  };

  return (

    <div className='table-list-page'>
      <Helmet> <title>Contacts | Lipachat</title> </Helmet>

      <DeleteModal action={deleteAction} handleCloseMessage={() => handleCloseModal(dispatch)}
        handleAction={() => handleDeleteContact(contact)} />

      <div className='page-header-section'>
        <p className='page-title'>Contact List<p className='sub-title'>Manage Your Contacts</p></p>
        <div className='header-buttons'>
          <button onClick={() => dispatch(openCreateModal())} className='create-btn'><i id="btn-icon" className="pi pi-plus" /> Add New Contact</button>
          <button onClick={() => setUploadTemplate(true)} className="import-btn"><i className="pi pi-file" style={{ 'fontSize': '1em' }} /> Import Contacts</button>
          <button onClick={ () => {exportExcel()}} className='export-btn'><i id="btn-icon" className="pi pi-file-excel" /> Export Contacts</button>

        </div>
      </div>

      <div className='data-table'>
        <div className='table-toolbar'>
          <div>
            <label className='form-label'>Filter by group: </label>
            <select type='text' className='rows-select-field' value={groupQuery} onChange={(e) => { setSearchQuery(''); setGroupQuery(e.target.value) }}>
              <option id='option' value="" selected>All</option>
              {groups.map((group, id) =>
                <option id='option' key={id} style={{ fontSize: '14px' }} value={group.name.toLowerCase()}>{group.name}</option>
              )}
            </select>
          </div>
          <div className='search-table-input'>
            <span id='search-icon' class="material-symbols-outlined">search</span>
            <input type='text' className="s-table-input" placeholder='Search this table' onChange={(e) => { setGroupQuery(''); setSearchQuery(e.target.value) }} />
          </div>
        </div>
        {action.pending || allContacts.length === 0 ? <Loading /> :
          <DataTable value={allContacts.data} removableSort responsive="true" rows={rows} first={first} responsiveLayout="stack" breakpoint="1200px"
            paginator paginatorTemplate={paginationTemplate} onPage={(event) => { setFirst(event.first); setRows(event.rows) }} paginatorClassName="justify-content-end">
            <Column field="phoneNumber" header="Number" sortable />
            <Column field="name" header="Name" sortable />
            <Column field="group.name" header="Group" sortable />
            <Column header="Date Created" body={dateBodyTemplate} sortable />
            <Column field="messagesReceived" header="Messages Received" sortable />
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


      {/* /////////////////////CREATING CONTACT //////////// */}
      <div className={selector.create ? 'create-modal-active' : 'create-modal-inactive'} >
        <form id="form-modal" className='view-modal-content'>
          <p className='modal-title'> Create
            <i id='close-button' className="pi pi-times" onClick={() => handleCloseModal(dispatch)} /></p>
          <div className="dialog-inputs">
            <Input label="Name " name='name' type='text' handleChange={(e) => handleOnChange(e)} />
            <Input label="Phone Number*" name='phoneNumber' type='number' errorMessage={formErrors?.number}
              handleChange={(e) => handleOnChange(e)} placeholder="Example: 254123456789" />

            <div className="select-group">
              <label className='form-label' >Group</label>
              <input list="groups" name="groupName" multiple className='select-control' onChange={(e) => handleOnChange(e)}
                autocomplete="off" onClick={e => e.target.value = ''} onFocus={e => e.target.value = ''} />
              <datalist id="groups" className='group-list' >
                {groups.length === 0 ? "You have no groups" : groups.map((group, id) =>
                  <option id='option' key={id} style={{ fontSize: '14px' }} value={group.name}>{group.name}</option>
                )}
              </datalist>
            </div>

          </div>
          <div className='dialog-footer'>
            <SubmitButton pending={action.pending} handleOnSubmit={handleCreateContact} />
          </div>
        </form>
      </div>


      {/* /////////////////////EDITNG CONTACT //////////// */}
      <div className={selector.view ? 'view-modal-active' : 'view-modal-inactive'}>
        <form id="form-modal" className='view-modal-content'>
          <p className='modal-title'> Edit
            <i id='close-button' className="pi pi-times" onClick={() => handleCloseModal(dispatch)} /></p>
          <div className="dialog-inputs">
            <Input label="Name" name='name' type='text' value={contact?.name} handleChange={(e) => handleOnChange(e)} />
            <Input label="Phone Number*" name='phoneNumber' type='number' errorMessage={formErrors?.number}
              value={contact?.phoneNumber} handleChange={(e) => handleOnChange(e)} />

            <div className="select-group">
              <label className='form-label'>Group</label>
              <input list="groups" name="groupName" className='select-control' value={contact?.groupName}
                autocomplete="off" onClick={e => e.target.value = ''} onFocus={e => e.target.value = ''} onChange={(e) => handleOnChange(e)} />
              <datalist id="groups" className='group-list' open="open" >
                {groups.map((group, id) =>
                  <option id='option' key={id} style={{ fontSize: '14px' }} value={group.name}>{group.name}</option>
                )}
              </datalist>
            </div>

          </div>
          <div className='dialog-footer'>
            <SubmitButton pending={action.pending} handleOnSubmit={handleUpdateContact} />
          </div>
        </form>
      </div>


      {/* //File Upload Dialog */}
      <div className={uploadTemplate ? 'upload-modal-active' : 'upload-modal-inactive'}>
        <form id="form-modal" className='view-modal-content' enctype="multipart/form-data">
          <p className='modal-title'> Upload a file
            <i id='close-button' className="pi pi-times" onClick={() => { document.getElementById('import-btn').value = ""; handleCloseModal(dispatch) }} /></p>

          <a className="template-link" href={process.env.PUBLIC_URL + "/sample_contact_file.csv"}>
            <i className="pi pi-file" style={{ 'fontSize': '1em' }} />Download Contacts File Template</a>

          <p className="upload-intructions">Only CSV and EXCEL files accepted</p>

          <div className='import-sec'>
            <label for="import-btn" id='import-label'>
              <i className="pi pi-download" style={{ 'fontSize': '3.5em' }} /><br />
              {contactsFile ? <strong>{contactsFile?.contactsFile?.name}</strong> : <span>click to select file</span>}
            </label>
            <input type="file" name="contactsFile" hidden accept=".xlsx, .csv" id="import-btn"
              onChange={(e) => setContactsFile({ contactsFile: e.target.files[0] })} />
          </div>

          <div className='dialog-footer'>
            <SubmitButton pending={action.pending} handleOnSubmit={handleBulkImport} />
          </div>
        </form>
      </div>



    </div>

  );
}

export default Contacts