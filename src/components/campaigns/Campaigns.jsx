import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import '../globalStyles/table.css'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as XLSX from 'xlsx'
import Input from '../ReUsedComponents/inputField/Input'
import TextArea from '../ReUsedComponents/textareaField/TextArea'
import SelectField from '../ReUsedComponents/selectField/SelectField'
import SubmitButton from '../ReUsedComponents/submitButton/SubmitButton'
import Loading from '../ReUsedComponents/loadingScreen/Loading';

import { getAllBroadcasts, createBroadcast } from '../../apis/BroadcastAPI';
import { getAllContacts } from '../../apis/ContactsAPI';
import { getGroups } from '../../apis/GroupAPI';
import { useDispatch, useSelector } from 'react-redux';
import { openCreateModal, setFilterQuery, closeModal } from '../../redux/ModalSlice.js';
import { Helmet } from 'react-helmet'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dateFormat from 'dateformat';

const Campaigns = () => {

  const dispatch = useDispatch()
  const selector = useSelector((state) => state.modal)
  const action = useSelector((state) => state.action)
  const [searchQuery, setSearchQuery] = useState('')

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [mediaType, setMediaType] = useState('')
  const [mediaFile, setMediaFile] = useState('');
  const [contactsFile, setContactsFile] = useState('');
  const [contacts, setContacts] = useState([]);

  const [selectedContacts, setSelectedContacts] = useState([])
  const [allBroadcasts, setAllBroadcasts] = useState([])

  const [rows, setRows] = useState(10)
  const [first, setFirst] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [allContacts, setAllContacts] = useState(null);
  const [groups, setGroups] = useState([])
  const [contactQuery, setContactQuery] = useState('')
  const [groupQuery, setGroupQuery] = useState('')
  const [statusQuery, setStatusQuery] = useState('')
  const [formErrors, setFormErrors] = useState()

  const [confirmBroadcast, setConfirmBroadcast] = useState(false)
  const [importedContacts, setImportedContacts] = useState([])

  // Getting all broadcasts
  useEffect(() => {

    if (searchQuery) {
      getAllBroadcasts(dispatch, rows, currentPage, searchQuery).then(resp => {
        if (resp?.status === 200) { setAllBroadcasts(resp?.data); }
        else { toast.error("Unable to load data!", { theme: "colored" }) }
      })
    }
    else {
      getAllBroadcasts(dispatch, rows, currentPage, statusQuery).then(resp => {
        if (resp?.status === 200) { setAllBroadcasts(resp?.data); }
        else { toast.error("Unable to load data!", { theme: "colored" }) }
      })
    }
    
    if(contactQuery){
      getAllContacts(dispatch, 1000, currentPage, contactQuery).then(resp => {
        if (resp?.status === 200) { setAllContacts(resp?.data.data) }
      })
    }
    else if(groupQuery){
      getAllContacts(dispatch, 1000, currentPage, groupQuery).then(resp => {
        if (resp?.status === 200) { setAllContacts(resp?.data.data) }
      })
    }
   
    getGroups(dispatch).then(resp => {
      if (resp?.status === 200) { setGroups(resp?.data) }
    })

   
   
  }, [dispatch, rows, currentPage, searchQuery, groupQuery, contactQuery, statusQuery])
  


  // Close modal
  const handleCloseModal = (dispatch) => {
    setFormErrors([])
    setContactQuery('')
    setGroupQuery('')
    setSelectedContacts([])
    document.getElementById("form-modal").reset();
    dispatch(closeModal())
    setName("")
    setMessage("")
    setMediaType("")
    setMediaFile("")
    setContactsFile("")
    setContacts("")
  }

  // Validating form
  const validate = () => {
    let errors = {}
    if (!name) {
      errors['name'] = 'Name is required!'
    }
    if (!message) {
      errors['message'] = 'Message is required!'
    }
    if (mediaFile && !mediaType) {
      errors['mediaType'] = 'Media Type is required!'
    }
    if (!contactsFile && selectedContacts.length === 0) {
      errors['contacts'] = 'Import file or choose contacts!'
    }


    setFormErrors(errors)
    return errors
  };


  // Creating new broadcast
  const handleCreateBroadcast = () => {

    if (mediaFile) {
      createBroadcast({ name, message, mediaFile, mediaType, 'contactsFile': contactsFile, 'contacts': contacts.toString() }, dispatch)
      .then(resp => {
        if (resp?.status === 200) {
          if (resp?.data.error === true) {
            toast.warning(resp?.data.message, { theme: "colored" })
          }
          else {
            handleCloseModal(dispatch)
            setConfirmBroadcast(false)
            window.location.reload()
            toast.success("Created successful!", { theme: "colored" })
          }
        }
        else {toast.error("Error occured!", { theme: "colored" })}
      })
    }
    else {
      createBroadcast({ name, message, 'contactsFile': contactsFile, 'contacts':contacts.toString() }, dispatch)
      .then(resp => {
        if (resp?.status === 200) {
          if (resp?.data.error === true) {
            toast.warning(resp?.data.message, { theme: "colored" })
          }else{
            handleCloseModal(dispatch)
            setConfirmBroadcast(false)
            toast.success("Created successful!", { theme: "colored" })
            window.location.reload()
          }
        }
        else {toast.error("Error occured!", { theme: "colored" })}
      })
    }

  }

  // Reading contacts file
  const readContactsFile = async (file) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)
    setImportedContacts(jsonData)
  }

  // Show confirm broadcast modal
  const handleConfirmBroadcast = () => {
    selectedContacts.map(item => setContacts(contacts => contacts?.concat(parseInt(item.phoneNumber))))
    if (Object.keys(validate()).length === 0) {
      if (contactsFile) {
        readContactsFile(contactsFile)
      }
      setConfirmBroadcast(true)
      dispatch(closeModal())
    }
  }

  const statusBodyTemplate = (rowData) => {
    return <span id={`broadcast-${rowData.status}`}>{rowData.status}</span>;
  }

  const mediaBodyTemplate = (rowData) => {
    return <span>{rowData.mediaUrl ? <a style={{fontWeight:'600',textDecoration: 'none',color: 'blue'}} href={rowData.mediaUrl} target="_blank" rel='noreferrer'>Link</a> : 'None'}</span>;
  }

  const dateBodyTemplate1 = (rowData) => {
    return <span>{dateFormat(rowData.createdAt, "dd/mm/yyyy HH:MM")}</span>
  }
 
  const actionsBodyTemplate = (rowData) => {
    return <Link to="/app/messages"><i onClick={() => dispatch(setFilterQuery(rowData.id))} id="view-action-icon" class="pi pi-eye" />
    </Link>
  }


  // Handling pagination
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

          <span style={{ width: '200px' }}>Page {currentPage} of {allBroadcasts.totalPages}</span>

          <span style={{ display: 'flex', width: '150px', alignItems: 'center', textAlign: 'center' }}>
            {currentPage === 1 ? '' :
              <i onClick={() => setCurrentPage(currentPage - 1)} className="pi pi-angle-left"
                style={{ width: '40px', cursor: 'pointer', 'fontSize': '1.1em', 'display': 'flex', 'textAlign': 'center' }} />}

            {currentPage === allBroadcasts.totalPages || allBroadcasts.totalPages === 0 ? '' :
              <i onClick={() => setCurrentPage(currentPage + 1)} className="pi pi-angle-right"
                style={{ width: '40px', cursor: 'pointer', 'fontSize': '1.1em', 'display': 'flex', 'textAlign': 'center' }} />}
          </span>
        </div>
      )
    },
  };


  return (

    <div className='table-list-page'>
      <Helmet> <title>Campaigns | Lipachat</title> </Helmet>

      <div className='page-header-section'>
        <p className='page-title'>Campaign List<p className='sub-title'>Manage Your Campaigns</p></p>
        <button onClick={() => dispatch(openCreateModal())} type='button' className='create-btn'><i id="btn-icon" className="pi pi-plus"></i> Add New Campaign</button>
      </div>

      <div className='data-table'>
        <div className='table-toolbar'>

          <div>
            <label className='form-label'>Filter By Status: </label>
            <select type='text' className='rows-select-field' value={statusQuery} onChange={(e) => { setSearchQuery(''); setStatusQuery(e.target.value) }}>
              <option id='option' value="" selected >All</option>
              {["Processed", 'In_Progress'].map((stt, id) =>
                <option id='option' key={id} style={{ fontSize: '14px' }} value={stt.toLowerCase()}>{stt}</option>
              )}
            </select>
          </div>
          <div className='search-table-input'>
            <span id='search-icon' class="material-symbols-outlined">search</span>
            <input type='text' className="s-table-input" placeholder='Search this table' onChange={(e) => { setStatusQuery(''); setSearchQuery(e.target.value) }} />
          </div>

        </div>
        {action.pending || allBroadcasts.length === 0 ? <Loading /> :
          <DataTable value={allBroadcasts.data} removableSort responsive="true" rows={rows} responsiveLayout="scroll" breakpoint="1200px"
            paginator paginatorTemplate={paginationTemplate} first={first} onPage={(event) => { setFirst(event.first); setRows(event.rows) }} paginatorClassName="justify-content-end">
            <Column field="name" header="Name" />
            <Column header="Status" body={statusBodyTemplate} />
            <Column field="numberOfContacts" header="Contacts" />
            <Column field="message" header="Message" />
            <Column body={mediaBodyTemplate} header="MediaUrl" />
            <Column field="delivered" header="Delivered" />
            <Column field="failed" header="Failed" />
            <Column body={dateBodyTemplate1} header="CreatedAt" />
            <Column field="createdBy.name" header="CreatedBy" />
            <Column header="Actions" body={actionsBodyTemplate} />
          </DataTable>}
      </div>



      {/* Create modal */}
      <div className={selector.create ? 'create-modal-active' : 'create-modal-inactive'} >
        <form id="form-modal" className='view-modal-content'>
          <p className='modal-title'> Create
            <i id='close-button' className="pi pi-times" onClick={() => handleCloseModal(dispatch)} /></p>
          <div className="dialog">

            <Input label="Name *" name='name' type='text' handleChange={(e) => setName(e.target.value)} errorMessage={formErrors?.name} />
            <TextArea label="Message *" name='message' type='text' handleChange={(e) => setMessage(e.target.value)} error={formErrors?.message} />
            <div className='dialog-inputs'>
              <Input label="Media File" name='mediaFile' type='file' handleChange={(e) => setMediaFile(e.target.files[0])} />
              <SelectField name="mediaType" placeholder="Select Media Type" label="Media Type" selects={['VIDEO', 'IMAGE', 'AUDIO']}
                handleChange={(e) => setMediaType(e.target.value)} errorMessage={formErrors?.mediaType} />
            </div>
            {/* Contacts File Upload Dialog */}
            <div className='contacts-input-section'>
              <label className='form-label'>Contacts *</label>
              <div>
                <a className="template-link" href={process.env.PUBLIC_URL + "/sample_contact_file.csv"}>
                  <i className="pi pi-file" style={{ 'fontSize': '1em' }} />Download Contacts File Template</a>
                <p className='form-label'>Choose file <strong>OR</strong><span> Search and Select Contacts from table</span></p>
                <p id='error'>{formErrors?.contacts}</p>
                <Input name='contactsFile' type='file' accept='.csv, .xlsx, .xls' handleChange={(e) => setContactsFile(e.target.files[0])} />
                <div className='contacts-inputs' >
                  <div className='table-toolbar'>
                    <select type='text' className='rows-select-field' value={groupQuery} onChange={(e) => { setContactQuery(''); setGroupQuery(e.target.value) }}>
                      <option id='option' value="" selected disabled hidden>You can select multiple contacts </option>
                      {groups.map((group, id) =>
                        <option id='option' key={id} style={{ fontSize: '14px' }} value={group.name.toLowerCase()}>{group.name}</option>
                      )}
                    </select>
                    <input type='text' className="s-table-input" placeholder='Search contact or group' value={contactQuery} onChange={(e) => { setGroupQuery(''); setContactQuery(e.target.value) }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Number of Selected Contacts: {selectedContacts.length}</span>
                  {action.pending ? <Loading /> :
                  <DataTable value={allContacts} responsive="true" responsiveLayout="scroll" selection={selectedContacts}
                    scrollable scrollHeight="250px" onSelectionChange={(event) => setSelectedContacts(event.value)} dataKey="id" size="small"  >
                    <Column selectionMode="multiple" />
                    <Column field="name" header="Name" />
                    <Column field="phoneNumber" header="Number" />
                    <Column field="group.name" header="Group" />
                  </DataTable>}

                </div>
              </div>
            </div>

          </div>
          <div className='dialog-footer'>
            <button type='button' className="submit-btn" onClick={handleConfirmBroadcast}>Confirm</button>
          </div>
        </form>
      </div>


      {/* Broadcast confirm modal */}
      <div className={confirmBroadcast ? 'view-modal-active' : 'view-modal-inactive'} >
        <form id="form-modal" className='view-modal-content'>
          <p className='modal-title'> Confirm Broadcast
            <i id='close-button' className="pi pi-times" onClick={() => { setContacts([]); setConfirmBroadcast(false); dispatch(openCreateModal()) }} /></p>
          <div className="dialog">

            <TextArea label="Message" defaultValue={message} readOnly={true} />

            <div>
              <label className='form-label'>Media Type</label>
              <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{mediaType ? mediaType : 'None'}</p>
            </div>

            <div>
              <label className='form-label'>Media FIle</label>
              <p style={{ fontSize: '14px', fontWeight: 'bold' }}> {mediaFile ? mediaFile.name : 'None'}</p>
            </div>

            {/* Contacts Table View */}
            <div className='contacts-input-section'>
              <label className='form-label'>Imported Contacts</label>

              {!importedContacts.length ?
                <p style={{ fontSize: '14px', fontWeight: 'bold' }}>Number of Imported Contacts: {importedContacts.length}</p> :
                <div className='contacts-inputs' >
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Number of Imported Contacts: {importedContacts.length}</span>
                  <DataTable value={importedContacts} responsive="true" responsiveLayout="scroll" scrollable scrollHeight="250px" dataKey="id" size="small"  >
                    <Column field="Customer Name(Optional)" header="Name" />
                    <Column field="Phone Number(Required)" header="Number" />
                    <Column field="Group Name(Optional)" header="Group" />
                  </DataTable>

                </div>}
            </div>

            <div className='contacts-input-section'>
              <label className='form-label'>Selected Contacts</label>
              {!selectedContacts.length ?
                <p style={{ fontSize: '14px', fontWeight: 'bold' }}>Number of Selected Contacts: {selectedContacts.length}</p> :
                <div className='contacts-inputs' >
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Number of Selected Contacts: {selectedContacts.length}</span>
                  <DataTable value={selectedContacts} responsive="true" responsiveLayout="scroll" scrollable scrollHeight="250px" dataKey="id" size="small"  >
                    <Column field="name" header="Name" />
                    <Column field="phoneNumber" header="Number" />
                    <Column field="group.name" header="Group" />
                  </DataTable>
                </div>}
            </div>

          </div>
          <div className='dialog-footer'>
            <SubmitButton handleOnSubmit={handleCreateBroadcast} pending={action.pending} />
          </div>
        </form>
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


    </div>

  );
}

export default Campaigns