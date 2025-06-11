import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { FaArrowLeft } from "react-icons/fa";

export default function EmailVerification() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  /* ───────────────────────── helpers ───────────────────────── */
  const emailRegex =
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const isValid = emailRegex.test(email);

  const handleVerify = () => {
    // because this page lives at /profile/verify-email
    // a relative push of "otp" becomes /profile/verify-email/otp
    navigate("otp");
  };

  /* ───────────────────────── ui ───────────────────────── */
  return (
    <div className="min-h-screen flex flex-col bg-neutral-800">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white px-6 py-10 space-y-8 rounded-md">

          {/* back to Profile */}
          <button
            className="text-sky-300 flex items-center mb-6 text-lg font-semibold"
            onClick={() => navigate('/')}
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <div className="text-left space-y-1">
            <h1 className="text-2xl font-semibold">
              Edit Email Address
            </h1>
            <p className="text-sm text-gray-500">
              We’ll send a one-time password to verify this email.
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">
              Enter a valid email address below
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-3 text-lg border border-gray-300 rounded-lg outline-none"
              placeholder="you@example.com"
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={!isValid}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isValid
                ? "bg-sky-300 text-white hover:sky-400"
                : "bg-sky-100 text-white cursor-not-allowed"
            }`}
          >
            Verify
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
