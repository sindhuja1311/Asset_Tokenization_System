import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import AssetCard1 from './AssetCard1';

function MyAssets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allAssets, setAllAssets] = useState([]);
  const [ownerIndex, setOwnerIndex] = useState(null); // Add setOwnerIndex declaration
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const email = queryParams.get("email");
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchAllAssets = async () => {
      console.log("useffect");
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

  const handleFilter = (type) => {
    setFilterType(type);
  };

  return (
    <div className="container mx-auto ">
      <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-blue-500">My Assets</h2>
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
        <div className="flex justify-center space-x-4 mb-4">
        <button onClick={() => handleFilter('all')} className={`px-4 py-2 text-lg font-normal text-white rounded cursor-pointer ${filterType === 'all' ? 'bg-blue-500' : 'bg-gray-300'}`}>All</button>
        <button onClick={() => handleFilter('completely-owned')} className={`px-4 py-2 text-lg font-normal text-white rounded cursor-pointer ${filterType === 'completely-owned' ? 'bg-blue-500' : 'bg-gray-300'}`}>Completely Owned</button>
        <button onClick={() => handleFilter('upforsale')} className={`px-4 py-2 text-lg font-normal text-white rounded cursor-pointer ${filterType === 'upforsale' ? 'bg-blue-500' : 'bg-gray-300'}`}>Up for Sale</button>
        <button onClick={() => handleFilter('shared')} className={`px-4 py-2 text-lg font-normal text-white rounded cursor-pointer ${filterType === 'shared' ? 'bg-blue-500' : 'bg-gray-300'}`}>Shared</button>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredAssets.map((asset) => (
    ((filterType === 'all') ||
      (filterType === 'completely-owned' && asset.owner_details.some(owner => owner.percentage === 100)) ||
      (filterType === 'upforsale' && (asset.owner_details.some(owner => owner.status === 'partial sale') || asset.owner_details.some(owner => owner.status === 'full sale'))) ||
      (filterType === 'shared' && asset.owner_details.some(owner => owner.percentage < 100 && owner.percentage > 0))
    ) && (
      <AssetCard1 email={email} key={asset.unique_id} showViewButton showSellButton asset={asset} readOnly />
    )
  ))}
</div>

      </div>
    </div>
  );
}

export default MyAssets;
