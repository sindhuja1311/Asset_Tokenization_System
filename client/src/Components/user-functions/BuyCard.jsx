import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import AssetButtons from './AssetButtons';


const BuyCard = ({ asset, showViewButton, showBuyButton }) => {
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
  const [isFormVisible, setFormVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [buyerDetails, setBuyerDetails] = useState({
    buyerName: "",
    accountId: "",
    metamaskId: "",
    email: "",
    tokenType: ""
  });

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

  const handleBuy = () => {
    setFormVisible(true);
  };

  const [valueTokens, setValueTokens] = useState(0);
  const [liquidTokens, setLiquidTokens] = useState(0);

  // Other code...

  const handleTokenSelection = (e) => {
    e.preventDefault();
    const valueTokensInput = parseInt(e.target.valueTokens.value);
    const liquidTokensInput = parseInt(e.target.liquidTokens.value);

    if (isNaN(valueTokensInput) || isNaN(liquidTokensInput)) {
      console.log("Please enter valid token counts");
      return;
    }

    if (valueTokensInput < 0 || liquidTokensInput < 0) {
      console.log("Token counts must be greater than or equal to zero");
      return;
    }

    const { vt_count, lt_count, selling_details } = owner_details[currentOwnerIndex];
    const totalAvailableTokens = selling_details.token_available_count;

    if (valueTokensInput + liquidTokensInput > totalAvailableTokens) {
      console.log("Total selected tokens exceed the available tokens");
      return;
    }

    if (valueTokensInput > vt_count || liquidTokensInput > lt_count) {
      console.log("Selected token counts exceed individual token counts");
      return;
    }
    if (valueTokensInput ==0 && liquidTokensInput ==0){
      console.log("both cant be zero");
      return;
    }
    // Set the token counts in the state
    setValueTokens(valueTokensInput);
    setLiquidTokens(liquidTokensInput);

    // Show the confirmation modal
    showConfirmation();
  };


  const showConfirmation = () => {
    setConfirmationVisible(true);
    setBuyerDetails();
  };

  const closeConfirmation = () => {
    setConfirmationVisible(false);
  };

  const handleProceed = () => {
    // Assuming you have an API endpoint to fetch user details from your database
    axios.get(`http://localhost:3001/users/details/${email}`)
      .then(response => {
        const userData = response.data;
        console.log("buyer:", userData);
  
        // Check if userData contains the full_name field
        if (userData && userData.user && userData.user.full_name) {
          // Create the updated request details object
          const updatedRequestDetails = {
            buyer_name: userData.user.full_name,
            account_id: userData.user.uname,
            metamask_id: userData.user.metamask_id,
            email: userData.user.email,
            value_type_count: valueTokens,
            liquid_type_count: liquidTokens,
            response_status: "pending"
          };
  
          // Assuming you have a state setter function named setConfirmationVisible to update the visibility
          setConfirmationVisible(false);
  
          // Log the updated request details
          console.log("Request details recorded:", updatedRequestDetails);
  
          // Move axios.post inside the handleProceed function
          axios.post(`http://localhost:3001/properties/request-data-update/${owner_details[currentOwnerIndex].account_id}`, updatedRequestDetails)
            .then(response => {
              const reply = response.data;
              if (reply === "Success") {
                console.log("Request Sent Successfully");
              } else {
                console.log("Request Unsuccessful, try again");
              }
            })
            .catch(error => {
              console.error('Error updating request data:', error); // Log error
            });
        } else {
          console.log("Full name not found in userData.");
        }
      })
      .catch(error => {
        console.error('Error fetching user details:', error); // Log error
        // Handle error properly, e.g., show an error message to the user
      });
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
        <p className="text-sm text-gray-700 mb-1">Owner ID: {owner_details[currentOwnerIndex].account_id} </p>
        <p className="text-sm text-gray-700 mb-1">Sell Percentage: {owner_details[currentOwnerIndex].selling_details.sell_percentage} %</p>

        <AssetButtons
          onViewClick={showDetailView}
          onBuyClick={handleBuy}
          showViewButton={showViewButton}
          showBuyButton={showBuyButton}
        />
      </div>

      {isDetailViewVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 max-w-2xl rounded-md relative border-black border">
            <button
              onClick={closeDetailView}
              className="absolute top-0 right-1/2 transform translate-x-1/2 bg-white rounded-sm p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
              <p className="text-sm text-gray-700 mb-2">Description: {description}</p>
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
        className="absolute top-0 right-0 p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <span className="sr-only">Close menu</span>
        &times;
      </button>
      <form onSubmit={handleTokenSelection}>
        <p>number of tokens you want to buy? ( available - {owner_details[currentOwnerIndex].selling_details.token_available_count} )</p>
        <div className="mt-2">
          <label htmlFor="valueTokens" className="block mb-1">Value Tokens:</label>
          <input
            type="number"
            id="valueTokens"
            name="valueTokens"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            placeholder="Enter the number of value tokens"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="liquidTokens" className="block mb-1">Liquid Tokens:</label>
          <input
            type="number"
            id="liquidTokens"
            name="liquidTokens"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            placeholder="Enter the number of liquid tokens"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Request
        </button>
      </form>
    </div>
  </div>
)}


      {isConfirmationVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 max-w-md rounded-md relative border-black border">
            <button
              onClick={closeConfirmation}
              className="absolute top-0 right-1/2 transform translate-x-1/2 bg-white rounded-sm p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Close menu</span>
              &times;
            </button>
            <p>Proceed with acquisition?</p>
            <div className="flex justify-center mt-2">
              <button
                onClick={handleProceed}
                className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyCard;
