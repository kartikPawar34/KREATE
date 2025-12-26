import React from 'react';

// InvertPage component displays the inverted image with a download button
const InvertPage = ({ invertedImage }) => {
  if (!invertedImage) {
    return null;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = invertedImage;
    link.download = 'kreate_inverted.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Processed Image (Inverted)</h2>
      <img
        src={invertedImage}
        alt="Inverted"
        // Adjusted max-w and max-h for a larger preview
        className="max-w-lg max-h-96 object-contain rounded-lg shadow-lg border-2 border-teal-400"
      />
      <button
        onClick={handleDownload}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        Download Image
      </button>
    </div>
  );
};

export default InvertPage;