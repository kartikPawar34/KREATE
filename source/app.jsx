import React, { useState } from 'react';
import Welcome from './Welcome.jsx'; 
import FeatureSelection from './FeatureSelection.jsx';
import ImageProcessingWorkflow from './ImageProcessingWorkflow.jsx';
import FilterSelectionPage from './FilterSelectionPage.jsx';

const App = () => {

  const [selectedFeature, setSelectedFeature] = useState('welcome');
  const [selectedFilter, setSelectedFilter] = useState('none');

  const handleSelectFeature = (feature) => {
    setSelectedFeature(feature);
    setSelectedFilter('none'); 
  };

  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const handleBackToFilters = () => {
    setSelectedFilter('none');
  };

  const handleGoBackToFeatures = () => {
    setSelectedFeature('none');
    setSelectedFilter('none'); 
  };

  const handleGetStarted = () => {
    setSelectedFeature('none'); 
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
          <FeatureSelection onSelectFeature={handleSelectFeature} />
        ) : selectedFeature === 'filters' && selectedFilter === 'none' ? (
      
          <FilterSelectionPage
            onSelectFilter={handleSelectFilter}
            onGoBack={handleGoBackToFeatures} // Back to main features
          />
        ) : (
      
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
