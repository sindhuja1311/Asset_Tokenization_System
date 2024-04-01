import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import {getPropertyDetails, ReturnAllRequestedListingPropertiesList,AcceptListingRequest } from '../../services/functions';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

function List() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssets, setFilteredAssets] = useState([]);

  useEffect(() => {
    const fetchAllPropertiesData = async () => {
      try {
        const propertyDetails = await ReturnAllRequestedListingPropertiesList();
        setFilteredAssets(propertyDetails); // Set all assets initially
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAllPropertiesData();
  }, []);

  // Function to handle search
  const handleSearch = () => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    const filtered = filteredAssets.filter(
      (asset) => asset.propertyAddress.toLowerCase().includes(searchTermLowerCase)
    );
    setFilteredAssets(filtered);
  };

  const ListTheProperty = async(property_id,userAddress)=>{
    try{
      console.log(property_id,userAddress);
      const response = await AcceptListingRequest(property_id,userAddress);
      window.alert(response);
  }
  catch(error){
      console.error("couldnt approve:", error);
  } 
}

  
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="container mx-auto p-8">
        <div className="mb-8 ml-8 mt-2">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-200 dark:text-gray-200 dark:border-gray-700"
          >
            {/* Back button */}
            <svg
              className="w-6 h-6 rtl:rotate-180 text-black transition-transform transform hover:scale-110"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
          </button>
        </div>
        

        {/* Main content */}
        <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-blue-500">List Assets</h2>
          {/* Grid for displaying assets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Render filtered assets */}
            {filteredAssets.map((asset, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 relative mb-8">
              {/* Display the images */}
              {asset.images && asset.images.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Images</h3>
                    <Carousel
                      showArrows={true}
                      showThumbs={false}
                      showIndicators={false}
                      showStatus={false}
                      dynamicHeight={true}
                      width="100%"
                      infiniteLoop={true}
                      centerMode={false}
                      centerSlidePercentage={90}
                    >
                      {asset.images.map((cid, index) => (
                        <div key={index}>
                          <img
                            src={`https://gateway.pinata.cloud/ipfs/${cid}`}
                            alt={`Image ${index + 1}`}
                            className="w-full h-64 object-cover mb-2 rounded-md"
                          />
                        </div>
                      ))}
                    </Carousel>
                  </div>
                )}
                <div className="flex flex-col">
                  {/* Display asset details */}
                  <p className="text-gray-700 mb-2">ID: {parseInt(asset.property_id['_hex'], 16)}</p> 
                  <p className="text-gray-700 mb-2">Name: {asset.name}</p>
                  <p className="text-gray-700  text-sm mb-2">Owner: {asset.owner}</p>
                  <p className="text-gray-700 mb-2">Location: {asset.location}</p>
                  
                </div>
                <div className="flex space-x-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500" onClick={() => ListTheProperty(parseInt(asset.property_id['_hex'], 16),asset.owner)}>
                    List
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => ListTheProperty()}>
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;