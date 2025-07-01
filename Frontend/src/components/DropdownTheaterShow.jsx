import { useState } from 'react';
import TodayShows from "../Pages/TodayShows";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";

export default function DropdownTheaterShow({ theaters }) {
  const [openTheaterId, setOpenTheaterId] = useState(null);

  const toggleTheater = (theaterId) => {
    const newOpenId = openTheaterId === theaterId ? null : theaterId;
    setOpenTheaterId(newOpenId);
    if (newOpenId) {
      localStorage.setItem("theater_Id", newOpenId);
    }
  };

  return (
    <div className="space-y-6">
      {theaters.map((theater) => (
        <div key={theater.theaterId} className="border rounded-xl shadow bg-white">
          <div
            onClick={() => toggleTheater(theater.theaterId)}
            className="cursor-pointer px-6 py-4 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition"
          >
            <div>
              <h2 className="text-xl font-semibold text-sky-500">{theater.theaterName}</h2>
              <p className="text-sm text-sky-400 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {theater.theaterLocation}, {theater.theaterRegion}
              </p>
            </div>
            {openTheaterId === theater.theaterId ? (
              <ChevronUp className="w-6 h-6 text-gray-500" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-500" />
            )}
          </div>

          {openTheaterId === theater.theaterId && (
            <div className="p-4">
              <TodayShows theaterId={theater.theaterId} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
