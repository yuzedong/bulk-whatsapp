import React, { useState, useEffect } from 'react'
import '../../globalStyles/table.css'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Loading from '../../ReUsedComponents/loadingScreen/Loading';

import { getBillingStatement } from '../../../apis/BillingAPI';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dateFormat from 'dateformat';

const BillingHistory = () => {

  const dispatch = useDispatch()
  const action = useSelector((state) => state.action)

  const [searchQuery, setSearchQuery] = useState("")
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10)
  const [currentPage, setCurrentPage] = useState(1);

  const [statements, setStatements] = useState([])

  // Getting all statements
  useEffect(() => {
    getBillingStatement(dispatch, rows, currentPage, searchQuery).then(resp => {
        if (resp?.status === 200) { setStatements(resp?.data) }
        else { toast.error("Unable to load data!", { theme: "colored" }) }
      })
  }, [dispatch, rows, currentPage, searchQuery])

  const dateBodyTemplate = (rowData) => {
    return <span>{dateFormat(rowData.createdAt, "dd/mm/yyyy HH:MM")}</span>
  }

  const debitBodyTemplate = (rowData) => {
    return <span>{rowData.debitCreditFlag === 'DEBIT' ? rowData.amount: 'N/A'}</span>
  }
  const creditBodyTemplate = (rowData) => {
    return <span>{rowData.debitCreditFlag === 'CREDIT' ? rowData.amount: 'N/A'}</span>
  }


  const paginationTemplate = {
    layout: 'RowsPerPageDropdown CurrentPageReport',
    'RowsPerPageDropdown': (options) => {
      const dropdownOptions = [10, 20, 50, 100]

      return (
        <div>
          <label className='form-label'>Items per page: </label>
          <select type='number' className='rows-select-field' value={rows} onChange={(e) =>setRows(e.target.value)}>
            {dropdownOptions.map((select, id) =>
              <option id='option' key={id} style={{ fontSize: '14px' }} type='number' value={select}>{select}</option>
            )}
          </select>
        </div>
      );
    },
    'CurrentPageReport': (options) => {
      return (
        <div  style={{ display: 'flex', width: '180px', alignItems: 'center', textAlign: 'center'  }}>

          <span style={{  width: '100px'}}>Page {currentPage} of {statements.totalPages}</span>

          <span>
          {currentPage === 1 ? '' :
          <i onClick={() => setCurrentPage(currentPage - 1)} className="pi pi-angle-left"
            style={{ width: '40px', cursor: 'pointer', 'fontSize': '1.1em', 'display': 'flex', 'textAlign': 'center' }} />}

            {currentPage === statements.totalPages || statements.totalPages === 0  ? '' :
              <i onClick={() => setCurrentPage(currentPage + 1)} className="pi pi-angle-right"
                style={{ width: '40px', cursor: 'pointer', 'fontSize': '1.1em', 'display': 'flex', 'textAlign': 'center' }} />}
          </span>
        </div>
      )
    },
  };


  return (

    <div className='table-list-page'>
      <Helmet> <title>Billing History | Lipachat</title> </Helmet>

      <div className='page-header-section'>
        <p className='page-title'>Billing List<p className='sub-title'>Manage Your Billing</p></p>
      </div>

      <div className='data-table'>
        <div className='table-toolbar'>
          <div>
            <label className='form-label'>Items per page: </label>
            <select type='number' className='rows-select-field' value={rows} onChange={(e) => setRows(e.target.value)}>
              {[10, 20, 50].map((select, id) =>
                <option id='option' key={id} style={{ fontSize: '14px' }} type='number' value={select}>{select}</option>
              )}
            </select>
          </div>

          <div className='search-table-input'>
            <span id='search-icon' class="material-symbols-outlined">search</span>
            <input type='text' className="s-table-input" placeholder='Search this table' onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

        </div>
        {action.pending || statements.length === 0? <Loading /> :
        <DataTable value={statements.data} removableSort responsive="true" rows={rows} responsiveLayout="stack" breakpoint="1200px"
          paginator paginatorTemplate={paginationTemplate} first={first} onPage={(event) => { setFirst(event.first); setRows(event.rows) }} paginatorClassName="justify-content-end">
          <Column field="narration" header="Transaction Type" sortable />
          <Column body={creditBodyTemplate} header="CR" />
          <Column body={debitBodyTemplate} header="DR" sortable />
          <Column field="balance" header="Balance" sortable />
          <Column body={dateBodyTemplate} header="CreatedAt" sortable />
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

export default BillingHistory