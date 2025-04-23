import React from 'react'
import Card from "../../../components/shared/Card/Card.jsx";
import Button from "../../../components/shared/button/Button.jsx"
import TextInput from '../../../components/shared/TextInput/TextInput.jsx';
import styles from "./Phone.module.css"
const Phone = ({nextStep}) => {
  return (
    <Card title={"Enter Your phoneNumber Please"}>
    <TextInput placeholder={'+93-777 777 777 '}/>
    <Button text={'Next'} onclick={nextStep} />
    <p className={styles.bottomParagraph}>
                    By entering your number, you’re agreeing to our Terms of
                    Service and Privacy Policy. Thanks!
                </p>
   </Card>
  )
}

export default Phone