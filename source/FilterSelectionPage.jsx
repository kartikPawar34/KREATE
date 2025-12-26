import React from 'react';

// FilterSelectionPage component displays cards for individual filters
const FilterSelectionPage = ({ onSelectFilter, onGoBack }) => {
  const filters = [
    { id: 'black-and-white', name: 'Black & White', description: 'Convert to monochrome with adjustable intensity.' },
    { id: 'sharpening', name: 'Sharpen Image', description: 'Enhance details with adjustable intensity.' },
    { id: 'hue', name: 'Adjust Hue', description: 'Shift the color tones of your image.' },
    { id: 'contrast', name: 'Adjust Contrast', description: 'Increase or decrease the difference between light and dark areas.' },
    { id: 'saturation', name: 'Adjust Saturation', description: 'Control the vividness or dullness of colors.' },
    { id: 'invert-color', name: 'Invert Colors', description: 'Create a negative effect by inverting all colors.' },
  ];

  return (
    <>
      <button
        onClick={onGoBack} // This button will now correctly navigate back to FeatureSelection
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
      >
        &larr; Back to Features
      </button>

      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Image Filters</h1>
      <p className="text-lg text-gray-600 mb-8">
        Choose a filter to apply to your image.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filters.map((filter) => (
          <div
            key={filter.id}
            onClick={() => onSelectFilter(filter.id)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg shadow-lg cursor-pointer
                       transform transition duration-300 hover:scale-105 hover:shadow-xl
                       flex flex-col items-center justify-center text-center group"
          >
            <h2 className="text-2xl font-bold mb-2 group-hover:text-yellow-300 transition duration-300">{filter.name}</h2>
            <p className="text-sm opacity-90">{filter.description}</p>
            <svg className="mt-4 w-8 h-8 opacity-75 group-hover:opacity-100 group-hover:translate-x-1 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </div>
        ))}
      </div>
    </>
  );
};

export default FilterSelectionPage;