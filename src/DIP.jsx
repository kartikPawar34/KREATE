import React, { useState, useRef, useEffect } from 'react';
const Welcome = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="hkreate">Kreate</h1> {/* Using the new hkreate class */}

      <p className="text-lg">
        Step into the world of effortless image transformation with Kreate. Today, you'll discover intuitive tools for background removal, precise cropping, and a suite of artistic filters to bring your visions to life. This is just the beginning; as your creative journey evolves, so too will Kreate, growing with you to unlock even more possibilities for your digital artistry. Let's create something amazing!
      </p>


      <button
        onClick={onGetStarted}
        className="bg-blue-600 ">
        Get Started
      </button>

      <div className="ma-prop">
        <p className="text-lg">Contact us</p>
        {/* Ensure these images are in your public folder. Using placeholders if not found. */}
        <a href="https://www.instagram.com/arte_playlist?igsh=MWc2eDNtNng0OWdraA==" ><img src="instagram.png" className="Ancher-tag" alt="Instagram"/></a>
        <a href="https://github.com/kartikPawar34" ><img src="github.png" className="Ancher-tag" alt="GitHub"/></a>
        <a href="#features" ><img src="linkedin.png" className="Ancher-tag" alt="Gmail"/></a>
      </div>
    </div>
  );
};
// --- END: Welcome Component ---


const FeatureSelection = ({ onSelectFeature }) => {
  const features = [
    { id: 'background-removal', name: 'Background remover', description: 'Automatically remove the background from your images. And download in original resolution' },
    { id: 'cropping', name: 'Crop Image', description: 'Crop your images to a specific size or area. Use x and y coordinates' },
    { id: 'filters', name: 'Image Filters', description: 'Apply various artistic and corrective filters to your images. Cool and basic filters' },
  ];

  return (
    <>
      <h1 className="text-4">Choose Your Kreate Feature</h1>
      <div className="grid ">
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={() => onSelectFeature(feature.id)}
            className="bg-gradient">
            <p className="text-sm font-bold mb-2 group-hover:text-yellow-300 transition duration-300">{feature.name}</p>
            <p className="text-sm">{feature.description}</p>
            <>
              <button className="mt-4 w-8 h-8 opacity-75 group-hover:opacity-100 group-hover:translate-x-1 transition duration-300">
                select
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </button>
            </>
          </div>
        ))}
      </div>
    </>
  );
};


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
      {/* Back button is now handled by the parent DIP component for consistency */}
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
// --- END: FilterSelectionPage Component ---


// --- START: Generic ResultPage Component (combines BgRemPage, CropPage, SharpenPage, etc.) ---
const ResultPage = ({ processedImage, title, downloadFileName }) => {
  if (!processedImage) {
    return null;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      <img
        src={processedImage}
        alt={title}
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
// --- END: Generic ResultPage Component ---


// --- START: UploadContent Component (formerly UploadContent.jsx) ---
const UploadContent = ({
  fileInputRef,
  handleImageChange,
  handleUploadClick,
  selectedImage,
  isLoading,
  handleRemoveBackground,
  handleCropImage,
  handleSharpenImage,
  handleBlackAndWhite,
  handleAdjustHue,
  handleAdjustContrast,
  handleAdjustSaturation,
  handleInvertColor,
  feature,
  filter, // Specific filter (if feature is 'filters')
  cropCoords,
  setCropCoords,
  filterIntensity, // Filter intensity state
  setFilterIntensity, // Setter for filter intensity
  isDrawingCrop, // NEW prop
  setIsDrawingCrop, // NEW prop
  startCropPoint, // NEW prop
  setStartCropPoint // NEW prop
}) => {

  const imageContainerRef = useRef(null); // Ref for the image display container

  // Handle changes to crop input fields
  const handleCropCoordChange = (e) => {
    const { name, value } = e.target;
    setCropCoords(prevCoords => ({
      ...prevCoords,
      [name]: parseInt(value) || 0 // Parse to integer, default to 0 if invalid
    }));
  };

  // Handle changes to filter intensity sliders
  const handleFilterIntensityChange = (e) => {
    const { name, value } = e.target;
    setFilterIntensity(prevIntensity => ({
      ...prevIntensity,
      [name]: parseInt(value)
    }));
  };

  // Determine the title for the current operation
  const getOperationTitle = () => {
    if (feature === 'background-removal') return 'Background Removal';
    if (feature === 'cropping') return 'Image Cropping';
    if (feature === 'filters') {
      if (filter === 'black-and-white') return 'Black & White Conversion';
      if (filter === 'sharpening') return 'Image Sharpening';
      if (filter === 'hue') return 'Hue Adjustment';
      if (filter === 'contrast') return 'Contrast Adjustment';
      if (filter === 'saturation') return 'Saturation Adjustment';
      if (filter === 'invert-color') return 'Invert Colors';
    }
    return '';
  };

  // Mouse down event for interactive cropping
  const handleMouseDown = (e) => {
    if (feature !== 'cropping' || !selectedImage || isLoading) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawingCrop(true);
    setStartCropPoint({ x, y });
    setCropCoords({ x, y, width: 0, height: 0 });
  };

  // Mouse move event for interactive cropping
  const handleMouseMove = (e) => {
    if (!isDrawingCrop || feature !== 'cropping' || !selectedImage || isLoading) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const x = Math.min(startCropPoint.x, currentX);
    const y = Math.min(startCropPoint.y, currentY);
    const width = Math.abs(currentX - startCropPoint.x);
    const height = Math.abs(currentY - startCropPoint.y);

    setCropCoords({ x, y, width, height });
  };

  // Mouse up event for interactive cropping
  const handleMouseUp = () => {
    if (feature !== 'cropping' || !selectedImage || isLoading) return;
    setIsDrawingCrop(false);
  };


  return (
    <>
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Kreate</h1>
      <p className="text-lg text-gray-600 mb-8">
        Upload an image to apply {getOperationTitle()}!
      </p>

      {/* Hidden file input element */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* Button to trigger file selection - NOW WRAPPED FOR CENTERING */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleUploadClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Select Image
        </button>
      </div>

      {/* Area to display the original image with interactive cropping overlay */}
      {selectedImage && (
        <div
          ref={imageContainerRef}
          className="image-preview-container" // Custom CSS class for size control
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // End drawing if mouse leaves container
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2 sr-only">Original Image</h2> {/* Screen reader only for title */}
          <img
            src={selectedImage}
            alt="Selected"
            className="image-preview" // Custom CSS class for image styling
            style={{ pointerEvents: 'none' }} // Prevent image dragging
          />
          {/* Cropping overlay */}
          {feature === 'cropping' && selectedImage && (
            <div
              className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 pointer-events-none"
              style={{
                left: `${cropCoords.x}px`,
                top: `${cropCoords.y}px`,
                width: `${cropCoords.width}px`,
                height: `${cropCoords.height}px`,
                display: (cropCoords.width > 0 || cropCoords.height > 0) ? 'block' : 'none' // Only show if a selection is made
              }}
            ></div>
          )}
        </div>
      )}

      {/* Conditional inputs for Cropping - now updated by interactive drawing */}
      {feature === 'cropping' && selectedImage && (
        <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Crop Coordinates (Pixels)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cropX" className="block text-sm font-medium text-gray-700">X (Left)</label>
              <input
                type="number"
                id="cropX"
                name="x"
                value={cropCoords.x}
                onChange={handleCropCoordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="cropY" className="block text-sm font-medium text-gray-700">Y (Top)</label>
              <input
                type="number"
                id="cropY"
                name="y"
                value={cropCoords.y}
                onChange={handleCropCoordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="cropWidth" className="block text-sm font-medium text-gray-700">Width</label>
              <input
                type="number"
                id="cropWidth"
                name="width"
                value={cropCoords.width}
                onChange={handleCropCoordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="cropHeight" className="block text-sm font-medium text-gray-700">Height</label>
              <input
                type="number"
                id="cropHeight"
                name="height"
                value={cropCoords.height}
                onChange={handleCropCoordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <button
            onClick={() => {
              // Reset crop coords to full image dimensions
              const img = new Image();
              img.onload = () => {
                setCropCoords({ x: 0, y: 0, width: img.width, height: img.height });
              };
              img.src = selectedImage;
            }}
            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Reset to Full Image
          </button>
        </div>
      )}

      {/* Conditional Intensity Slider for Filters */}
      {feature === 'filters' && (filter === 'black-and-white' || filter === 'sharpening' || filter === 'hue' || filter === 'contrast' || filter === 'saturation') && selectedImage && (
        <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            {filter === 'black-and-white' && 'Black & White Intensity'}
            {filter === 'sharpening' && 'Sharpening Intensity'}
            {filter === 'hue' && 'Hue Shift'}
            {filter === 'contrast' && 'Contrast Adjustment'}
            {filter === 'saturation' && 'Saturation Adjustment'}
            ({filterIntensity[filter]}%)
          </h3>
          <input
            type="range"
            min={filter === 'hue' ? 0 : 0} // Hue range 0-100 for UI, mapped to -180 to 180 in backend
            max={100}
            name={filter}
            value={filterIntensity[filter]}
            onChange={handleFilterIntensityChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
          />
        </div>
      )}


      {/* Action Buttons for DIP Algorithms - conditionally rendered based on selected feature/filter */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        {feature === 'background-removal' && (
          <button
            onClick={handleRemoveBackground}
            disabled={!selectedImage || isLoading}
            className={`py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform ${
              !selectedImage || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white font-bold hover:scale-105'
            } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Remove Background'
            )}
          </button>
        )}

        {feature === 'cropping' && (
          <>
            <button
              onClick={() => handleCropImage(false)} // Rectangular crop
              disabled={!selectedImage || isLoading || cropCoords.width === 0 || cropCoords.height === 0}
              className={`py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform ${
                !selectedImage || isLoading || cropCoords.width === 0 || cropCoords.height === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold hover:scale-105'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Apply Rectangular Crop'
            )}
          </button>
            <button
              onClick={() => handleCropImage(true)} // Circular crop
              disabled={!selectedImage || isLoading || cropCoords.width === 0 || cropCoords.height === 0}
              className={`py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform ${
                !selectedImage || isLoading || cropCoords.width === 0 || cropCoords.height === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-700 text-white font-bold hover:scale-105'
              } focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Apply Circular Crop'
            )}
          </button>
          </>
        )}

        {feature === 'filters' && filter === 'sharpening' && (
          <button
            onClick={handleSharpenImage}
            disabled={!selectedImage || isLoading}
            className={`py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform ${
              !selectedImage || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700 text-white font-bold hover:scale-105'
            } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Apply Sharpen'
            )}
          </button>
        )}

        {feature === 'filters' && filter === 'black-and-white' && (
          <button
            onClick={handleBlackAndWhite}
            disabled={!selectedImage || isLoading}
            className={`py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform ${
              !selectedImage || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-800 text-white font-bold hover:scale-105'
            } focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Apply Black & White'
            )}
          </button>
        )}

        {feature === 'filters' && filter === 'hue' && (
          <button
            onClick={handleAdjustHue}
            disabled={!selectedImage || isLoading}
            className={`py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform ${
              !selectedImage || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white font-bold hover:scale-105'
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Apply Hue'
            )}
          </button>
        )}

        {feature === 'filters' && filter === 'contrast' && (
          <button
            onClick={handleAdjustContrast}
            disabled={!selectedImage || isLoading}
            className={`py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform ${
              !selectedImage || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white font-bold hover:scale-105'
            } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Apply Contrast'
            )}
          </button>
        )}

        {feature === 'filters' && filter === 'saturation' && (
          <button
            onClick={handleAdjustSaturation}
            disabled={!selectedImage || isLoading}
            className={`py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform ${
              !selectedImage || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white font-bold hover:scale-105'
            } focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Apply Saturation'
            )}
          </button>
        )}

        {feature === 'filters' && filter === 'invert-color' && (
          <button
            onClick={handleInvertColor}
            disabled={!selectedImage || isLoading}
            className={`py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform ${
              !selectedImage || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 text-white font-bold hover:scale-105'
            } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Invert Colors'
            )}
          </button>
        )}
      </div>
    </>
  );
};
// --- END: UploadContent Component ---


// --- START: ImageProcessingWorkflow Component (formerly ImageProcessingWorkflow.jsx) ---
const ImageProcessingWorkflow = ({ feature, filter, onGoBack }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null); // For background removal
  const [croppedImage, setCroppedImage] = useState(null);   // For cropping
  const [sharpenedImage, setSharpenedImage] = useState(null);
  const [bwImage, setBwImage] = useState(null);
  const [hueImage, setHueImage] = useState(null);
  const [contrastImage, setContrastImage] = useState(null);
  const [saturationImage, setSaturationImage] = useState(null);
  const [invertedImage, setInvertedImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const selectedFileRef = useRef(null);

  // State for cropping coordinates
  const [cropCoords, setCropCoords] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // State for filter intensities
  const [filterIntensity, setFilterIntensity] = useState({
    sharpening: 100,
    'black-and-white': 100,
    hue: 0, // Hue shift from -180 to 180 (represented as 0-100 for UI, then mapped)
    contrast: 100,
    saturation: 100,
  });

  // State to track which operation's result to show within this workflow
  const [currentResultType, setCurrentResultType] = useState('none');

  // State for interactive cropping
  const [isDrawingCrop, setIsDrawingCrop] = useState(false);
  const [startCropPoint, setStartCropPoint] = useState({ x: 0, y: 0 });


  // Reset all states when the feature or filter changes
  useEffect(() => {
    setSelectedImage(null);
    setProcessedImage(null);
    setCroppedImage(null);
    setSharpenedImage(null);
    setBwImage(null);
    setHueImage(null);
    setContrastImage(null);
    setSaturationImage(null);
    setInvertedImage(null);
    setIsLoading(false);
    setCropCoords({ x: 0, y: 0, width: 0, height: 0 });
    setFilterIntensity({ // Reset intensities to defaults
      sharpening: 100,
      'black-and-white': 100,
      hue: 0,
      contrast: 100,
      saturation: 100,
    });
    setCurrentResultType('none');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    selectedFileRef.current = null;
    setIsDrawingCrop(false); // Reset drawing state
    setStartCropPoint({ x: 0, y: 0 }); // Reset start point
  }, [feature, filter]);


  // Handles image selection from the file input
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      selectedFileRef.current = file;
      setSelectedImage(URL.createObjectURL(file));
      // Clear all previous results on new selection
      clearAllResults();
      // Attempt to get image dimensions for initial crop suggestion
      const img = new Image();
      img.onload = () => {
        setCropCoords({ x: 0, y: 0, width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    }
  };

  // Triggers the hidden file input click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Generic function to clear all result images
  const clearAllResults = () => {
    setProcessedImage(null);
    setCroppedImage(null);
    setSharpenedImage(null);
    setBwImage(null);
    setHueImage(null);
    setContrastImage(null);
    setSaturationImage(null);
    setInvertedImage(null);
    setCurrentResultType('none');
  };

  // Handles the background removal process
  const handleRemoveBackground = async () => {
    if (!selectedFileRef.current) { alert('Please select an image first!'); return; }
    setIsLoading(true); clearAllResults();

    const formData = new FormData();
    formData.append('image', selectedFileRef.current);

    try {
      const response = await fetch('http://127.0.0.1:5000/remove-background', { method: 'POST', body: formData, });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to remove background'); }
      const imageBlob = await response.blob();
      setProcessedImage(URL.createObjectURL(imageBlob));
      setCurrentResultType('bgrem');
    } catch (error) {
      console.error('Error processing image for background removal:', error);
      alert(`Error removing background: ${error.message}`);
    } finally { setIsLoading(false); }
  };

  // Handles the image cropping process
  const handleCropImage = async (isCircular = false) => {
    if (!selectedFileRef.current) { alert('Please select an image first!'); return; }
    if (!isCircular && (cropCoords.width <= 0 || cropCoords.height <= 0 || cropCoords.x < 0 || cropCoords.y < 0)) {
      alert('Please enter valid cropping coordinates (width and height must be positive, and coordinates non-negative).');
      return;
    }

    setIsLoading(true); clearAllResults();

    const formData = new FormData();
    formData.append('image', selectedFileRef.current);
    formData.append('x', cropCoords.x);
    formData.append('y', cropCoords.y);
    formData.append('width', cropCoords.width);
    formData.append('height', cropCoords.height);
    formData.append('circular', isCircular ? 'true' : 'false');

    try {
      const response = await fetch('http://127.0.0.1:5000/crop-image', { method: 'POST', body: formData, });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to crop image'); }
      const imageBlob = await response.blob();
      setCroppedImage(URL.createObjectURL(imageBlob));
      setCurrentResultType('crop');
    } catch (error) {
      console.error('Error processing image for cropping:', error);
      alert(`Error cropping image: ${error.message}`);
    } finally { setIsLoading(false); }
  };

  // Handles the image sharpening process (with intensity)
  const handleSharpenImage = async () => {
    if (!selectedFileRef.current) { alert('Please select an image first!'); return; }
    setIsLoading(true); clearAllResults();

    const formData = new FormData();
    formData.append('image', selectedFileRef.current);
    formData.append('intensity', filterIntensity.sharpening / 100.0);

    try {
      const response = await fetch('http://127.0.0.1:5000/sharpen-image', { method: 'POST', body: formData, });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to sharpen image'); }
      const imageBlob = await response.blob();
      setSharpenedImage(URL.createObjectURL(imageBlob));
      setCurrentResultType('sharpen');
    } catch (error) {
      console.error('Error processing image for sharpening:', error);
      alert(`Error sharpening image: ${error.message}`);
    } finally { setIsLoading(false); }
  };

  // Handles the black and white conversion process (with intensity)
  const handleBlackAndWhite = async () => {
    if (!selectedFileRef.current) { alert('Please select an image first!'); return; }
    setIsLoading(true); clearAllResults();

    const formData = new FormData();
    formData.append('image', selectedFileRef.current);
    formData.append('intensity', filterIntensity['black-and-white'] / 100.0);

    try {
      const response = await fetch('http://127.0.0.1:5000/black-and-white', { method: 'POST', body: formData, });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to convert to B&W'); }
      const imageBlob = await response.blob();
      setBwImage(URL.createObjectURL(imageBlob));
      setCurrentResultType('black-and-white');
    } catch (error) {
      console.error('Error processing image for B&W conversion:', error);
      alert(`Error converting to B&W: ${error.message}`);
    } finally { setIsLoading(false); }
  };

  // Handles Hue adjustment
  const handleAdjustHue = async () => {
    if (!selectedFileRef.current) { alert('Please select an image first!'); return; }
    setIsLoading(true); clearAllResults();

    const formData = new FormData();
    formData.append('image', selectedFileRef.current);
    const hueShiftDegrees = (filterIntensity.hue / 100.0) * 360 - 180; // Map 0-100 to -180 to 180
    formData.append('hue_shift', hueShiftDegrees);

    try {
      const response = await fetch('http://127.0.0.1:5000/adjust-hue', { method: 'POST', body: formData, });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to adjust hue'); }
      const imageBlob = await response.blob();
      setHueImage(URL.createObjectURL(imageBlob));
      setCurrentResultType('hue');
    } catch (error) {
      console.error('Error processing image for hue adjustment:', error);
      alert(`Error adjusting hue: ${error.message}`);
    } finally { setIsLoading(false); }
  };

  // Handles Contrast adjustment
  const handleAdjustContrast = async () => {
    if (!selectedFileRef.current) { alert('Please select an image first!'); return; }
    setIsLoading(true); clearAllResults();

    const formData = new FormData();
    formData.append('image', selectedFileRef.current);
    const contrastFactor = filterIntensity.contrast / 50.0; // Map 0-100 to 0.0-2.0 (1.0 is original)
    formData.append('factor', contrastFactor);

    try {
      const response = await fetch('http://127.0.0.1:5000/adjust-contrast', { method: 'POST', body: formData, });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to adjust contrast'); }
      const imageBlob = await response.blob();
      setContrastImage(URL.createObjectURL(imageBlob));
      setCurrentResultType('contrast');
    } catch (error) {
      console.error('Error processing image for contrast adjustment:', error);
      alert(`Error adjusting contrast: ${error.message}`);
    } finally { setIsLoading(false); }
  };

  // Handles Saturation adjustment
  const handleAdjustSaturation = async () => {
    if (!selectedFileRef.current) { alert('Please select an image first!'); return; }
    setIsLoading(true); clearAllResults();

    const formData = new FormData();
    formData.append('image', selectedFileRef.current);
    const saturationFactor = filterIntensity.saturation / 50.0; // Map 0-100 to 0.0-2.0 (1.0 is original)
    formData.append('factor', saturationFactor);

    try {
      const response = await fetch('http://127.0.0.1:5000/adjust-saturation', { method: 'POST', body: formData, });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to adjust saturation'); }
      const imageBlob = await response.blob();
      setSaturationImage(URL.createObjectURL(imageBlob));
      setCurrentResultType('saturation');
    } catch (error) {
      console.error('Error processing image for saturation adjustment:', error);
      alert(`Error adjusting saturation: ${error.message}`);
    } finally { setIsLoading(false); }
  };

  // Handles Invert Color
  const handleInvertColor = async () => {
    if (!selectedFileRef.current) { alert('Please select an image first!'); return; }
    setIsLoading(true); clearAllResults();

    const formData = new FormData();
    formData.append('image', selectedFileRef.current);

    try {
      const response = await fetch('http://127.0.0.1:5000/invert-colors', { method: 'POST', body: formData, });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to invert colors'); }
      const imageBlob = await response.blob();
      setInvertedImage(URL.createObjectURL(imageBlob));
      setCurrentResultType('invert-color');
    } catch (error) {
      console.error('Error processing image for color inversion:', error);
      alert(`Error inverting colors: ${error.message}`);
    } finally { setIsLoading(false); }
  };


  return (
    <>
      {/* Back button to return to feature selection or filter selection (handled by parent DIP) */}

      {/* Render the UploadContent component, passing all necessary props */}
      <UploadContent
        fileInputRef={fileInputRef}
        handleImageChange={handleImageChange}
        handleUploadClick={handleUploadClick}
        selectedImage={selectedImage}
        isLoading={isLoading}
        handleRemoveBackground={handleRemoveBackground}
        handleCropImage={handleCropImage}
        handleSharpenImage={handleSharpenImage}
        handleBlackAndWhite={handleBlackAndWhite}
        handleAdjustHue={handleAdjustHue}
        handleAdjustContrast={handleAdjustContrast}
        handleAdjustSaturation={handleAdjustSaturation}
        handleInvertColor={handleInvertColor}
        feature={feature}
        filter={filter}
        cropCoords={cropCoords}
        setCropCoords={setCropCoords}
        filterIntensity={filterIntensity}
        setFilterIntensity={setFilterIntensity}
        isDrawingCrop={isDrawingCrop}
        setIsDrawingCrop={setIsDrawingCrop}
        startCropPoint={startCropPoint}
        setStartCropPoint={setStartCropPoint}
      />

      {/* Conditionally render result pages using the generic ResultPage component */}
      {currentResultType === 'bgrem' && processedImage && (
        <ResultPage processedImage={processedImage} title="Processed Image (Background Removed)" downloadFileName="kreate_bg_removed.png" />
      )}
      {currentResultType === 'crop' && croppedImage && (
        <ResultPage processedImage={croppedImage} title="Processed Image (Cropped)" downloadFileName="kreate_cropped.png" />
      )}
      {currentResultType === 'sharpen' && sharpenedImage && (
        <ResultPage processedImage={sharpenedImage} title="Processed Image (Sharpened)" downloadFileName="kreate_sharpened.png" />
      )}
      {currentResultType === 'black-and-white' && bwImage && (
        <ResultPage processedImage={bwImage} title="Processed Image (Black & White)" downloadFileName="kreate_black_white.png" />
      )}
      {currentResultType === 'hue' && hueImage && (
        <ResultPage processedImage={hueImage} title="Processed Image (Hue Adjusted)" downloadFileName="kreate_hue_adjusted.png" />
      )}
      {currentResultType === 'contrast' && contrastImage && (
        <ResultPage processedImage={contrastImage} title="Processed Image (Contrast Adjusted)" downloadFileName="kreate_contrast_adjusted.png" />
      )}
      {currentResultType === 'saturation' && saturationImage && (
        <ResultPage processedImage={saturationImage} title="Processed Image (Saturation Adjusted)" downloadFileName="kreate_saturation_adjusted.png" />
      )}
      {currentResultType === 'invert-color' && invertedImage && (
        <ResultPage processedImage={invertedImage} title="Processed Image (Inverted)" downloadFileName="kreate_inverted.png" />
      )}
    </>
  );
};
// --- END: ImageProcessingWorkflow Component ---


// --- START: Main DIP Component (formerly App.jsx logic) ---
const DIP = () => {
  // State to track the currently selected main feature ('welcome', 'none', 'background-removal', 'cropping', 'filters')
  // Initialize to 'welcome' to show the Welcome component first
  const [selectedFeature, setSelectedFeature] = useState('welcome');
  // State to track the specific filter selected when 'filters' is the main feature
  const [selectedFilter, setSelectedFilter] = useState('none');

  // Function to set the active main feature
  const handleSelectFeature = (feature) => {
    setSelectedFeature(feature);
    setSelectedFilter('none'); // Reset filter when a new main feature is selected
  };

  // Function to set the active filter within the 'filters' category
  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter);
  };

  // Function to go back from a specific filter to the filter selection page
  const handleBackToFilters = () => {
    setSelectedFilter('none');
  };

  // Function to go back from any workflow to the main feature selection
  const handleGoBackToFeatures = () => {
    setSelectedFeature('none');
    setSelectedFilter('none'); // Ensure both are reset
  };

  // Function to transition from Welcome screen to FeatureSelection
  const handleGetStarted = () => {
    setSelectedFeature('none'); // 'none' will trigger FeatureSelection
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-montserrat relative overflow-hidden">
      {/* The video background is now in index.html, so no video tag here */}

      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl text-center relative z-10">
        {selectedFeature !== 'welcome' && selectedFeature !== 'none' && ( // Conditionally render Back button
          <button
            onClick={selectedFilter !== 'none' ? handleBackToFilters : handleGoBackToFeatures}
            className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          >
            &larr; Back {selectedFilter !== 'none' ? 'to Filters' : 'to Features'}
          </button>
        )}

        {selectedFeature === 'welcome' ? (
          <Welcome onGetStarted={handleGetStarted} />
        ) : selectedFeature === 'none' ? (
          // Show main feature selection cards
          <FeatureSelection onSelectFeature={handleSelectFeature} />
        ) : selectedFeature === 'filters' && selectedFilter === 'none' ? (
          // Show filter selection page if 'filters' is selected but no specific filter is chosen
          <FilterSelectionPage
            onSelectFilter={handleSelectFilter}
            onGoBack={handleGoBackToFeatures} // Back to main features
          />
        ) : (
          // Show the image processing workflow for the selected feature or specific filter
          <ImageProcessingWorkflow
            feature={selectedFeature}
            filter={selectedFilter} // Pass the specific filter
            onGoBack={selectedFilter !== 'none' ? handleBackToFilters : handleGoBackToFeatures}
          />
        )}
      </div>
    </div>
  );
};

export default DIP;
// --- END: Main DIP Component ---
