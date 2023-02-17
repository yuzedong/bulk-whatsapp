import React, { useState, useEffect } from 'react'
import '../globalStyles/table.css'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Loading from '../ReUsedComponents/loadingScreen/Loading';

import { getAllMessages, getAllMessagesByCampaign } from '../../apis/MessagesAPI';
import { clearFilterQuery } from '../../redux/ModalSlice.js'
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dateFormat from 'dateformat';


const Messages = () => {

  const dispatch = useDispatch()
  const selector = useSelector((state) => state.modal)
  const actionSelector = useSelector((state) => state.action)

  const [searchQuery, setSearchQuery] = useState(selector.filterQuery)
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10)
  const [currentPage, setCurrentPage] = useState(1);
  const [messages, setMessages] = useState([])
  const [statusQuery, setStatusQuery] = useState('')

  // Getting all messages
  useEffect(() => {

    if(!selector.filterQuery){
      getAllMessages(dispatch, rows, currentPage, searchQuery).then(resp => {
        if (resp?.status === 200) { setMessages(resp?.data) }
        else { toast.error("Unable to load data!", { theme: "colored" }) }
      })
    }

    else {
      getAllMessagesByCampaign(dispatch, selector.filterQuery, rows, currentPage).then(resp => {
        if (resp?.status === 200) { setMessages(resp?.data) }
        else { toast.error(resp?.response.data.message, { theme: "colored" }) }
      })
    }
    return () => {
      dispatch(clearFilterQuery())
    };

  }, [dispatch, rows, currentPage, selector.filterQuery, searchQuery])


  const statusBodyTemplate = (rowData) => {
    return <span id={`message-${rowData.statusDesc}`}>{rowData.statusDesc}</span>;
  }

  const dateBodyTemplate1 = (rowData) => {
    return <span>{dateFormat(rowData.createdAt, "dd/mm/yyyy HH:MM")}</span>
  }

  const mediaBodyTemplate = (rowData) => {
    return <span>{rowData.campaign.mediaUrl ? <a style={{fontWeight:'600',textDecoration: 'none',color: 'blue'}} href={rowData.campaign.mediaUrl} target="_blank" rel='noreferrer'>Link</a> : 'None'}</span>;
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
        <div style={{ display: 'flex', width: '200px', alignItems: 'center', textAlign: 'center' }}>

          <span style={{ width: '200px' }}>Page {currentPage} of {messages.totalPages}</span>

          <span style={{ display: 'flex', width: '150px', alignItems: 'center', textAlign: 'center' }}>
            {currentPage === 1 ? '' :
              <i onClick={() => setCurrentPage(currentPage - 1)} className="pi pi-angle-left"
                style={{ width: '40px', cursor: 'pointer', 'fontSize': '1.1em', 'display': 'flex', 'textAlign': 'center' }} />}

            {currentPage === messages.totalPages || messages.totalPages === 0 ? '' :
              <i onClick={() => setCurrentPage(currentPage + 1)} className="pi pi-angle-right"
                style={{ width: '40px', cursor: 'pointer', 'fontSize': '1.1em', 'display': 'flex', 'textAlign': 'center' }} />}
          </span>
        </div>
      )
    },
  };

  return (

    <div className='table-list-page'>
      <Helmet> <title>Messages | Lipachat</title> </Helmet>

      <div className='page-header-section'>
        <p className='page-title'>Messages List<p className='sub-title'>Manage Your Messages</p></p>
      </div>

      <div className='data-table'>
        <div className='table-toolbar'>
          
          <div>
          <label className='form-label'>Filter by Status: </label>
          <select type='text' className='rows-select-field' value={statusQuery} onChange={(e) => { setSearchQuery(''); setStatusQuery(e.target.value) }}>
            <option id='option' value="" selected>All</option>
            {["Success", 'Pending', 'Failed'].map((stt, id) =>
              <option id='option' key={id} style={{ fontSize: '14px' }} value={stt.toLowerCase()}>{stt}</option>
            )}
          </select>
          </div>
          <div className='search-table-input'>
            <span id='search-icon' class="material-symbols-outlined">search</span>
            <input type='text' className="s-table-input" placeholder='Search this table' onChange={(e) =>{setStatusQuery(''); setSearchQuery(e.target.value)}} />
          </div>

        </div>
        {actionSelector.pending || messages.length === 0? <Loading /> :
          <DataTable value={messages.data} removableSort responsive="true" rows={rows} responsiveLayout="stack" breakpoint="1200px"
            paginator paginatorTemplate={paginationTemplate} first={first} onPage={(event) => { setFirst(event.first); setRows(event.rows) }} paginatorClassName="justify-content-end">
            <Column field="contact.phoneNumber" header="Number" sortable />
            <Column field="campaign.message" header="Message" />
            <Column body={mediaBodyTemplate} header="MediaUrl" />
            <Column field="campaign.name" header="Campaign" />
            <Column field="contact.group.name" header="Group" />
            <Column field="contact.name" header="Contact Name" />
            <Column header="Status" body={statusBodyTemplate} sortable />
            <Column body={dateBodyTemplate1} header="CreatedAt" />
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

    </div>

  );
}

export default Messages