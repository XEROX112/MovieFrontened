import React, { useRef, useState } from "react";
import Footer from "../components/Footer"
import { FaArrowLeft, FaStar, FaClock, FaGlobe, FaFilm } from 'react-icons/fa';
import { useNavigate } from "react-router-dom"; 


const OtpVerification = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [isComplete, setIsComplete] = useState(false);
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    /* ── handlers ───────────────────────────────────── */
    const handleChange = (el, idx) => {
        const val = el.value.replace(/[^0-9]/g, "");
        if (!val) return;

        const next = [...otp];
        next[idx] = val;
        setOtp(next);

        if (val && idx < 5) inputsRef.current[idx + 1].focus();
        setIsComplete(next.every((d) => d !== ""));
    };


    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            inputsRef.current[idx - 1].focus();
        }
    };

    const handleResend = () => {
        setOtp(Array(6).fill(""));
        setIsComplete(false);
        inputsRef.current[0].focus();
        alert("OTP Resent!");
    };

    const handleSubmit = () => {
        navigate("/");
    };



    return (
        <div className="min-h-screen flex flex-col bg-neutral-800">
            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md bg-white shadow-lg px-8 py-10 text-center space-y-6 rounded-md">
                    <button
                        className="text-sky-300 flex items-center mb-6 text-lg font-semibold"
                        onClick={() => navigate('/profile/verify-email')}
                    >
                        <FaArrowLeft className="mr-2" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Verify your Email Address</h2>
                        <p className="text-gray-600">
                            Enter OTP sent to <span className="font-semibold">jayabhardwaz!@gmail.com</span>
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
                                className="w-12 h-14 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:border-sky-400"
                            />
                        ))}
                    </div>

                    <p className="text-sm text-gray-700">
                        Didn’t receive OTP?{" "}
                        <button onClick={handleResend} className="text-sky-300 font-medium hover:underline">
                            Resend OTP
                        </button>
                    </p>

                    <button
                        onClick={handleSubmit}
                        disabled={!isComplete}
                        className={`w-full py-3 rounded-lg font-semibold transition ${isComplete
                            ? "bg-sky-300 text-white hover:bg-sky-300"
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

export default OtpVerification;
