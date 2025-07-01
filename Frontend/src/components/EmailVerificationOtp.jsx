import React, { useRef, useState } from "react";
import Footer from "../components/Footer";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


const api = "http://localhost:8080/api/users";
const EmailVerificationOtp = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [isComplete, setIsComplete] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const inputsRef = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const handleChange = (el, idx) => {
        const val = el.value.replace(/[^0-9]/g, "");
        if (!val) return;

        const updatedOtp = [...otp];
        updatedOtp[idx] = val;
        setOtp(updatedOtp);
        setIsComplete(updatedOtp.every((digit) => digit !== ""));

        if (val && idx < 5) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace") {
            const updatedOtp = [...otp];
            if (otp[idx]) {
                updatedOtp[idx] = "";
                setOtp(updatedOtp);
                setIsComplete(updatedOtp.every((digit) => digit !== ""));
            } else if (idx > 0) {
                inputsRef.current[idx - 1]?.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("Text").slice(0, 6);
        const digits = pasted.split("").filter((char) => /[0-9]/.test(char));

        const updatedOtp = new Array(6).fill("");
        for (let i = 0; i < digits.length; i++) {
            updatedOtp[i] = digits[i];
        }

        setOtp(updatedOtp);
        setIsComplete(updatedOtp.every((digit) => digit !== ""));

        const nextEmptyIndex = updatedOtp.findIndex((val) => val === "");
        if (nextEmptyIndex !== -1) {
            inputsRef.current[nextEmptyIndex]?.focus();
        } else {
            inputsRef.current[5]?.blur();
        }
    };




    const handleSubmit = async () => {
        const otpCode = otp.join("");
        try {
            const jwt = localStorage.getItem("jwt");
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const userId = storedUser?.id;

            if (!jwt || !userId || !email) return;
            const response = await axios.post(
                `${api}/${userId}/verify-email-change-verify`,
                { otp: otpCode },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        'X-User-Email': email,
                    },
                }
            );
            setMessage({ text: "Email verified and updated successfully!", type: "success" });
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            console.error("Error sending email verification request", err);
            setMessage({
                text:
                    err.response?.data || "Invalid OTP or request failed. Please try again.",
                type: "error",
            });
        }
    };
    const handleResend = async () => {
        setOtp(new Array(6).fill(""));
        setIsComplete(false);
        setMessage({ text: "OTP has been resent!", type: "success" });
        inputsRef.current[0]?.focus();
        const otpCode = otp.join("");
        try {
            const jwt = localStorage.getItem("jwt");
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const userId = storedUser?.id;

            if (!jwt || !userId || !email) return;

            const response = await axios.post(
                `${api}/${userId}/request-email-change`,
                { email },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
        } catch (err) {
            console.error("Error sending email verification request", err);
        }

    };


    return (
        <div className="min-h-screen flex flex-col bg-neutral-800">
            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md bg-white shadow-lg px-8 py-10 text-center space-y-6 rounded-md">
                    <button
                        className="text-sky-300 flex items-center mb-6 text-lg font-semibold"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft className="mr-2" />
                        Back
                    </button>

                    <div>
                        <h2 className="text-2xl font-bold mb-2">Verify your Email Address</h2>
                        <p className="text-gray-600">
                            Enter the OTP sent to <span className="font-semibold">{email}</span>
                        </p>
                    </div>

                    <div className="flex justify-center gap-2">
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={(el) => (inputsRef.current[idx] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                onPaste={idx === 0 ? handlePaste : undefined}
                                className="w-12 h-14 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:border-sky-400"
                            />
                        ))}
                    </div>

                    {message.text && (
                        <p
                            className={`text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {message.text}
                        </p>
                    )}

                    <p className="text-sm text-gray-700">
                        Didn’t receive OTP?{" "}
                        <button
                            onClick={handleResend}
                            className="text-sky-300 font-medium hover:underline"
                        >
                            Resend OTP
                        </button>
                    </p>

                    <button
                        onClick={handleSubmit}
                        disabled={!isComplete}
                        className={`w-full py-3 rounded-lg font-semibold transition ${isComplete
                            ? "bg-sky-300 text-white hover:bg-sky-400"
                            : "bg-sky-100 text-white cursor-not-allowed"
                            }`}
                    >
                        Continue
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EmailVerificationOtp;
