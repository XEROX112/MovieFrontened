import React from "react";

const BookTicketModal = ({ visible, onClose, movie, onFormatSelect }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 relative w-full max-w-md">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-xl text-gray-400"
                >
                    ×
                </button>
                <h2 className="text-xl font-semibold mb-4">{movie.title}</h2>
                <p className="text-gray-600 mb-4">Select language and format</p>

                {Object.entries(movie.formats).map(([language, formats]) => (
                    <div className="mb-6" key={language}>
                        {/* Grey background only for the language text */}
                        <h3 className="text-lg font-normal text-gray-700 uppercase bg-gray-200 px-3 py-1 rounded">
                            {language}
                        </h3>

                        {/* Flex container with equal gaps */}
                        <div className="flex flex-wrap gap-3 mt-3">
                            {formats.map((format) => (
                                <button
                                    key={format}
                                    className="border border-sky-300 px-4 py-2 rounded-full text-sky-300 bg-transparent hover:bg-sky-300 hover:text-white transition"
                                    onClick={() => {
                                        onFormatSelect(language, format);
                                        onClose();
                                    }}
                                >
                                    {format}
                                </button>
                            ))}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookTicketModal;
