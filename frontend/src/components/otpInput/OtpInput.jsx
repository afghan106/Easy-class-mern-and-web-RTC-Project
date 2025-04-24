import React, { useState, useEffect } from 'react';
import styles from './OTPInput.module.css'; // Import CSS module

const OTPInput = ({length, placeholder, onChange }) => {
    const [otp, setOtp] = useState(Array(length).fill(''));

    useEffect(() => {
        // Notify parent component about the OTP change
        if (onChange) {
            onChange(otp.join('')); // Join the OTP array into a string
        }
    }, [otp, onChange]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]*$/.test(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to the next input field
            if (value && index < length - 1) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    return (
        <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
                <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={styles.otpInput}
                    maxLength={1}
                    placeholder={placeholder}
                />
            ))}
        </div>
    );
};

export default OTPInput;