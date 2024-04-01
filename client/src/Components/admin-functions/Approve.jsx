import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { getUserDetails,isPropertyVerified , getUserPropertyDetails, fetchAllPropeties, verifyProperty } from '../../services/functions';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

function Approve() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState([]);

  useEffect(() => {
    const fetchAllPropertiesData = async () => {
      try {
        const propertyDetails = await fetchAllPropeties();
        setFilteredAssets(propertyDetails); // Set all assets initially
        setPropertyDetails(propertyDetails);
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

  const handleApprove = async(property_id) => {
    console.log("prop:",property_id);
    try{
        const status=await verifyProperty(property_id);
        window.alert(status);
        
    }
    catch(error){
        console.error("couldnt approve:", error);
    }
    
  };
  const checkVer=async(property_id)=>{
    try{
        const status=await isPropertyVerified(property_id);
        
        return status;
        
    }
    catch(error){
        console.error("couldnt approve:", error);
    }
  }
  const checkUser=async(owner)=>{
    try{
        
        const userprops=await getUserPropertyDetails(owner);
        console.log("user props are:",userprops);

        
    }
    catch(error){
        console.error("couldnt approve:", error);
    }
  }
    // Define filter options
  const filterOptions = [
    { label: 'Up for Verification', value: 'up_for_verification' },
    { label: 'Verified', value: 'verified' },
  ];
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
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="container mx-auto p-8">
        {/* Search bar */}
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
          <h2 className="text-3xl font-bold mb-6 text-blue-500">Approve Assets</h2>
          {/* Search bar */}
          <div className="mb-6 flex items-stretch">
            <input
              type="text"
              className="flex-grow px-4 py-2 text-lg font-normal leading-6 rounded-l border border-solid border-gray-300 focus:outline-none focus:border-primary focus:shadow-outline-primary"
              placeholder="Search by Unique ID"
              aria-label="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSearch}
              className="flex-shrink-0 px-6 py-2 text-lg font-normal text-white bg-blue-500 rounded-r cursor-pointer hover:bg-blue-600 transition duration-300"
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
                {/* Display ownership proof links */}
                {asset.ownership_proof && asset.ownership_proof.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Ownership Proof</h3>
                    <ul>
                      {asset.ownership_proof.map((cid, index) => (
                        <li key={index}>
                          <a 
                            href={`https://gateway.pinata.cloud/ipfs/${cid}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
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
                  <p className="text-gray-700 mb-2">ID: {parseInt(asset.property_id['_hex'], 16)}</p> 
                  <p className="text-gray-700 mb-2">Name: {asset.name}</p>
                  <p className="text-gray-700 mb-2">Property Address: {asset.propertyAddress}</p>
                  <p className="text-gray-700 mb-2">Description: {asset.description}</p>
                  <p className="text-gray-700 mb-2">Location: {asset.location}</p>
                  <p className="text-gray-700 mb-2">Value: {asset.value ? asset.value.toString() : ''}</p>
                  <p className="text-gray-700 mb-2">Verified: {asset.isPropertyVerified ? 'Yes' : 'No'}</p>
                  <p className="text-gray-700 mb-2">Listed: {asset.isListed ? 'Yes' : 'No'}</p>
                  <p className="text-gray-700 text-sm mb-2">Owner: {asset.owner}</p>
                  
              {/* Render buttons based on verification status */}
              {!asset.isPropertyVerified ? (
                <div className="flex space-x-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500" onClick={() => handleApprove(parseInt(asset.property_id['_hex'], 16))}>
                    Approve
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => checkVer(parseInt(asset.property_id['_hex'], 16))}>
                    Disapprove
                  </button>
                </div>
              ) : <p className="text-green-700 font-extrabold   mb-2">VERIFIED</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Approve;