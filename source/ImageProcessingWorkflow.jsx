import React, { useState, useRef, useEffect } from 'react';
import UploadContent from './uploadcontent.jsx';
import BgRemPage from './BgRemPage.jsx';
import CropPage from './CropPage.jsx';
import SharpenPage from './SharpenPage.jsx';
import BlackAndWhitePage from './BlackAndWhitePage.jsx';
import HuePage from './HuePage.jsx';
import ContrastPage from './ContrastPage.jsx';
import SaturationPage from './SaturationPage.jsx';
import InvertPage from './InvertPage.jsx';

// ImageProcessingWorkflow component: Manages the state and logic for image operations
const ImageProcessingWorkflow = ({ feature, filter, onGoBack }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null); // For background removal
  const [croppedImage, setCroppedImage] = useState(null);   // For cropping
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
      setProcessedImage(null);
      setCroppedImage(null);
      setSharpenedImage(null);
      setBwImage(null);
      setHueImage(null);
      setContrastImage(null);
      setSaturationImage(null);
      setInvertedImage(null);
      setCurrentResultType('none');
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
    const contrastFactor = filterIntensity.contrast / 50.0; // Map 0-100 to 0.0-2.0
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
    const saturationFactor = filterIntensity.saturation / 50.0; // Map 0-100 to 0.0-2.0
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
      {/* Back button to return to feature selection or filter selection */}
      <button
        onClick={onGoBack}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
      >
        &larr; Back {filter !== 'none' ? 'to Filters' : 'to Features'}
      </button>

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

      {/* Conditionally render result pages */}
      {currentResultType === 'bgrem' && processedImage && (
        <BgRemPage processedImage={processedImage} />
      )}
      {currentResultType === 'crop' && croppedImage && (
        <CropPage croppedImage={croppedImage} />
      )}
      {currentResultType === 'sharpen' && sharpenedImage && (
        <SharpenPage sharpenedImage={sharpenedImage} />
      )}
      {currentResultType === 'black-and-white' && bwImage && (
        <BlackAndWhitePage bwImage={bwImage} />
      )}
      {currentResultType === 'hue' && hueImage && (
        <HuePage hueImage={hueImage} />
      )}
      {currentResultType === 'contrast' && contrastImage && (
        <ContrastPage contrastImage={contrastImage} />
      )}
      {currentResultType === 'saturation' && saturationImage && (
        <SaturationPage saturationImage={saturationImage} />
      )}
      {currentResultType === 'invert-color' && invertedImage && (
        <InvertPage invertedImage={invertedImage} />
      )}
    </>
  );
};

export default ImageProcessingWorkflow;