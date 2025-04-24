import React, { useState } from 'react';
import Card from "../../../components/shared/Card/Card.jsx";
import Button from "../../../components/shared/button/Button.jsx";
import TextInput from '../../../components/shared/TextInput/TextInput.jsx';
import styles from "./Phone.module.css";
import { sendOtp } from '../../../http/index.js';
import { setOtp } from "../../../store/authSlice.js";
import { useDispatch } from 'react-redux';

const Phone = ({ nextStep }) => {
    const dispatch=useDispatch();
    const [phoneNumber, setPhoneNumber] = useState('');

    const submit = async () => {
        try {
            const {data}=await sendOtp({phone:phoneNumber})
       dispatch(setOtp({phone:data.phone,hash:data.hash,otpD:data.otp}))
       console.log(data)
       nextStep();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Card title="Enter Your Phone Number Please">
            <TextInput 
                value={phoneNumber}
                placeholder="+93-777 777 777" 
                onChange={(e) => setPhoneNumber(e.target.value)} // Fixed casing for onChange
            />
            <Button text="Next" onclick={submit} /> {/* Fixed casing for onClick */}
            <p className={styles.bottomParagraph}>
                By entering your number, you’re agreeing to our Terms of
                Service and Privacy Policy. Thanks!
            </p>
        </Card>
    );
};

export default Phone;