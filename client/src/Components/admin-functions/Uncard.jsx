import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Uncard = ({ asset }) => {
  const navigate = useNavigate(); 
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

  const handleapprove = async () => {
    try {
      const response = await fetch('http://localhost:3001/properties/update-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unique_id }),
      });
  
      if (response.ok) {
        console.log('Asset approved successfully');
      } else {
        console.error('Failed to approve asset');
      }
    } catch (error) {
      console.error('Error approving asset:', error);
    }
  };
  

  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 w-96 relative mb-8">
      <img
        src={images.length > 0 ? `data:image/jpeg;base64,${images[0].path}` : 'placeholder-image-url'}
        alt="Asset"
        className="w-full h-40 object-cover mb-4 rounded-md"
      />
      <div className="flex flex-col">
        <p className="text-xl font-bold mb-2">{name},{location}</p>
        <p className="text-gray-700 mb-2">Asset ID: {unique_id}</p>
        <p className="text-gray-700 mb-2">Address: {address}</p>
        <p className="text-gray-700 mb-2">Property cost: {value} USD</p>
        <p className="text-gray-700 mb-2">Description: {description}</p>
        {ownership_proof && (
                <p>
                  Ownership Proof:{' '}
                  <a
                    href={`data:${ownership_proof.mimetype};base64,${ownership_proof.data}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </p>
              )}
        <div className="flex space-x-2">
          <button
            onClick={showDetailView}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 transition duration-300"
          >
            View
          </button>
          <button
            onClick={handleapprove}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-yellow-600 transition duration-300"
          >
           Approve
          </button>
        </div>
      </div>

      {isDetailViewVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 max-w-2xl rounded-md relative">
            <button
              onClick={closeDetailView}
              className="absolute top-2 right-2 bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Close menu</span>
              &times;
            </button>
            
            <div className="flex justify-center">
              <img
                src={`data:image/jpeg;base64,${images[currentImageIndex].path}`}
                alt={`Image ${currentImageIndex + 1}`}
                className="w-80 h-40 object-cover rounded-md mt-4"
              />
            </div>
            <div className="text-center mt-4">
            {owner_details.length >= 1 && (
              <div>
                <p>(Owner {currentOwnerIndex + 1} of {owner_details.length})</p>
                <p>Owner Name: {owner_details[currentOwnerIndex].owner_name} </p>
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

            <div className="flex justify-between">
              <button
                onClick={showPrevOwner}
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Prev Owner
              </button>
              <button
                onClick={showNextOwner}
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Next Owner
              </button>
            </div>
              
              
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Uncard;
