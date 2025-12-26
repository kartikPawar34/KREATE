import React from 'react';

// BlackAndWhitePage component displays the black and white image with a download button
const BlackAndWhitePage = ({ bwImage }) => {
  if (!bwImage) {
    return null;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = bwImage;
    link.download = 'kreate_black_white.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Processed Image (Black & White)</h2>
      <img
        src={bwImage}
        alt="Black and White"
        className="image-preview" // Using custom CSS class
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

export default BlackAndWhitePage;