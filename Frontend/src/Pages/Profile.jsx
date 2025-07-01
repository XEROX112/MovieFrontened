import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [married, setMarried] = useState(null);
    const [pincode, setPincode] = useState('');
    const [address1, setAddress1] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    const { user, logout, showLogin, setShowLogin, showSignup, setShowSignup, login } = useAuth();
    const navigate = useNavigate();

    const api = "http://localhost:8080/api/users";

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }

        const fetchUserData = async () => {
            try {
                const jwt = localStorage.getItem("jwt");
                const userId = user?.id;
                const useremail = user?.email;
                if (!jwt || !userId) return;

                const response = await axios.get(`${api}/${userId}/user`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        'X-User-Email': useremail,
                    },
                });

                const data = response.data;
                setFirstName(data.firstName ?? '');
                setLastName(data.lastName ?? '');
                setEmail(data.email ?? '');
                setMobileNo(data.phoneNumber ?? '');
                setDob(data.dateOfBirth ?? '');
                setGender(data.gender ?? '');
                setMarried(data.married ?? null);
                setPincode(data.pincode ?? '');
                setAddress1(data.address ?? '');
                setLandmark(data.landmark ?? '');
                setCity(data.city ?? '');
                setState(data.state ?? '');
                setSelectedImage(data.image ?? null);


            } catch (err) {
                console.error("Error fetching user data", err);
            }
        };

        fetchUserData();
    }, [user, navigate]);

    const handlePictureClick = () => fileInputRef.current?.click();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedImage(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("file", file);

        try {
            const jwt = localStorage.getItem("jwt");
            await axios.post("http://localhost:8080/api/users/upload", formData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Image uploaded successfully!");
        } catch (err) {
            console.error("Image upload failed:", err);
            alert("Image upload failed: " + (err.response?.data || err.message));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            firstName: firstName || null,
            lastName: lastName || null,
            married: married ?? false,
            gender: gender || null,
            dateOfBirth: dob || null,
            phoneNumber: mobileNo || null,
            email: email || null,
            pincode: pincode || null,
            address: address1 || null,
            landmark: landmark || null,
            city: city || null,
            state: state || null,
        };

        try {
            const jwt = localStorage.getItem("jwt");
            const userId = user?.id;
            const response = await axios.put(`${api}/add/${userId}`, payload, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json",
                },
            });

            alert("Profile updated successfully.");
            navigate('/');
        } catch (err) {
            console.error("Error submitting profile:", err);
            const msg = err.response?.data || "Unknown error";
            alert("Failed to update profile: " + msg);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const labelWidth = "w-40";

    return (
        <>
            <Navbar
                onLoginClick={() => {
                    setShowLogin(true);
                    setShowSignup(false);
                }}
                onSignupClick={() => {
                    setShowSignup(true);
                    setShowLogin(false);
                }}
                user={user}
                onLogout={handleLogout}
            />

            <button
                onClick={() => navigate("/")}
                className="text-sky-300 text-lg font-semibold mb-6 mt-8 flex items-center gap-2 transition-colors ml-44"
            >
                <FaArrowLeft className="w-5 h-5" /> Back
            </button>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded shadow">

                <div className="flex items-center gap-4 bg-sky-300 text-white p-4 rounded-t">
                    <div
                        className="relative w-24 h-24 bg-white rounded-full overflow-hidden border cursor-pointer"
                        onClick={handlePictureClick}
                    >
                        {selectedImage ? (
                            <img src={selectedImage} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm text-center">
                                + Add<br />Picture
                            </span>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                    <h2 className="text-xl font-semibold">Hi, {user?.username || 'Guest'}</h2>
                </div>

                {/* Account Details Section */}
                <section className="mt-10 bg-gray-50 p-4 rounded shadow-inner space-y-4">
                    <h3 className="font-bold text-xl mb-4">Account Details</h3>
                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Email Address</label>
                        <div className="flex-1 flex items-center gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                readOnly={!isEditingEmail}
                                className={`flex-1 p-2 border rounded ${isEditingEmail ? '' : 'bg-gray-100 cursor-not-allowed'}`}
                                placeholder="Enter your email"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditingEmail(true);
                                    navigate(`/profile/${user.id}/verify-email`);
                                }}
                                className="text-sky-500 font-medium text-sm underline"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Mobile Number</label>
                        <input
                            type="tel"
                            value={mobileNo}
                            onChange={(e) => setMobileNo(e.target.value)}
                            className="flex-1 p-2 border rounded bg-gray-100"
                        />
                    </div>
                </section>

                {/* Personal Details Section */}
                <section className="mt-10 bg-gray-50 p-4 rounded shadow-inner space-y-4">
                    <h3 className="font-bold text-xl">Personal Details</h3>
                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>First Name</label>
                        <input
                            className={`flex-1 p-2 border rounded ${!firstName ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter first name here"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Last Name</label>
                        <input
                            className={`flex-1 p-2 border rounded ${!lastName ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter last name here"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Date of Birth</label>
                        <input
                            type="date"
                            className="flex-1 p-2 border border-gray-300 rounded"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Gender</label>
                        <div className="flex gap-4">
                            <button type="button" className={`border px-4 py-2 rounded ${gender === 'Woman' ? 'bg-sky-400 text-white' : ''}`} onClick={() => setGender('Woman')}>Woman</button>
                            <button type="button" className={`border px-4 py-2 rounded ${gender === 'Man' ? 'bg-sky-400 text-white' : ''}`} onClick={() => setGender('Man')}>Man</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Married?</label>
                        <div className="flex gap-4">
                            <button type="button" className={`border px-4 py-2 rounded ${married === true ? 'bg-sky-400 text-white' : ''}`} onClick={() => setMarried(true)}>Yes</button>
                            <button type="button" className={`border px-4 py-2 rounded ${married === false ? 'bg-sky-400 text-white' : ''}`} onClick={() => setMarried(false)}>No</button>
                        </div>
                    </div>
                </section>

                {/* Address Section */}
                <section className="mt-10 bg-gray-50 p-4 rounded shadow-inner space-y-4">
                    <h3 className="font-bold text-xl">Address (Optional)</h3>
                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Pincode</label>
                        <input className="flex-1 p-2 border border-gray-300 rounded" placeholder="E.g 560001" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Address</label>
                        <input className="flex-1 p-2 border border-gray-300 rounded" placeholder="Flat no., House no., Building" value={address1} onChange={(e) => setAddress1(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Landmark</label>
                        <input className="flex-1 p-2 border border-gray-300 rounded" placeholder="E.g. Prithvi Theater" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>City</label>
                        <input className="flex-1 p-2 border border-gray-300 rounded" placeholder="E.g. Mumbai" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>State</label>
                        <input className="flex-1 p-2 border border-gray-300 rounded" placeholder="E.g. Maharashtra" value={state} onChange={(e) => setState(e.target.value)} />
                    </div>
                </section>

                <div className="flex justify-center mt-6">
                    <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded" type="submit">Submit</button>
                </div>
            </form>

            <Footer />

            {showLogin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 relative w-full max-w-md">
                        <button className="absolute top-2 right-3 text-gray-400 text-xl hover:text-gray-600" onClick={() => setShowLogin(false)}>×</button>
                        <Login
                            onLogin={login}
                            onSwitch={() => {
                                setShowLogin(false);
                                setShowSignup(true);
                            }}
                        />
                    </div>
                </div>
            )}

            {showSignup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 relative w-full max-w-md">
                        <button className="absolute top-2 right-3 text-gray-400 text-xl hover:text-gray-600" onClick={() => setShowSignup(false)}>×</button>
                        <Register
                            onSwitch={() => {
                                setShowSignup(false);
                                setShowLogin(true);
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
