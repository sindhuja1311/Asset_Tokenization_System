import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import {requestPropertyPart,getPropertyShareofOwnersofProperty, getPropertyShareofOwners, requestPropertyListing, getUserDetails, isPropertyVerified, isPropertyRequested, getUserPropertyDetails, fetchAllPropeties, verifyProperty } from '../../services/functions';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import { useSelector } from "react-redux";

function BuyInvest() {
  const metamaskId = useSelector(state => state.global.wallet);
  const userAddress = metamaskId;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [shareOfOwnersData, setShareOfOwnersData] = useState([]); // State to store share of owners data

  const [showPopup, setShowPopup] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [purchasePopup, setPurchaseShowPopup] = useState(false);
  const [selectedPropertyId,setSelectedPropertyId]=useState(null);
  const [selectedUserAddress,setSelectedAddress]=useState(null); 


  const handleOwnersClick = (asset) => {
    setSelectedAsset(asset);
    setShowPopup(true);
  };
  const handleRequestPropertyPart = (propertyId, userAddress) => {
    setSelectedPropertyId(propertyId);
    setSelectedAddress(userAddress);
    setPurchaseShowPopup(true);
};

useEffect(() => {
  const fetchAllPropertiesData = async () => {
    try {
      const user = await getUserDetails(userAddress);
      const allProperties = await fetchAllPropeties();
      const listedProperties = allProperties.filter(property => property.isListed); // Filter properties that are listed
      setPropertyDetails(listedProperties);
      setFilteredAssets(listedProperties); // Set all assets initially
      console.log("use effects lo:", listedProperties);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  fetchAllPropertiesData();
}, []);

  useEffect(() => {
    const fetchPropertyShareOfOwners = async () => {
      try {
        const shareOfOwnersData = {};
        for (const asset of propertyDetails) {
          if (asset.isPropertyVerified) {
            console.log(`Fetching share of owners for asset: ${asset.property_id}`);
            const shareOfOwners = await getPropertyShareofOwnersofProperty(asset.property_id);
            console.log(shareOfOwners);
            shareOfOwnersData[asset.property_id] = shareOfOwners;
          }
        }
        console.log(shareOfOwnersData);
        setShareOfOwnersData(shareOfOwnersData); // Update the state with the fetched data
      } catch (error) {
        console.error('Error fetching property share of owners:', error);
      }
    };

    fetchPropertyShareOfOwners();
  }, [propertyDetails, userAddress]);
  
  // Function to handle search
  const handleSearch = () => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    const filtered = filteredAssets.filter(
      (asset) => asset.propertyAddress.toLowerCase().includes(searchTermLowerCase)
    );
    setFilteredAssets(filtered);
  };
  const handleTokenPurchaseRequest = async () => {
    // Get the values entered by the user for liquid tokens and property tokens
    const liquidTokens = document.getElementById('liquidTokens').value;
    const propertyTokens = document.getElementById('propertyTokens').value;
  
    // Call the service function to request property part
    try {
      console.log(parseInt(selectedPropertyId, 16), selectedUserAddress, liquidTokens, propertyTokens);
      const response = await requestPropertyPart(parseInt(selectedPropertyId, 16), selectedUserAddress, liquidTokens, propertyTokens);
      // Close the popup
      setShowPopup(false);
      window.alert(response);
    } catch (error) {
      console.error('Error fetching property share of owners:', error);
    }
  };
  

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex flex-grow p-8">
      <div className="container mx-auto">
        <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-blue-500">Buy or Invest </h2>
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
      <div className="mb-2">
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
      <p className="text-sm text-gray-700 mb-1">Listed: {asset.isListed ? 'Yes' : 'No'}</p>
    </div>
    {asset.isPropertyVerified && asset.isListed && (
      <button
        onClick={() => handleOwnersClick(asset)}
        className="text-white bg-blue-500 border border-blue-500 rounded-md px-4 py-2 text-sm font-bold hover:bg-blue-600 transition duration-300"
      >
        Request Owners
      </button>


    )}
  </div>
))}
{showPopup && selectedAsset && (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl relative"> {/* Adjusted width */}
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
            <th className="px-4 py-2">Invest</th>
          </tr>
        </thead>
        <tbody>
          {/* Populate table rows with owner data */}
          {shareOfOwnersData[selectedAsset.property_id] && shareOfOwnersData[selectedAsset.property_id].map((owner, index) => (
                            <tr key={index} style={{ 
                              backgroundColor: selectedAsset.owner.toLowerCase() === owner.user.toLowerCase() ? 'lightgreen' : 
                                              userAddress.toLowerCase() === owner.user.toLowerCase() ? 'lightyellow' : 
                                              'transparent'
                          }}>  <td className="border px-4 py-2">{owner.user}</td>
          <td className="border px-4 py-2">{owner.LiquidTokenPart}</td>
          <td className="border px-4 py-2">{owner.PropertyTokenPart}</td>
          <td  className="border px-4 py-2">
                {userAddress.toLowerCase() != owner.user.toLowerCase() ? (
                <button
                    onClick={() => handleRequestPropertyPart(selectedAsset.property_id,owner.user)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Request
                  </button>
                ) : (
                  <span className="text-gray-500">YOU</span>
                )}
              </td>
  </tr>
))}

        </tbody>
      </table>
    </div>
  </div>
)}

{purchasePopup && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md relative">
              <button
                onClick={() => setPurchaseShowPopup(false)}
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
              <h2 className="text-lg font-bold mb-4">Purchase Tokens</h2>
              <div className="mb-4">
                <label htmlFor="liquidTokens" className="block text-sm font-medium text-gray-700">Liquid Tokens:</label>
                <input
                  id="liquidTokens"
                  type="number"
                  className="border border-gray-300 rounded px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="propertyTokens" className="block text-sm font-medium text-gray-700">Property Tokens:</label>
                <input
                  id="propertyTokens"
                  type="number"
                  className="border border-gray-300 rounded px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
              <div className="flex justify-center"> {/* Centering the purchase button */}
              <button
              onClick={() => handleTokenPurchaseRequest(liquidTokens, propertyTokens)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
              Purchase
            </button>

              </div>
            </div>
          </div>
        )}


          </div>
            
          
        </div>
      </div>
    </div>
  );
}

export default BuyInvest;