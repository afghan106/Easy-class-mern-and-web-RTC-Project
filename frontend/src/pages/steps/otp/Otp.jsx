import React from 'react'
import Card from "../../../components/shared/Card/Card.jsx";
import Button from "../../../components/shared/button/Button.jsx";
const Otp = ({back}) => {
    function submit(){

    }
  return (
    <Card title={"Enter the OTP we just Sent You"}>
    
    <Button text={'Next'} onclick={submit} />
   </Card>
  )
}

export default Otp