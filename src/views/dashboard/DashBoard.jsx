import React from 'react'
import './dashboard.css'
import FeaturedInfo from '../../components/dashboard/featuredInfo/FeaturedInfo'
import MessagesUsers from '../../components/dashboard/messagesUsers/MessagesUsers'
import { Helmet } from 'react-helmet'

function DashBoard(){

    return(
        <div className='dashboard'>
         <Helmet>
          <title>Home | Lipachat</title>
        </Helmet>
           <FeaturedInfo />
           <MessagesUsers />
        </div>

    )
}

export default DashBoard