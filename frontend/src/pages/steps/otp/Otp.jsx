import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card';
import OTPInput from '../../../components/otpInput/OtpInput';
import Button from '../../../components/shared/button/Button';
import {useDispatch,useSelector} from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import { verifyOtp } from '../../../http';

const Otp = () => {


  const dispatch=useDispatch();
  
  const [otp,setOtp]=useState('');
  const {phone,hash,otpD}=useSelector((state)=>state.auth.otp)

function handleOtpChange(e){
  setOtp(e);

}

async function submit(){
  if(!otp || !hash || !phone )return alert("invalid otp")
try {
const {data}=await verifyOtp({otp,hash,phone}) ;
dispatch(setAuth(data))
console.log("this is new data after OTP verification",data);

} catch (error) {
  console.log(error)
}

}

  return (
  
    <Card title={"Enter the OTP we just Sent You"}>
      
   <OTPInput length={4} onChange={handleOtpChange} placeholder="0" />
    <Button text={'Next'} onclick={submit} />
    <p style={{color:"red"}}>for SMS send problem we set this OTP:!<span style={{color:"green"}}>{otpD}</span></p>
   </Card>
  )
}

export default Otp