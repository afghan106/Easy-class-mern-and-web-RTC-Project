import React, { useState } from 'react';
import Name from "../steps/name/Name.jsx";
import Avatar from "../steps/avatar/Avatar.jsx";

const Activate = () => {
    const [step, setStep] = useState(1);

    const steps = {
        1: Name,
        2: Avatar,
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

export default Activate;