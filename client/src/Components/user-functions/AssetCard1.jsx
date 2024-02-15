
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import AssetButtons from './AssetButtons';

const AssetCard1 = ({ asset, showViewButton, showSellButton}) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const email = queryParams.get("email");
  const {
    owner_details,
    location,
    name,
    images,
    unique_id,
    address,
    description,
    ownership_proof,
    value,
    approved,
    // Include all other fields here
  } = asset;
  
  const [isDetailViewVisible, setDetailViewVisible] = useState(false);
  const [currentOwnerIndex, setCurrentOwnerIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [percentageForSale, setPercentageForSale] = useState('');
  const [isFormVisible, setFormVisible] = useState(false);

  const showDetailView = () => {
    setDetailViewVisible(true);
  };

  const closeDetailView = () => {
    setDetailViewVisible(false);
  };

  const showNextOwner = () => {
    setCurrentOwnerIndex((prevIndex) => (prevIndex + 1) % owner_details.length);
  };

  const showPrevOwner = () => {
    setCurrentOwnerIndex((prevIndex) => (prevIndex - 1 + owner_details.length) % owner_details.length);
  };

  const handleSell = () => {
    setFormVisible(true);
  };
  const handleSubmitSell = async (email, unique_id, percentage) => {
    try {
      // Send a POST request to the backend to update the property status
      await axios.post(`http://localhost:3001/properties/sell/${email}/${unique_id}`, { percentage });
      alert('Property status updated successfully');
    } catch (error) {
      console.error('Error selling property:', error);
      alert('Error selling property. Please try again later.');
    }
  };


  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Ensure percentageForSale is a number before submitting
    const percentage = parseFloat(percentageForSale);
    if (!isNaN(percentage)) {
      handleSubmitSell(email, unique_id, percentage);
    } else {
      alert('Please enter a valid percentage value.');
    }
  };
  
  
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 w-64 relative mb-4">
      
      <img
        src={images.length > 0 ? `data:image/jpeg;base64,${images[0].path}` : 'placeholder-image-url'}
        alt="Asset"
        className="w-full h-32 object-cover mb-2 rounded-md"
      />
      <div className="flex flex-col">
        <p className="text-lg font-bold mb-1">{name},{location}</p>
        <p className="text-sm text-gray-700 mb-1">Asset ID: {unique_id}</p>
        <p className="text-sm text-gray-700 mb-1">Address: {address}</p>
        <p className="text-sm text-gray-700 mb-1">Property cost: {value} USD</p>
        <p className="text-sm text-gray-700 mb-2">Description: {description}</p>
        {ownership_proof && (
          <p className="text-sm">
            Ownership Proof:{' '}
            <a
              href={`data:${ownership_proof.mimetype};base64,${ownership_proof.data}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View
            </a>
          </p>
        )}
         <AssetButtons
          onViewClick={showDetailView}
          onSellClick={handleSell}
          showViewButton={showViewButton}
          showSellButton={showSellButton}
        />
      </div>

      {isDetailViewVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-4 max-w-md rounded-md relative">
            <button
              onClick={closeDetailView}
              className="absolute top-0 right-1/2 transform translate-x-1/2 bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Close menu</span>
              &times;
            </button>

            <div className="flex justify-center">
              <img
                src={`data:image/jpeg;base64,${images[currentImageIndex].path}`}
                alt={`Image ${currentImageIndex + 1}`}
                className="w-72 h-32 object-cover rounded-md mt-4"
              />
            </div>
            <div className="text-center mt-4">
              {owner_details.length >= 1 && (
                <div className="text-sm">
                  <p>(Owner {currentOwnerIndex + 1} of {owner_details.length})</p>
                  <p>Owner Name: {owner_details[currentOwnerIndex].owner_name} </p>
                  <p>Email: {owner_details[currentOwnerIndex].email}</p>
                  <p>Metamask ID: {owner_details[currentOwnerIndex].metamask_id}</p>
                  <p>Account ID: {owner_details[currentOwnerIndex].account_id}</p>
                  <p>Percentage: {owner_details[currentOwnerIndex].percentage}</p>
                  <p>Total Tokens: {owner_details[currentOwnerIndex].total_tokens}</p>
                  <p>Value Token Count: {owner_details[currentOwnerIndex].vt_count}</p>
                  <p>Liquid Token Count: {owner_details[currentOwnerIndex].lt_count}</p>
                  <p>Value Token Value: {owner_details[currentOwnerIndex].vt_value}</p>
                  <p>Liquid Token Value: {owner_details[currentOwnerIndex].lt_value}</p>
                </div>
              )}

              <div className="flex justify-between mt-2">
                <button
                  onClick={showPrevOwner}
                  className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
                >
                  Prev Owner
                </button>
                <button
                  onClick={showNextOwner}
                  className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
                >
                  Next Owner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-4 max-w-md rounded-md relative">
          <button
            onClick={() => setFormVisible(false)}
            className="absolute top-0 right-0 mt-1 mr-1 bg-white rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Close menu</span>
            &times;
          </button>

          <form onSubmit={handleFormSubmit} className="flex flex-col items-center">
        <input
          type="number"
          value={percentageForSale}
          onChange={(e) => setPercentageForSale(e.target.value)}
          placeholder="Percentage for sale"
          className="border border-gray-300 rounded-md p-2 mb-2 w-40 text-sm"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetCard1;
