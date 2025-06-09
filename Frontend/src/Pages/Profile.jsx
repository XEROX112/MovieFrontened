import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Profile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [moblieNo, setmoblieNo] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [married, setMarried] = useState(null); // null / true / false
    const [pincode, setPincode] = useState('');
    const [address1, setAddress1] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    const handlePictureClick = () => fileInputRef.current?.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedImage(URL.createObjectURL(file));
    };

    const labelWidth = "w-40";

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
                <div className="flex items-center gap-4 bg-sky-300 text-white p-4 rounded-t">
                    <div
                        className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold cursor-pointer border border-gray-300 overflow-hidden"
                        onClick={handlePictureClick}
                    >
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt="profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <span className="text-center leading-tight">
                                + Add
                                <br />
                                Picture
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
                    <h2 className="text-xl font-semibold">Hi, Guest</h2>
                </div>

                {/* Account Details */}
                <section className="mt-10 bg-gray-50 p-4 rounded shadow-inner space-y-4">
                    <h3 className="font-bold text-xl mb-4">Account Details</h3>

                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 p-2 border rounded"
                            placeholder="Enter your email"
                        />
                        <button
                            className="text-red-500 text-sm whitespace-nowrap"
                            onClick={() => navigate('/edit-id')}
                            type="button"
                        >
                            Edit
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth}  font-semibold text-slate-500`}>Mobile Number</label>
                        <input
                            type="tel"
                            value={moblieNo}
                            onChange={(e) => setmoblieNo(e.target.value)}
                            placeholder="Enter your Phone"
                            className="flex-1 p-2 border rounded bg-gray-100 cursor-not-allowed"
                        />
                        {/* Removed Edit button here */}
                    </div>
                </section>


                {/* Personal Details */}
                <section className="mt-10 bg-gray-50 p-4 rounded shadow-inner space-y-4">
                    <h3 className="font-bold text-xl">Personal Details</h3>

                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth}  font-semibold text-slate-500`}>First Name</label>
                        <input
                            className={`flex-1 p-2 border rounded ${!firstName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter first name here"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    {!firstName && (
                        <p className="text-red-500 text-sm ml-[calc(10rem+1rem)] mt-[-1rem] mb-2">
                            This is a Required Field
                        </p>
                    )}

                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth}  font-semibold text-slate-500`}>Last Name</label>
                        <input
                            className={`flex-1 p-2 border rounded ${!lastName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter last name here"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    {!lastName && (
                        <p className="text-red-500 text-sm ml-[calc(10rem+1rem)] mt-[-1rem] mb-2">
                            This is a Required Field
                        </p>
                    )}

                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth}  font-semibold text-slate-500`}>Date of Birth</label>
                        <input
                            className="flex-1 p-2 border border-gray-300 rounded"
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth}  font-semibold text-slate-500`}>Gender</label>
                        <div className="flex gap-4">
                            <button
                                className={`border px-4 py-2 rounded ${gender === 'Woman' ? 'bg-sky-400 text-white' : ''
                                    }`}
                                onClick={() => setGender('Woman')}
                                type="button"
                            >
                                Woman
                            </button>
                            <button
                                className={`border px-4 py-2 rounded ${gender === 'Man' ? 'bg-sky-400 text-white' : ''
                                    }`}
                                onClick={() => setGender('Man')}
                                type="button"
                            >
                                Man
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth}  font-semibold text-slate-500`}>Married?</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setMarried(true)}
                                className={`border px-4 py-2 rounded ${married === true ? 'bg-sky-400 text-white' : ''
                                    }`}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setMarried(false)}
                                className={`border px-4 py-2 rounded ${married === false ? 'bg-sky-400 text-white' : ''
                                    }`}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </section>

                {/* Address */}
                <section className="mt-10 bg-gray-50 p-4 rounded shadow-inner space-y-4">
                    <h3 className="font-bold text-xl">Address (Optional)</h3>

                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Pincode</label>
                        <input
                            className="flex-1 p-2 border border-gray-300 rounded"
                            placeholder="E.g 560001"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Address 1</label>
                        <input
                            className="flex-1 p-2 border border-gray-300 rounded"
                            placeholder="Flat no., House no., Building,"
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Landmark</label>
                        <input
                            className="flex-1 p-2 border border-gray-300 rounded"
                            placeholder="E.g. Prithvi Theater"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>Town / City</label>
                        <input
                            className="flex-1 p-2 border border-gray-300 rounded"
                            placeholder="E.g. Mumbai"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className={`${labelWidth} font-semibold text-slate-500`}>State</label>
                        <input
                            className="flex-1 p-2 border border-gray-300 rounded"
                            placeholder="E.g. Maharashtra"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                    </div>
                </section>
            </div>
            <div className="max-w-4xl mx-auto mt-6 flex justify-center">
                <button
                    className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded"
                    onClick={() => navigate('/')}
                >
                    Submit
                </button>
            </div>


            <Footer />

        </>
    );
}
