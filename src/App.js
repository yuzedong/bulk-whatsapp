
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/navbar/Navbar';
import SideBar from './components/sidebar/SideBar';
import DashBoard from './views/dashboard/DashBoard';
import Users from './components/userManagement/users/Users';
import Campaigns from './components/campaigns/Campaigns';
import Company from './components/company/Company';
import Contacts from './components/contacts/Contacts';
import Messages from './components/messages/Messages';
import Footer from './components/footer/Footer';
import LoginPage from './components/loginpage/LoginPage';
import RegisterPage from './components/registerpage/RegisterPage';
import Topup from './components/billing/topupPage/Topup';
import Profile from './components/profile/Profile';
import BillingHistory from './components/billing/billingList/BillingHistory';
import PasswordPage from './components/passwordpage/PasswordPage';
import Protected from './components/Protected';
import PageNotFound from './components/pageNotFound/PageNotFound';
import Loading from '../src/components/ReUsedComponents/loadingScreen/Loading.js'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/SessionSlice';
import { setUserInfo, setUserToken, setLoginState } from './redux/SessionSlice';
import jwt_decode from "jwt-decode";


import './App.css'


function App() {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state.session)
  let navigate = useNavigate()
 
  const useBeforeRender = (callback, deps) => {
    const [isRun, setIsRun] = useState(false);
    if (!isRun) {
      callback();
      setIsRun(true);
    }
    useEffect(() => () => setIsRun(false), [])
  };

  useBeforeRender(() => {
    dispatch(setUserToken(localStorage.getItem("token")))
    dispatch(setUserInfo(JSON.parse(localStorage.getItem("userinfo"))))
    dispatch(setLoginState(JSON.parse(localStorage.getItem("loginState"))))
  }, [dispatch]);


 

  if (selector.loggedIn === true) {
    const decodedToken = jwt_decode(localStorage.getItem("token"))
    if (decodedToken.exp * 1000 < new Date().getTime()) {
      return <div className='session-modal-active'>
        <div className="session-modal" >
          <img id="session-img" src="https://100dayscss.com/codepen/alert.png" width="44" height="38" alt='warning' />
          <span className="session-title">Your session has expired</span>
          <p className='session-message'>Please log in to continue using the application.</p>
          <div className='session-buttons'>
            <button type='button' className="session-dismiss-button" onClick={() => { localStorage.clear(); dispatch(logout()); navigate('/auth/login') }}>Log in </button>
          </div>
        </div>
      </div>
    }
  }


  const handleToggleSideBar = () => {
    var y = document.getElementById("toggle-bar");
    if (y.style.display === "block") {
      y.style.display = "none";

    } else {
      y.style.display = "block";
      y.style.position = "absolute"
    }
  }


  const DefaultContainer = () => (
    <div className='main-page'>

      {/* <div id="toggle-left" className='left'> </div> */}
      <SideBar idName="toggle-bar"/>

      <div id='right-content' className='right'>

        <Navbar toggleSideBar={handleToggleSideBar} />
        <div className='content-div'>
          <Routes>
            <Route exact path='/dashboard' element={<Protected isLoggedIn={selector.loggedIn}><DashBoard /></Protected>} />
            <Route exact path='/users' element={<Protected isLoggedIn={selector.loggedIn}><Users /></Protected>} />
            <Route exact path='/contacts' element={<Protected isLoggedIn={selector.loggedIn}><Contacts /></Protected>} />
            <Route exact path='/campaigns' element={<Protected isLoggedIn={selector.loggedIn}><Campaigns /></Protected>} />
            <Route exact path='/company' element={<Protected isLoggedIn={selector.loggedIn}><Company /></Protected>} />
            <Route exact path='/messages' element={<Protected isLoggedIn={selector.loggedIn}><Messages /></Protected>} />
            <Route exact path='/topup' element={<Protected isLoggedIn={selector.loggedIn}><Topup /></Protected>} />
            <Route exact path='/account/profile' element={<Protected isLoggedIn={selector.loggedIn}><Profile /></Protected>} />
            <Route exact path='/billing' element={<Protected isLoggedIn={selector.loggedIn}><BillingHistory /></Protected>} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>

          <Footer />
        </div>
      </div>

    </div>
  );

  const AuthContainer = () => (

    <Routes>
      <Route exact path='/login' element={<LoginPage />} />
      <Route exact path='/signup' element={<RegisterPage />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>

  );

  const NotFoundContainer = () => (

    <Routes>
      <Route path="/404" element={<PageNotFound />} />
      <Route path="*" element={<Navigate to="/404" />} />

    </Routes>

  );

  return (

    <Routes>
      <Route exact path='auth/*' element={<AuthContainer />} />
      <Route exact path='app/*' element={<DefaultContainer />} />
      <Route exact path='/user_signup/:token' element={<PasswordPage />} />
      <Route exact path='*' element={<NotFoundContainer />} />
      <Route exact path="/" element={<Navigate to="/app/dashboard" />} />
    </Routes>

  );
}

export default App;
