import React, { useState, useEffect } from 'react'
import './messagesusers.css'

import ReactApexChart from 'react-apexcharts';
import Loading from '../../ReUsedComponents/loadingScreen/Loading';
import { useDispatch, useSelector } from 'react-redux'
import { getMessageCount } from '../../../apis/Analytics'


const MessagesUsers = () => {

    const dispatch = useDispatch()
    const action = useSelector((state) => state.action)
    const [messages, setMessages] = useState()
   

    useEffect(() => {
        getMessageCount(dispatch).then(resp => {
            if (resp?.status === 200) { setMessages(resp?.data) }
        })

    }, [dispatch])

    const series = [messages?.delivered, messages?.failed]
    const options = {
        chart: {
            type: 'pie'
        },
        colors: ['#28c76f','#f64f59'],
        labels: ['Delivered', 'Failed'],
        legend: {
            show: true,
            position: 'top'
        },
        dataLabels: {
            enabled: true
        }
    }

    return (

        <div className="messages_users_section">

            <div className="messages-chart-section">
                <p className="chart-title">Campaigns/Messages Report</p>
                {action.pending? <Loading /> :
                  messages?.sent === 0 ? 
                  <p className='zero-message'><span>Start sending campaigns/messages.</span></p> :
                 <ReactApexChart options={options} series={series} type="pie" width="100%" height="100%" />}
            </div>

            {/* <div className="active-user-table">
                <p className="a-title">Active Users</p>
                {action.pending? <Loading /> :
                <DataTable value={activeUsers} responsive="true" responsiveLayout="stack" breakpoint="900px">
                    <Column field="name" header="Name" />
                    <Column field="phoneNumber" header="Phone Number" />
                    <Column field="role.name" header="Role" />
                    <Column header="Status" body={statusBodyTemplate} />
                </DataTable>}
            </div> */}

        </div>


    )
}

export default MessagesUsers