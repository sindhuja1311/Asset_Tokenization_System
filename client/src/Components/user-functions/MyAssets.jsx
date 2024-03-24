import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { ReturnAllRequestedListingPropertiesList,requestPropertyListing, getUserDetails, isPropertyVerified,isPropertyRequested, getUserPropertyDetails, fetchAllPropeties, verifyProperty } from '../../services/functions';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import { useSelector } from "react-redux";

function MyAssets() {
  const metamaskId = useSelector(state => state.global.wallet);
  const userAddress = metamaskId;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [listDetails,setListDetails]=useState([]);

  useEffect(() => {
    const fetchAllPropertiesData = async () => {
      try {
        const user = await getUserDetails(userAddress);
        const propertyDetails = await getUserPropertyDetails(user.id);
        setPropertyDetails(propertyDetails);
        setFilteredAssets(propertyDetails); // Set all assets initially
        console.log("use effects lo:", propertyDetails);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };
  
    fetchAllPropertiesData();
  }, []);

  useEffect(() => {
    const fetchAllRequestPropertiesData = async () => {
      try {
        const listDetails = await ReturnAllRequestedListingPropertiesList();
        setListDetails(listDetails);
        console.log("use effects list details:", listDetails);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };
  
    fetchAllRequestPropertiesData();
  }, []);
  
  // Function to handle search
  const handleSearch = () => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    const filtered = filteredAssets.filter(
      (asset) => asset.propertyAddress.toLowerCase().includes(searchTermLowerCase)
    );
    setFilteredAssets(filtered);
  };

  // Define filter options
  const filterOptions = [
    { label: 'Up for Verification', value: 'up_for_verification' },
    { label: 'Verified', value: 'verified' },
    ];

  const handleRequestToList = async (property_id, name, location, images) => {
     try {
        const response1 = await requestPropertyListing(property_id, name, location, images);
        console.log(response1);
        
      } catch (error) {
        console.error("couldnt approve:", error);
      }
    };
  
  const isPropReq = async (property_id, owner) => {
    try {  
      const response = await isPropertyRequested(property_id, owner);
      console.log(response);
      return response;
    } catch(error) {
      console.error("couldnt approve:", error);
    }
  };

  // Function to handle filter change
  const handleFilterChange = (e) => {
    // Update filter based on selected value
    const selectedFilter = e.target.value;
    console.log('Selected filter:', selectedFilter);

    // Filter assets based on selected filter
    switch (selectedFilter) {
      case 'up_for_verification':
        setFilteredAssets(propertyDetails.filter(asset => !asset.isPropertyVerified));
        break;
      case 'verified':
        setFilteredAssets(propertyDetails.filter(asset => asset.isPropertyVerified));
        break;
      default:
        // Reset filter to show all assets
        setFilteredAssets(propertyDetails);
        break;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex flex-grow p-8">
      <div className="container mx-auto">
        <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-blue-500">My Assets</h2>
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
            {/* Dropdown for filter */}
            <select
              onChange={handleFilterChange}
              className="ml-4 px-4 py-2 text-lg font-normal leading-6 rounded border border-solid border-gray-300 focus:outline-none focus:border-primary focus:shadow-outline-primary"
            >
              <option value="">Filter</option>
              {filterOptions.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          {/* Grid for displaying assets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Render filtered assets */}
            {filteredAssets.map((asset, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 relative">
                {/* Display the images */}
                {asset.images && asset.images.length > 0 && (
                  <div className="mb-2">
                    <h3 className="text-lg font-bold mb-1">Images</h3>
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
                            className="w-full h-32 object-cover mb-1 rounded-md"
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

                <div className="flex flex-col">
                  {/* Display asset details */}
                  <p className="text-sm text-gray-700 mb-1">ID: {parseInt(asset.property_id['_hex'], 16)}</p> 
                  <p className="text-sm text-gray-700 mb-1">Name: {asset.name}</p>
                  <p className="text-sm text-gray-700 mb-1">Property Address: {asset.propertyAddress}</p>
                  <p className="text-sm text-gray-700 mb-1">Description: {asset.description}</p>
                  <p className="text-sm text-gray-700 mb-1">Location: {asset.location}</p>
                  <p className="text-sm text-gray-700 mb-1">Value: {asset.value ? asset.value.toString() : ''}</p>
                  <p className="text-sm text-gray-700 mb-1">Verified: {asset.isPropertyVerified ? 'Yes' : 'No'}</p>
                  <p className="text-xs text-gray-700 mb-1">Owner: {asset.owner}</p>
                </div>
                {!asset.isPropertyVerified ? (
                  <p className="mt-2 text-lg font-normal text-red-700 p-2 rounded-md">WAIT FOR VERIFICATION</p>
                ) : (
                
                      <button
                        onClick={() => handleRequestToList(asset.property_id, asset.name, asset.location, asset.images)}
                        className="mt-2 px-4 py-2 text-lg font-normal text-white bg-green-500 rounded cursor-pointer hover:bg-green-600 transition duration-300"
                      >
                        Request to List
                      </button>
                    )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAssets;
