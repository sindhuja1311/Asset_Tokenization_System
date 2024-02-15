import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function generateUniqueId() {
  return uuidv4();
}
function Add() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    unique_id: generateUniqueId(),
    name: '',
    address: '',
    description: '',
    location: '',
    images: [],
    owner_details:{
    owner_name: '',
    metamask_id: '',
    account_id: '',
    email:'',
    },
    ownership_proof: '',
    value: '',
  });

  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    setFormData((prevFormData) => {
      if (type === 'file') {
        return {
          ...prevFormData,
          [name]: files[0],
        };
      }

      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  const showNotification = (message, success = true) => {
    setNotification({ message, success });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
  
    // Append regular fields to formDataToSend
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formDataToSend.append(`${key}_${index + 1}`, item);
        });
      } else if (key === 'owner_details') {
        // Append owner_details fields individually
        Object.entries(value).forEach(([ownerKey, ownerValue]) => {
          formDataToSend.append(`owner_details_${ownerKey}`, ownerValue);
        });
      } else {
        formDataToSend.append(key, value);
      }
    });
  
    try {
      const response = await axios.post('http://localhost:3001/properties/add-asset', formDataToSend);
  
      if (response.status === 201) {
        showNotification('Property added successfully', true);
        setFormData({
          unique_id: generateUniqueId(),
          name: '',
          address: '',
          description: '',
          location: '',
          images: [],
          owner_details: {
            owner_name: '',
            metamask_id: '',
            account_id: '',
            email:"",
          },
          ownership_proof: null,
          value: '',
        });
      } else {
        showNotification('Failed to add property. Please try again.', false);
        console.error('Failed to add property. Server returned:', response.status);
      }
    } catch (error) {
      showNotification('Failed to add property. Please try again.', false);
      console.error('Error:', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
    }
  };
  
  return (
    <>
      <div className="mb-8 ml-8 mt-5">
    <button
        onClick={() => window.history.back()}
        className="flex items-center justify-center w-1/2 px-5 py-2 text-sm transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-200 dark:text-gray-200 dark:border-gray-700"
    >
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
    <div className="max-w-xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
       
      <h2 className="text-2xl font-bold mb-4">Property Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Unique ID</label>
          <input
            type="text"
            name="unique_id"
            value={formData.unique_id}
            onChange={() => {}}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange(e)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={(e) => handleChange(e)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => handleChange(e)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={(e) => handleChange(e)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Images</label>
          <input
            type="file"
            name="images"
            onChange={(e) => handleChange(e)}
            multiple
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Value</label>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={(e) => handleChange(e)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Owner Name</label>
          <input
            type="text"
            name="owner_name"
            value={formData.owner_name}
            onChange={(e) => handleChange(e)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange(e)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Metamask ID</label>
          <input
            type="text"
            name="metamask_id"
            value={formData.metamask_id}
            onChange={(e) => handleChange(e)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Account ID</label>
          <input
            type="text"
            name="account_id"
            value={formData.account_id}
            onChange={(e) => handleChange(e)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Ownership Proof</label>
          <input
            type="file"
            name="ownership_proof"
            onChange={(e) => handleChange(e)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
      {notification && (
  <div
    className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-w-full rounded-lg ${
      notification.success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}
    style={{ marginBottom: '2rem' }}
  >
    <div className="flex items-center justify-between rounded-t-lg border-b-2 border-white px-4 pb-2 pt-2.5">
      <p className="font-bold">{notification.success ? 'Success' : 'Error'}</p>
      <button
        type="button"
        onClick={() => setNotification(null)}
        className="ml-2 focus:outline-none"
      >
        <span className="text-white">×</span>
      </button>
    </div>
    <div className="break-words rounded-b-lg bg-white px-4 py-4 text-black"> {/* Ensure text color is visible */}
      {notification.message}
    </div>
  </div> 

)}
    </div>
    </>
  );
}

export default Add;
