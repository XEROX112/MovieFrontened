import React from 'react';
import clsx from 'clsx';

const Seat = ({ id, status, onSelect }) => {

  return (
    <div
      className={clsx(
        'w-6 h-6 m-1 text-center flex items-center justify-center rounded-s-sm cursor-pointer border text-sm font-medium',
        {
          'bg-white text-sky-400 border-sky-400': status === 'available',
          'bg-sky-400 text-white border-sky-400': status === 'selected',
          'bg-gray-300 text-white border-gray-300 cursor-not-allowed': status === 'booked',
        }
      )}
      onClick={() => status !== 'booked' && onSelect(id)}
    >
      {id.split('-')[1]}
    </div>
  );
};

export default Seat;
