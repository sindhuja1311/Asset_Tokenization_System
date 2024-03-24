
import React, { useState } from 'react';
import axios from 'axios'; // Assuming you might need this later
import { Link, useNavigate } from 'react-router-dom'; // Assuming you might need this later
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { userRequestPropertyUpload } from '../../services/functions'; // Assuming this is a function for handling property uploads

// Function to generate unique IDs
function generateUniqueId() {
  return uuidv4();
}

// AssetUpload component
function AssetUpload() {
  const [formData, setFormData] = useState({
    propertyAddress: generateUniqueId(),
    pname: '',
    description: '',
    loaction: '', // Fixed typo here, "loaction" corrected to "loaction"
    images: [],
    ownership_proof: [],
    value: '',
  });

  const [notification, setNotification] = useState(null); // State for notifications

// Function to handle form input changes
const handleChange = (e) => {
  const { name, type, files } = e.target;
  if (type === 'file') {
    setFormData(prevState => ({
      ...prevState,
      [name]: files, // Update state directly with files
    }));
  } else {
    setFormData(prevState => ({
      ...prevState,
      [name]: e.target.value,
    }));
  }
};
const setNotificationWithReload = (notification) => {
  setNotification(notification);
};


// Function to handle file submission
const imagesCID = [];
const ownership_proofCID = [];
// Function to handle file submission
const handleFileSubmission = async () => {
  try {
    const { images, ownership_proof } = formData;

    // Loop through images and ownership_proof arrays
    for (const file of Object.values(images)) {
      const formData = new FormData();
      formData.append("file", file);
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      const ipfshash = resData['IpfsHash'];
      
      // Push IpfsHash based on file type
      imagesCID.push(ipfshash);
    }

    for (const file of Object.values(ownership_proof)) {
      const formData = new FormData();
      formData.append("file", file);
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      const ipfshash = resData['IpfsHash'];
      
      // Push IpfsHash based on file type
      ownership_proofCID.push(ipfshash);
    }

    console.log("imagesCID", imagesCID);
    console.log("ownership_proofCID", ownership_proofCID);
  } catch (error) {
    console.log(error);
  }
};

// Function to handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Check if any text field is empty
  const isAnyTextFieldEmpty = Object.entries(formData).some(([key, value]) => {
    return key !== 'images' && key !== 'ownership_proof' && value === '';
  });

  // Check if any file field is empty
  const isAnyFileFieldEmpty = ['images', 'ownership_proof'].some(fieldName => {
    return formData[fieldName].length === 0;
  });

  if (isAnyTextFieldEmpty || isAnyFileFieldEmpty) {
    setNotification({
      success: false,
      message: 'All fields should be filled.',
    });
    return;
  }

  try {
    const { pname, propertyAddress, description, loaction, value, images, ownership_proof } = formData;

    // If files are selected, handle file submission
    if (images.length > 0 || ownership_proof.length > 0) {
      await handleFileSubmission();
    }
    await userRequestPropertyUpload(
      pname,
      propertyAddress,
      description,
      loaction,
      value,
      imagesCID,
      ownership_proofCID
    );
    setNotification({
      success: true,
      message: 'Property Requested Successfully.',
    });
  
  } catch (error) {
    console.log("Error:", error);
    setNotification({
      success: false,
      message: 'Error uploading property.',
    });
  }
};

  return (
    <>
      <div className="max-w-xl mx-auto  p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Property Information</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Property Address</label>
            <input
              type="text"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={() => {}}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="pname"
              value={formData.pname}
              onChange={(e) => handleChange(e)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => handleChange(e)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Location</label>
            <input
              type="text"
              name="loaction"
              value={formData.loaction}
              onChange={(e) => handleChange(e)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          {/* Images Input */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Images</label>
            <input
              type="file"
              name="images"
              onChange={(e) => handleChange(e)}
              multiple
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Value</label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={(e) => handleChange(e)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          {/* Ownership Proof Input */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Ownership Proof</label>
            <input
              type="file"
              name="ownership_proof"
              onChange={(e) => handleChange(e)}
              multiple
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mt-4 col-span-2 flex justify-center">
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
                  onClick={() => setNotificationWithReload(null)} // Use setNotificationWithReload here
                  className="ml-2 focus:outline-none"
                >
                  <span className="text-white">×</span>
                </button>
              </div>
              <div className="break-words rounded-b-lg bg-white px-4 py-4 text-black">
                {notification.message}
              </div>
            </div>
          )}

      </div>
    </>
  );
}

export default AssetUpload