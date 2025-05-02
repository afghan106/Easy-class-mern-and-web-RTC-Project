import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card'
import TextInput from '../../../components/shared/TextInput/TextInput'
import Button from '../../../components/shared/button/Button'
import { setName } from '../../../store/activateSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

const Name = ({nextStep}) => {
  const dispatch=useDispatch();
  const { name } = useSelector((state) => state.activate);
const [fullname,setfullName]=useState(name)




async function submit() {
  
  if (!fullname) {return alert("please enter your FullName")}
  console.log(fullname);

  dispatch(setName(fullname));
  nextStep();
  
}

  return (
    <Card title={"Enter Your Real FullName"}>
      <TextInput value={fullname} placeholder={"FullName"} onChange={(e)=>{setfullName(e.target.value)}}></TextInput>
      <p style={{color:"#6799ff"}}>People use real names at Easy-Class !</p>
      <Button text={'Next'} onclick={submit}></Button>
    </Card>
  )
}

export default Name