import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMySentPropertiesRequest, getPropertyDetails } from '../../services/functions'; // Import getPropertyDetails function
import { useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

function Requests() {
    const metamaskId = useSelector(state => state.global.wallet);
    const userAddress = metamaskId;
    const [requests, setRequests] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const requests = await getMySentPropertiesRequest(userAddress);
                setRequests(requests);
                console.log(requests);
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };

        fetchRequests();
    }, [userAddress]);

    const handleViewClick = async (property_id) => {
        try {
            const propertyDetails = await getPropertyDetails(property_id);
            console.log("in handle view click:", propertyDetails);
            const selectedPropertyDetails = {
                description: propertyDetails[0].description,
                images: propertyDetails[0].images,
                isListed: propertyDetails[0].isListed,
                isPropertyVerified: propertyDetails[0].isPropertyVerified,
                location: propertyDetails[0].location,
                name: propertyDetails[0].name,
                owner: propertyDetails[0].owner,
                ownership_proof: propertyDetails[0].ownership_proof,
                propertyAddress: propertyDetails[0].propertyAddress,
                property_id: parseInt(propertyDetails[0].property_id['_hex'],16),
                value: parseInt(propertyDetails[0].value['_hex'],16)
            };
            setSelectedProperty(selectedPropertyDetails);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching property details:", error);
        }
    };


    const handleClosePopover = () => {
        setSelectedProperty(null);
    };

    return (
        <div className="flex-grow p-8">
            <div className="container mx-auto">
                <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-6 text-blue-500">Sent Requests</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value Tokens</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liquid Tokens</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests && requests.length > 0 && requests[0] !== undefined ? (
                                    requests.map((request, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap">{request.propertyId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{request.user}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{request.propertyTokenPart}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{request.liquidTokenPart}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button onClick={() => handleViewClick(request.propertyId)} className="text-blue-500 hover:text-blue-600">View</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No requests found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {selectedProperty && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
                    {/* Background overlay */}
                    <div className="fixed inset-0 bg-gray-500 opacity-75"></div>

                    {/* Modal content */}
                    <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md w-full">
                        <div className="px-4 py-5 sm:p-6">
                            {/* Carousel */}
                            {selectedProperty.images && selectedProperty.images.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold mb-2">Images</h3>
                                    <Carousel
                                        showArrows={true}
                                        showThumbs={false}
                                        showIndicators={false}
                                        showStatus={false}
                                        dynamicHeight={true}
                                        width="100%"
                                        infiniteLoop={true}
                                        centerMode={false}
                                        centerSlidePercentage={90}
                                    >
                                        {selectedProperty.images.map((cid, index) => (
                                            <div key={index}>
                                                <img
                                                    src={`https://gateway.pinata.cloud/ipfs/${cid}`}
                                                    alt={`Image ${index + 1}`}
                                                    className="w-full h-48 object-cover mb-2 rounded-md"
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>
                            )}
                            {/* Display ownership proof links */}
                            {selectedProperty.ownership_proof && selectedProperty.ownership_proof.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold mb-2">Ownership Proof</h3>
                                    <ul>
                                        {selectedProperty.ownership_proof.map((cid, index) => (
                                            <li key={index}>
                                                <a
                                                    href={`https://gateway.pinata.cloud/ipfs/${cid}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 underline text-sm"
                                                >
                                                    [ {index + 1} ]
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Other property details */}
                            <div className="flex flex-wrap">
                                <div className="w-full mb-2">
                                    <div className="flex flex-wrap">
                                        <p className="text-sm text-gray-700 mb-1 mr-2 font-bold">Description:</p>
                                        <p className="text-sm text-gray-700 mb-1">{selectedProperty.description}</p>
                                    </div>
                                </div>
                                <div className="w-full mb-2">
                                    <div className="flex flex-wrap">
                                        <p className="text-sm text-gray-700 mb-1 mr-2 font-bold">Location:</p>
                                        <p className="text-sm text-gray-700 mb-1">{selectedProperty.location}</p>
                                    </div>
                                </div>
                                <div className="w-full mb-2">
                                    <div className="flex flex-wrap">
                                        <p className="text-sm text-gray-700 mb-1 mr-2 font-bold">Property ID:</p>
                                        <p className="text-sm text-gray-700 mb-1">{selectedProperty.property_id}</p>
                                    </div>
                                </div>
                                <div className="w-full mb-2">
                                    <div className="flex flex-wrap">
                                        <p className="text-sm text-gray-700 mb-1 mr-2 font-bold">Value: </p>
                                        <p className="text-sm text-gray-700 mb-1"> {selectedProperty.value}</p>
                                    </div>
                                </div>
                                <div className="w-full mb-2">
                                    <div className="flex flex-wrap">
                                        <p className="text-sm text-gray-700 mb-1 mr-2 font-bold">Listed:</p>
                                        <p className="text-sm text-gray-700 mb-1">{selectedProperty.isListed ? 'Yes' : 'No'}</p>
                                    </div>
                                </div>
                                <div className="w-full mb-2">
                                    <div className="flex flex-wrap">
                                        <p className="text-sm text-gray-700 mb-1 mr-2 font-bold">Verified:</p>
                                        <p className="text-sm text-gray-700 mb-1">{selectedProperty.isPropertyVerified ? 'Yes' : 'No'}</p>
                                    </div>
                                </div>
                                <div className="w-full mb-2">
                                    <div className="flex flex-wrap">
                                        <p className="text-sm text-gray-700 mb-1 mr-2 font-bold">Owner:</p>
                                        <p className="text-sm text-gray-700 mb-1">{selectedProperty.owner}</p>
                                    </div>
                                </div>
                                <div className="w-full mb-2">
                                    <div className="flex flex-wrap">
                                        <p className="text-sm text-gray-700 mb-1 mr-2 font-bold">Property Address:</p>
                                        <p className="text-sm text-gray-700 mb-1">{selectedProperty.propertyAddress}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Close button */}
                            <div className="text-right">
                                <button
                                    onClick={handleClosePopover}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}

export default Requests;
