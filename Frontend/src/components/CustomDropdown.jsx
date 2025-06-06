import React, { useState, useRef, useEffect } from 'react';

const CustomDropdown = ({ options, placeholder, selectedOptions, setSelectedOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHoveredIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-200 text-black border-2 border-gray-500 rounded-lg px-4 py-3 font-semibold text-left flex flex-wrap gap-2 min-h-[3rem]"
      >
        {selectedOptions.length > 0
          ? selectedOptions.map((opt) => (
            <span
              key={opt}
              className="bg-blue-300 text-blue-900 rounded-full px-3 py-1 text-sm"
            >
              {opt}
            </span>
          ))
          : placeholder}
      </button>

      {isOpen && (
        <ul className="absolute z-20 w-full max-h-48 overflow-auto border border-gray-300 rounded shadow-md bg-white mt-1">
          {options.map((option, idx) => (
            <li
              key={option}
              onClick={() => toggleOption(option)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(-1)}
              className={`cursor-pointer px-4 py-3 select-none flex items-center gap-2
      ${selectedOptions.includes(option)
                  ? 'text-blue-400 font-semibold'
                  : hoveredIndex === idx
                    ? 'bg-slate-200 text-black'
                    : 'text-black'
                }
    `}
            >
              <span>{option}</span>
            </li>
          ))}

        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
