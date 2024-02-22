import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BuyCard from './BuyCard';
import { useLocation } from "react-router-dom";

function BuyInvest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allAssets, setAllAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState('AVAILABLE');
  const [ownerIndex, setOwnerIndex] = useState(null);

 
  
  const handleSearch = () => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    const filtered = allAssets.filter(
      (asset) => asset.unique_id.toLowerCase().includes(searchTermLowerCase)
    );
    setFilteredAssets(filtered);
  };

  const handleFilter = async (criteria) => {
    console.log("handle filter");
  };

  return (
    <div>
      <div className="container mx-auto">
        <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-blue-500">Buy / Invest Assets</h2>
          <div className="flex items-center mb-6">
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
              className="px-6 py-2 text-lg font-normal text-white bg-blue-500 rounded-r cursor-pointer hover:bg-blue-600 transition duration-300"
            >
              Search
            </button>
          </div>
          <div className="flex items-center mb-6">
            <button
              className={`px-4 py-2 text-lg font-normal text-white rounded cursor-pointer mr-4 ${filterCriteria === 'AVAILABLE' ? 'bg-blue-500' : 'bg-gray-300'}`}
              onClick={() => handleFilter('AVAILABLE')}
            >
              AVAILABLE
            </button>
            <button
              className={`px-4 py-2 text-lg font-normal text-white rounded cursor-pointer ${filterCriteria === 'IN PROGRESS' ? 'bg-blue-500' : 'bg-gray-300'}`}
              onClick={() => handleFilter('IN PROGRESS')}
            >
              IN PROGRESS
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets && filteredAssets.map((asset) => (
            <div key={asset.unique_id}>
              <BuyCard asset={asset} readOnly loginemail={loginemail} />
            </div>
          ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyInvest;
