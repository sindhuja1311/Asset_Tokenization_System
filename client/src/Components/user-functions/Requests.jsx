import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import RequestCard from './RequestCard';

function Requests() {
    const [searchTerm, setSearchTerm] = useState('');
    const [allAssets, setAllAssets] = useState([]);
    const [ownerIndex, setOwnerIndex] = useState(null); // Declare ownerIndex state
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const email = queryParams.get("email");
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [filterType, setFilterType] = useState('all');
  

  useEffect(() => {
    const fetchAllAssets = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/properties/user-assets/${email}`);
        console.log('Response from server:', response.data); // Log the response data
        
        const { allAssets, ownerIndex } = response.data;
  
        // Set all assets and owner index
        setAllAssets(allAssets);
        setFilteredAssets(allAssets);
        setOwnerIndex(ownerIndex); // Assuming you have a state variable for ownerIndex
  
      } catch (error) {
        console.error('Error fetching all assets:', error);
      }
    };
  
    fetchAllAssets();
  }, []);
  

  const handleSearch = () => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    const filtered = allAssets.filter(
      (asset) => asset.unique_id.toLowerCase().includes(searchTermLowerCase)
    );
    setFilteredAssets(filtered);
  };

  return (
    <div className="container mx-auto ">
      <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-blue-500">Requests</h2>
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
            className="ml-4 px-6 py-2 text-lg font-normal text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600 transition duration-300"
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            (asset.owner_details.some(owner => owner.status === 'partial sale') || asset.owner_details.some(owner => owner.status === 'full sale')) && (
              <RequestCard email={email} key={asset.unique_id} index={ownerIndex} showViewButton showRequestButton asset={asset} readOnly />
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default Requests;
