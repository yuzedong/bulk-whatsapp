import React, { useState } from 'react'
import './topup.css'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

import { topupCredit } from "../../../apis/BillingAPI";
import { Helmet } from 'react-helmet'

const Topup = () => {

  const dispatch = useDispatch()
  const userData = useSelector(state => state.session)
  const action = useSelector(state => state.action)
  const [paymentInfo, setPaymentInfo] = useState({ phoneNumber: '', amount: 0 });
  const [formErrors, setFormErrors] = useState()

  const handleOnChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value })
  }

  const loading = () =>{
    return <div class="lds-dual-ring"></div>
}

  // Validating form
  const validate = () => {
    let errors = {}
    if (!paymentInfo?.phoneNumber) {
      errors['number'] = 'Number is required!'
    }
    if (!paymentInfo?.amount) {
      errors['amount'] = 'Amount is required!'
    }

    setFormErrors(errors)
    return errors
  };

  // Topup credits
  const handleTopupCredits = () => {
    if (Object.keys(validate()).length === 0) {
      topupCredit(paymentInfo, dispatch).then(resp => {
        if (resp?.status === 200) {
          if(resp?.data.error === true){
            toast.warning(resp.data.message, { theme: "colored" })
            
          }
          else {
            toast.success(resp.data.message, { theme: "colored" })
            setPaymentInfo({ phoneNumber: '', amount: '' })
            setFormErrors([])
            document.getElementById("form-modal").reset();
          }
        }
        else {
          toast.error("Error occured!", { theme: "colored" })
        }
      })
    }
  }


  return (
    <div className="pricing-page">
      <Helmet> <title>Topup | Lipachat</title> </Helmet>

      <div className="payment-card">
        <img src={process.env.PUBLIC_URL + "/images/mpesa.png"} alt="mpesa" className="payment-logo" /><br />
        <span className="payment-notify">Once payment is confirmed, your credit will be updated automatically.</span>
        <form id='form-modal' className='topup-form'>

          <div className='paybill-section'>
            <span id="option-title">Paybill:</span>
            <ol className="option1-list">
              <li>Go to Mpesa</li>
              <li>Select Lipa na Mpesa follow by Paybill</li>
              <li>Enter business number <span id="paybill">4030071 (Lipachat Limited)</span></li>
              <li>Enter account number <span id="paybill">{userData?.user.company.name}</span></li>
              <li>Enter Amount</li>
              <li>Enter PIN</li>
            </ol>
          </div>

          <div>
            <span id="option-title">USSD Push:</span>
            <div className="payment-input-group">
              <p className="payment-label">Mpesa Number</p>
              <input className="payment-input" name='phoneNumber' type="number" minLength={9} onChange={(e) => handleOnChange(e)} /><br />
              <span id='error'>{formErrors?.number}</span>
            </div>
            <div className="payment-input-group">
              <p className="payment-label">Amount</p>
              <input className="payment-input" name='amount' type="number" min={5} onChange={(e) => handleOnChange(e)} /><br />
              <span id='error'>{formErrors?.amount}</span>
            </div>

            <div>
              {!action.pending ?
                <button type='button' className="payment-btn" onClick={handleTopupCredits}>TopUp</button> :
                <button type='button' className="payment-btn btn-disabled" disabled="disabled">{loading()}</button>
              }
            </div>

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
  )
}

export default Topup