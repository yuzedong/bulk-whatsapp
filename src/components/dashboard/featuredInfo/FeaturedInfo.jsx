import React, {useState, useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import './featuredinfo.css'

import { useDispatch, useSelector } from 'react-redux'
import { getContactCount, getBroadcastCount, getMessageCount } from '../../../apis/Analytics'
import { setFilterQuery } from '../../../redux/ModalSlice.js';

const FeaturedInfo = () => {

    const dispatch = useDispatch()
    const action = useSelector((state) => state.action)
    const [contacts, setContacts] = useState()
    const [broadcasts, setBroadcasts] = useState()
    const [messages, setMessages] = useState()

    useEffect(() => {

        getContactCount(dispatch).then(resp => {
            if (resp?.status === 200) { setContacts(resp?.data) }
        })

        getBroadcastCount(dispatch).then(resp => {
            if (resp?.status === 200) { setBroadcasts(resp?.data) }
        })

        getMessageCount(dispatch).then(resp => {
            if (resp?.status === 200) { setMessages(resp?.data) }
        })

    }, [dispatch])

    const loading = () =>{
        return <div class="ld-dual-ring"></div>
    }

    return (
        <div class='featuredSection'>
            <NavLink to="/app/contacts" className='featuredItem' id='item01'>
                <div class='featuredItemInfo'>
                   {action.pending? loading(): <p class='item-amount'>{contacts}</p>} 
                    <p class='item-type'>Contacts</p>
                </div>
                <i className="pi pi-users" id='item-icon1'/>
            </NavLink>

            <NavLink to="/app/campaigns" className='featuredItem' id='item02'>
                <div class='featuredItemInfo'>
                {action.pending? loading() : <p class='item-amount'>{broadcasts}</p>}
                    <p class='item-type'>Campaigns</p>
                </div>
                <i className="pi pi-megaphone" id='item-icon2'/>
            </NavLink>

            <NavLink to="/app/messages" className='featuredItem' id='item03'>
                <div class='featuredItemInfo'>
                {!messages? loading() : <p class='item-amount'>{messages?.sent}</p>}
                    <p class='item-type'>Messages Sent</p>
                </div>
                <i className="pi pi-send" id='item-icon3'/>
            </NavLink>

            <NavLink to="/app/messages" className='featuredItem' id='item04' onClick={() => dispatch(setFilterQuery('success'))}>
                <div class='featuredItemInfo'>
                {!messages? loading() : <p class='item-amount'>{messages?.delivered}</p>}
                    <p class='item-type'>Messages Delivered</p>
                </div>
                <i className="pi pi-comment" id='item-icon4'/>
            </NavLink>

            <NavLink to="/app/messages" className='featuredItem' id='item05' onClick={() => dispatch(setFilterQuery('pending'))}>
                <div class='featuredItemInfo'>
                {!messages? loading() : <p class='item-amount'>{messages?.failed}</p> }
                    <p class='item-type'>Messages Failed</p>
                </div>
                <i className="pi pi-exclamation-triangle" id='item-icon5'/>
            </NavLink>

        </div>
    )
}

export default FeaturedInfo