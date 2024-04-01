import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import {isPropertyInspector,requestPropertyListing, getPropertyShareofOwnersofProperty, getUserDetails, getUserPropertyDetails, fetchAllPropeties } from '../../services/functions';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useSelector } from "react-redux";

function View() {
  const inspector_address = useSelector(state => state.global.wallet);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [shareOfOwnersData, setShareOfOwnersData] = useState({}); // State to store share of owners data

  const [showPopup, setShowPopup] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleOwnersClick = (asset) => {
    setSelectedAsset(asset);
    setShowPopup(true);
  };

  useEffect(() => {
    const fetchAllPropertiesData = async () => {
      try {
        const inspector_status = await isPropertyInspector(inspector_address);
        console.log("status:", inspector_status);
        const allProperties = await fetchAllPropeties();
        setPropertyDetails(allProperties);
        setFilteredAssets(allProperties);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };
  
    fetchAllPropertiesData();
  }, []); // Empty dependency array to run only once on component mount
  
  
  useEffect(() => {
    const fetchPropertyShareOfOwners = async () => {
      try {
        const shareOfOwnersData = {};
        for (const asset of propertyDetails) {
          if (asset.isPropertyVerified) {
            const shareOfOwners = await getPropertyShareofOwnersofProperty(asset.property_id);
            shareOfOwnersData[asset.property_id] = shareOfOwners;
          }
        }
        setShareOfOwnersData(shareOfOwnersData); // Update the state with the fetched data
      } catch (error) {
        console.error('Error fetching property share of owners:', error);
      }
    };

    fetchPropertyShareOfOwners();
  }, [propertyDetails,inspector_address]);
  
  
// Function to handle search
const handleSearch = () => {
  const searchTermLowerCase = searchTerm.toLowerCase();
  const filtered = propertyDetails.filter(
    (asset) => asset.propertyAddress.toLowerCase().includes(searchTermLowerCase)
  );
  setFilteredAssets(filtered);
};

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
      <div className="container mx-auto">
        <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-blue-500">Listed Assets</h2>
          {/* Search bar */}
          <div className="mb-6 flex items-center">
            <input
              type="text"
              className="flex-grow px-4 py-2 text-lg font-normal leading-6 rounded border border-solid border-gray-300 focus:outline-none focus:border-primary focus:shadow-outline-primary"
              placeholder="Search by Unique ID"
              aria-label="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSearch}
              className="ml-2 px-6 py-2 text-lg font-normal text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600 transition duration-300"
            >
              Search
            </button>
          </div>
          {/* Grid for displaying assets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 relative">
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

                {/* Display ownership proof links */}
                {asset.ownership_proof && asset.ownership_proof.length > 0 && (
                  <div className="mb-2">
                    <h3 className="text-lg font-bold mb-1">Ownership Proof</h3>
                    <ul>
                      {asset.ownership_proof.map((cid, index) => (
                        <li key={index}>
                          <a 
                            href={`https://gateway.pinata.cloud/ipfs/${cid}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 underline text-sm"
                          >
                            [ {index + 1} ]
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {asset.isPropertyVerified && asset.isListed && (
                  <button
                    onClick={() => handleOwnersClick(asset)}
                    className="text-blue-500 underline text-sm cursor-pointer font-bold hover:text-blue-700"
                  >
                    Owners
                  </button>
                )}

                <div className="flex flex-col">
                  {/* Display asset details */}
                  <p className="text-sm text-gray-700 mb-1">ID: {parseInt(asset.property_id['_hex'], 16)}</p> 
                  <p className="text-sm text-gray-700 mb-1">Name: {asset.name}</p>
                  <p className="text-sm text-gray-700 mb-1">Property Address: {asset.propertyAddress}</p>
                  <p className="text-sm text-gray-700 mb-1">Description: {asset.description}</p>
                  <p className="text-sm text-gray-700 mb-1">Location: {asset.location}</p>
                  <p className="text-sm text-gray-700 mb-1">Value: {asset.value ? asset.value.toString() : ''}</p>
                  <p className="text-sm text-gray-700 mb-1">Verified: {asset.isPropertyVerified ? 'Yes' : 'No'}</p>
                  <p className="text-sm text-gray-700 mb-1">Listed: {asset.isListed ? 'Yes' : 'No'}</p>
                </div>
              </div>
            ))}
            {showPopup && selectedAsset && (
              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl relative">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <h2 className="text-xl font-bold mb-4">Owners</h2>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Address</th>
                        <th className="px-4 py-2">Liquid Tokens</th>
                        <th className="px-4 py-2">Value Tokens</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Populate table rows with owner data */}
                      {shareOfOwnersData[selectedAsset.property_id] && shareOfOwnersData[selectedAsset.property_id].map((owner, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{owner.user}</td>
                            <td className="border px-4 py-2">{owner.LiquidTokenPart}</td>
                            <td className="border px-4 py-2">{owner.PropertyTokenPart}</td>
                        </tr>
                        ))}

                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default View;
