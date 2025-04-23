import React from 'react'
import Card from "../../../components/shared/Card/Card.jsx";
import Button from "../../../components/shared/button/Button.jsx";
import OTPInput from '../../../components/otpInput/OtpInput.jsx'
const Otp = ({back}) => {
    function submit(){

    }
  return (
    <Card title={"Enter the OTP we just Sent You"}>
   <OTPInput />
    <Button text={'Next'} onclick={submit} />
    <p style={{color:"red"}}>for SMS send problem we set the otp to autoComplete the input!</p>
   </Card>
  )
}

export default Otp