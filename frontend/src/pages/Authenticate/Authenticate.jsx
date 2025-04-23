import React, { useState } from 'react';
import Phone from "../steps/phone/Phone.jsx";
import Otp from "../steps/otp/Otp.jsx";

const Authenticate = () => {
    const [step, setStep] = useState(1);

    const steps = {
        1: Phone,
        2: Otp,
    };

    const Step = steps[step];

    const nextStep = () => {
        if (step < Object.keys(steps).length) {
            setStep(step + 1);
            
        }
    };
    const back = () => {
        if (step < Object.keys(steps).length) {
            setStep(step - 1);

        }
    };

    return (
       
            <Step back={back} nextStep={nextStep} />
       
    );
};

export default Authenticate;