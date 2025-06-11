// ManageTheatreNavbar.jsx
const ManageTheatreNavbar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { label: 'Add Theatre', key: 'addTheatre' },
    { label: 'Theatre Details', key: 'theatreDetails' },
    { label: 'Add Movie', key: 'addMovie' },
    { label: 'Add Show', key: 'addShow' },
    { label: "Today's Shows", key: 'todaysShows' }
  ];

  return (
    <div className="bg-sky-400 p-6 rounded">
      <div className="flex flex-wrap gap-4 bg-gray-300 px-4 py-2 rounded">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === tab.key ? 'bg-gray-400' : 'hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageTheatreNavbar;
