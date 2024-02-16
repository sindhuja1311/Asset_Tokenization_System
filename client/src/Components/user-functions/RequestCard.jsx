import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';

const RequestCard = ({ asset, index, showViewButton }) => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const loginemail = queryParams.get("email");
  const {
    owner_details,
    location,
    name,
    images,
    unique_id,
    address,
    description,
    value,
  } = asset;

  const [isRequestDetailsVisible, setRequestDetailsVisible] = useState(false);
  const [requestDetails, setRequestDetails] = useState([]);

  const toggleRequestDetails = async () => {
    if (!isRequestDetailsVisible) {
      try {
        const response = await axios.get(`http://localhost:3001/properties/requests/${asset.unique_id}/${loginemail}`);
        setRequestDetails(response.data);
        setRequestDetailsVisible(true);
      } catch (error) {
        console.error('Error fetching request details:', error);
      }
    } else {
      setRequestDetails([]);
      setRequestDetailsVisible(false);
    }
  };

  const handleApprove = async (index) => {
    try {
        await handleAction('approve',index);
    } catch (error) {
        console.error('Error approving request:', error);
    }
};

const handleDecline = async (index) => {
    try {
        await handleAction('deny',index);
    } catch (error) {
        console.error('Error declining request:', error);
    }
};

const handleAction = async (action,index) => {
    try {
        await axios.put(`http://localhost:3001/properties/requests/${action}/${loginemail}/${requestDetails[index].account_id}/${unique_id}`);
        // Optionally, you can update the UI or perform other actions upon success
    } catch (error) {
        console.error(`Error ${action}ing request:`, error);
    }
};

  return (
    <div className="request-card">
      <div className="asset-info">
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
            <button
              onClick={toggleRequestDetails}
              className="bg-yellow-500 text-white px-3 py-1 rounded-md mt-2 text-sm hover:bg-yellow-600 transition duration-300"
            >
              Requests
            </button>
          </div>
        </div>
      </div>

      {isRequestDetailsVisible && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Request Details</h2>
                <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300" onClick={toggleRequestDetails}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full  text-sm text-left rtl:text-right text-gray-700 dark:text-gray-300">
                  <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-2">Account ID</th>
                      <th scope="col" className="px-4 py-2">Value Type Count</th>
                      <th scope="col" className="px-4 py-2">Liquid Type Count</th>
                      <th scope="col" className="px-4 py-2">Response Status</th>
                      <th scope="col" className="px-4 py-2">Metamask ID</th>
                      <th scope="col" className="px-4 py-2">Approve?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestDetails.map((request, index) => (
                      <tr key={index} className="bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <td className="px-4 py-2">{request.account_id}</td>
                        <td className="px-4 py-2">{request.value_type_count}</td>
                        <td className="px-4 py-2">{request.liquid_type_count}</td>
                        <td className="px-4 py-2">{request.response_status}</td>
                        <td className="px-4 py-2">{request.metamask_id}</td>
                        <td className="px-4 py-2">
                          <div className="flex flex-row">
                            <button
                              onClick={() => handleApprove(index)}
                              className="mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Y
                            </button>
                            <button
                              onClick={() => handleDecline(index)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              N
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
