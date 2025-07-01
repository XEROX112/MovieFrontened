import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import AddShow from "../Pages/AddShow";

const DropdownTheater = ({ theater, movies, screens }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-xl shadow bg-white">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer px-6 py-4 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition"
      >
        <div>
          <h2 className="text-xl font-semibold text-sky-500">{theater.theaterName}</h2>
          <p className="text-sm text-sky-400 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {theater.theaterLocation}, {theater.theaterRegion}
          </p>
        </div>
        {open ? (
          <ChevronUp className="w-6 h-6 text-gray-500" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-500" />
        )}
      </div>

      {open && (
        <div className="p-4">
          <AddShow
            theaterId={theater.theaterId}
            movies={movies}
            screens={screens}
          />
        </div>
      )}
    </div>
  );
};

export default DropdownTheater;
