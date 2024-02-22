import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Update = () => {
  const [formData, setFormData] = useState({
    unique_id: '',
    name: '',
    address: '',
    description: '',
    location: '',
    images: [],
    value: 0,
    owner_details: [],
    ownership_proof: null,
  });

  const navigate = useNavigate();
  const { unique_id } = useParams();

  useEffect(() => {
    const fetchAssetDetails = async () => {
     console.log("useffect");
    };

    fetchAssetDetails();
  }, [unique_id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   console.log("handlesubmit");
    
  };

  const showNotification = (message, success = true) => {
    setNotification({ message, success });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const [notification, setNotification] = useState(null);

  return (
    <>
      <div className="mb-8 ml-8 mt-5">
        <button
          onClick={() => navigate(`/view-asset`)}
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
          {/* Existing code for input fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Images</label>
            <input
              type="file"
              name="images"
              onChange={handleChange}
              multiple
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          {/* Display existing images */}
          {formData.images.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Existing Images</label>
              <ul>
                {formData.images.map((image, index) => (
                  <li key={index}>{image.filename}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Value</label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Ownership Proof</label>
            <input
              type="file"
              name="ownership_proof"
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            {formData.owner_details.map((owner, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Owner {index + 1} Details
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Owner Name</label>
                  <input
                    type="text"
                    value={owner.owner_name}
                    onChange={(e) => handleOwnerDetailChange(index, 'owner_name', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Owner Name"
                  />
                  <label className="block text-sm font-medium text-gray-600">Metamask ID</label>
                  <input
                    type="text"
                    value={owner.metamask_id}
                    onChange={(e) => handleOwnerDetailChange(index, 'metamask_id', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Metamask ID"
                  />
                  <label className="block text-sm font-medium text-gray-600">Account ID</label>
                  <input
                    type="text"
                    value={owner.account_id}
                    onChange={(e) => handleOwnerDetailChange(index, 'account_id', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Account ID"
                  />
                  <label className="block text-sm font-medium text-gray-600">Percentage</label>
                  <input
                    type="number"
                    value={owner.percentage}
                    onChange={(e) => handleOwnerDetailChange(index, 'account_id', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Account ID"
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Display existing ownership proof file */}
          {formData.ownership_proof && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Existing Ownership Proof</label>
              <p>{formData.ownership_proof.filename}</p>
            </div>
          )}
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
};

export default Update;
