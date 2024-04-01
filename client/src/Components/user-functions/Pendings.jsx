import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyReceivedPropertiesRequest, getPropertyDetails, acceptPropertyTransfer, isAddressShareOwner } from '../../services/functions'; // Import getPropertyDetails function
import { useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

function Pendings() {
    const metamaskId = useSelector(state => state.global.wallet);
    const userAddress = metamaskId;
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const requests = await getMyReceivedPropertiesRequest(userAddress);
                console.log(requests);
                setRequests(requests);
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };

        fetchRequests();
    }, [userAddress]);

    const handleTransfer = async (property_id, requested_address) => {
        try {
            const response = await acceptPropertyTransfer(property_id, requested_address);
            window.alert(response);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    return (
        <div className="flex-grow p-8">
            <div className="container mx-auto">
                <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-6 text-blue-500">Received Requests</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requesting Owner</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value Tokens</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liquid Tokens</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transfer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length > 0 ? (
                                    requests.map((request, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap">{request.property_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{request.requested_address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{request.LiquidTokenPart}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{request.PropertyTokenPart}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleTransfer(request.property_id, request.requested_address)}>
                                                    Transfer
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No pending requests found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pendings;
