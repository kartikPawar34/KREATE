import React, { useRef } from 'react';

// UploadContent component: Contains the common UI for image upload and action buttons
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

export default UploadContent;