import React, { useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import CityCard from './CityCard';
import axios from 'axios';
import isTokenExpired from '../Pages/isTokenExpired';

const LocationSelector = ({
    isOpen,
    onClose,
    selectedLocation,
    onLocationChange,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const token = localStorage.getItem("jwt");
                if (!token || isTokenExpired(token)) {
                    localStorage.removeItem("jwt");
                    localStorage.removeItem("user");
                    setUser(null);
                    throw new Error("Authentication required");
                }

                const response = await axios.get(`http://localhost:8080/admin/all-region`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const regions = response.data; // expected to be an array of strings
                const cityObjects = regions.map((region, index) => ({
                    id: index,
                    name: region,
                    state: '', // or derive from region if needed
                    popular: index < 6 // mark first 6 as popular, or change logic as needed
                }));

                setCities(cityObjects);
                setFilteredCities(cityObjects);
            } catch (error) {
                console.error("Error fetching regions:", error);
                if (error.response?.status === 401) {
                    localStorage.removeItem("jwt");
                    localStorage.removeItem("user");
                    setUser(null);
                    setError("Session expired. Please login again.");
                } else {
                    setError("Failed to fetch regions. Please try again.");
                }
            }
        };

        fetchRegions();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredCities(cities);
        } else {
            const filtered = cities.filter(city =>
                city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                city.state.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCities(filtered);
        }
    }, [searchTerm, cities]);

    const handleCitySelect = (city) => {
        onLocationChange(city.name);
        onClose();
    };

    const handleClose = () => {
        setSearchTerm('');
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const popularCities = filteredCities.filter(city => city.popular);
    const otherCities = filteredCities.filter(city => !city.popular);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="bg-sky-300 text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Choose Your City</h2>
                        <p className="text-blue-100 mt-1">Select your location to find movies near you</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for your city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 text-lg"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="p-6 max-h-96 overflow-y-auto">
                    {searchTerm.trim() === '' ? (
                        <>
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <MapPin className="mr-2" size={20} />
                                    Popular Cities
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {popularCities.map((city) => (
                                        <CityCard
                                            key={city.id}
                                            city={city}
                                            isSelected={selectedLocation === city.name}
                                            onClick={() => handleCitySelect(city)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">All Cities</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {otherCities.map((city) => (
                                        <CityCard
                                            key={city.id}
                                            city={city}
                                            isSelected={selectedLocation === city.name}
                                            onClick={() => handleCitySelect(city)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Search Results ({filteredCities.length})
                            </h3>
                            {filteredCities.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredCities.map((city) => (
                                        <CityCard
                                            key={city.id}
                                            city={city}
                                            isSelected={selectedLocation === city.name}
                                            onClick={() => handleCitySelect(city)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-lg">No cities found matching "{searchTerm}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationSelector;
