import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation } from "react-router-dom";

// Modal component
function DetailsModal({ isOpen, onRequestClose, data }) {
    if (!isOpen || !data) return null;

    const { asset, owner, request_details, selling_details } = data;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-6 text-blue-500">Details</h2>
                <div>
                    <p><strong>Property Name:</strong> {asset && asset.name}</p>
                    <p><strong>Unique ID:</strong> {asset && asset._id}</p>
                    {/* Add other property details as needed */}
                    <p><strong>Owner Name:</strong> {owner && owner.owner_name}</p>
                    <p><strong>Owner Account ID:</strong> {owner && owner.account_id}</p>
                    {/* Add other owner details as needed */}
                    <p><strong>Buyer Name:</strong> {request_details && request_details.buyer_name}</p>
                    <p><strong>Buyer Email:</strong> {request_details && request_details.email}</p>
                    {/* Add other request details as needed */}
                    <p><strong>Sell Percentage:</strong> {selling_details && selling_details.sell_percentage}</p>
                    <p><strong>Token Available Count:</strong> {selling_details && selling_details.token_available_count}</p>
                    {/* Add other selling details as needed */}
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={onRequestClose}>Close</button>
            </div>
        </div>
    );
}


function Pendings() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const email = queryParams.get("email");

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/properties/pending/${email}`);
                console.log('Pending Requests:', response.data);
                setPendingRequests(response.data);
            } catch (error) {
                console.error('Error fetching pending requests:', error);
            }
        };
        fetchPendingRequests();
    }, [email]);

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleTrade = (request) => {
        // Implement logic to initiate trade
        console.log("Initiate trade:", request);
    };

    return (
        <div className="flex-grow p-8">
            <div className="container mx-auto">
                <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-6 text-blue-500">Pending Requests</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full ">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metamask ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value Tokens</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liquid Tokens</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.map((request, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4">{request.asset && request.asset.unique_id}</td>
                                        <td className="px-6 py-4">{request.owner && request.owner.account_id}</td>
                                        <td className="px-6 py-4">{request.owner && request.owner.metamask_id}</td>
                                        <td className="px-6 py-4">{request.request_details && request.request_details.value_type_count}</td>
                                        <td className="px-6 py-4">{request.request_details && request.request_details.liquid_type_count}</td>
                                        <td className="px-6 py-4">
                                            <button className="text-blue-500 hover:underline" onClick={() => handleViewDetails(request)}>View Details</button>
                                            <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleTrade(request)}>Trade</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <DetailsModal isOpen={isModalOpen} onRequestClose={handleCloseModal} data={selectedRequest} />
        </div>
    );
}

export default Pendings;
