import React from 'react';
import { MapPin } from 'lucide-react';

const LocationButton = ({ selectedLocation, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 bg-blue-400 text-white px-4 py-2 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <MapPin size={16} />
      <span className="font-medium">{selectedLocation}</span>
    </button>
  );
};

export default LocationButton;
