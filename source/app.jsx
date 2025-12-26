import React, { useState } from 'react';
import Welcome from './Welcome.jsx'; // Import the new Welcome component
import FeatureSelection from './FeatureSelection.jsx';
import ImageProcessingWorkflow from './ImageProcessingWorkflow.jsx';
import FilterSelectionPage from './FilterSelectionPage.jsx';

// Main App component: Manages which feature or filter selection is currently active
const App = () => {
  // State to track the currently selected main feature ('none', 'background-removal', 'cropping', 'filters')
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex flex-col items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl text-center relative">
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

export default App;
