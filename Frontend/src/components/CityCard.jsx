const CityCard = ({ city, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        isSelected
          ? 'border-sky-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-blue-300 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className={`font-semibold text-lg ${isSelected ? 'text-sky-700' : 'text-gray-800'}`}>
            {city.name}
          </h4>
        </div>
        {isSelected && (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    </button>
  );
};
export default CityCard;