import React from 'react';

// FeatureSelection component displays cards for different DIP features
const FeatureSelection = ({ onSelectFeature }) => {
  const features = [
    { id: 'background-removal', name: 'Remove Background', description: 'Automatically remove the background from your images.' },
    { id: 'cropping', name: 'Crop Image', description: 'Crop your images to a specific size or area.' },
    { id: 'filters', name: 'Image Filters', description: 'Apply various artistic and corrective filters to your images.' }, // NEW: Filters card
  ];

  return (
    <>
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Kreate</h1>
      <p className="text-lg text-gray-600 mb-8">
        Select a Digital Image Processing feature to get started!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={() => onSelectFeature(feature.id)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg cursor-pointer
                       transform transition duration-300 hover:scale-105 hover:shadow-xl
                       flex flex-col items-center justify-center text-center group"
          >
            <h2 className="text-2xl font-bold mb-2 group-hover:text-yellow-300 transition duration-300">{feature.name}</h2>
            <p className="text-sm opacity-90">{feature.description}</p>
            <svg className="mt-4 w-8 h-8 opacity-75 group-hover:opacity-100 group-hover:translate-x-1 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </div>
        ))}
      </div>
    </>
  );
};

export default FeatureSelection;
