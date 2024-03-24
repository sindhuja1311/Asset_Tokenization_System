import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function View() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allAssets, setAllAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="container mx-auto p-5">
        <div className="mb-8 ml-8 mt-1">
          <button
            onClick={() => navigate(`/admindash`)}
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

        <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-blue-500">Discover Assets</h2>
          <div className="mb-6 flex items-stretch">
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
              className="flex-shrink-0 px-6 py-2 text-lg font-normal text-white bg-blue-500 rounded-r cursor-pointer hover:bg-blue-600 transition duration-300"
            >
              Search
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchTerm === ''
              ? allAssets.map((asset) => (
                  <div key={asset.unique_id} className="mb-6">
                    <AssetCard asset={asset} readOnly />
                  </div>
                ))
              : filteredAssets.map((asset) => (
                  <div key={asset.unique_id} className="mb-6">
                    <AssetCard asset={asset} readOnly />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default View;
