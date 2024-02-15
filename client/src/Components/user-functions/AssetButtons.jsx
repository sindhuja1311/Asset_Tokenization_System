import React from 'react';

const AssetButtons = ({ onViewClick, onSellClick, onBuyClick }) => {
  return (
    <div className="flex space-x-2">
      {onViewClick && (
        <button
          onClick={onViewClick}
          className="bg-blue-500 text-white px-3 py-1 rounded-md mt-2 text-sm hover:bg-blue-600 transition duration-300"
        >
          View
        </button>
      )}
      {onSellClick && (
        <button
          onClick={onSellClick}
          className="bg-yellow-500 text-white px-3 py-1 rounded-md mt-2 text-sm hover:bg-yellow-600 transition duration-300"
        >
          Sell
        </button>
      )}
      {onBuyClick && (
        <button
          onClick={onBuyClick}
          className="bg-green-500 text-white px-3 py-1 rounded-md mt-2 text-sm hover:bg-green-600 transition duration-300"
        >
          Buy
        </button>
      )}
    </div>
  );
};

export default AssetButtons;
