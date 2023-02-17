import React, { useState, useEffect } from 'react'
import './recentmessages.css'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { getAllBroadcasts } from '../../../apis/BroadcastAPI';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../ReUsedComponents/loadingScreen/Loading';
import dateFormat from 'dateformat';

const RecentMessages = () => {


  const dispatch = useDispatch()
  const action = useSelector((state) => state.action)
  const [allBroadcasts, setAllBroadcasts] = useState([])

  useEffect(() => {
    getAllBroadcasts(dispatch, 7, 1).then(resp => {
      if (resp?.status === 200) { setAllBroadcasts(resp?.data.data) }
    })
  }, [dispatch])

  const dateBodyTemplate1 = (rowData) => {
    return <span>{dateFormat(rowData.createdAt, "dd/mm/yyyy HH:MM")}</span>
  }

  return (
    <div class="recent-messages-page">
      <p class="table-title">Recent Messages</p>
      {action.pending? <Loading /> :
        <DataTable value={allBroadcasts} responsive="true" responsiveLayout="stack" breakpoint="900px">
          <Column field="name" header="Name" />
          <Column field="numberOfContacts" header="Contacts" />
          <Column field="message" header="Message" />
          <Column body={dateBodyTemplate1} header="Dated Scheduled" />
        </DataTable>}

    </div>
  )
}

export default RecentMessages