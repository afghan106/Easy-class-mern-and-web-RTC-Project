import React from 'react'
import Card from '../../../components/shared/Card/Card'
import TextInput from '../../../components/shared/TextInput/TextInput'
import Button from '../../../components/shared/button/Button'

const Name = ({nextStep}) => {
  return (
    <Card title={"Enter Your Real FullName"}>
      <TextInput placeholder={"FullName"}></TextInput>
      <p style={{color:"#6799ff"}}>this name is too important for certifications!</p>
      <Button text={'Next'} onclick={nextStep}></Button>
    </Card>
  )
}

export default Name