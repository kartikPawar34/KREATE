import React from 'react';

// HuePage component displays the hue-adjusted image with a download button
const HuePage = ({ hueImage }) => {
  if (!hueImage) {
    return null;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = hueImage;
    link.download = 'kreate_hue_adjusted.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Processed Image (Hue Adjusted)</h2>
      <img
        src={hueImage}
        alt="Hue Adjusted"
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

export default HuePage;