import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import UpdateProfile from "./UpdateProfile";
import { useLocation } from "react-router-dom";

function userProfile() {
    const [userDetails, setUserDetails] = useState();
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const email = queryParams.get("email");
    useEffect(() => {
        // Fetch user details from the server when the component mounts
        axios.get(`http://localhost:3001/users/details/${email}`)
            .then(response => {
                console.log('User details response:', response.data); // Log response data
                setUserDetails(response.data.user);
            })
            .catch(error => {
                console.error('Error fetching user details:', error); // Log error
                // Handle error properly, e.g., show an error message to the user
            });
    }, []);

    useEffect(() => {
        console.log('Updated userDetails:', userDetails);
    }, [userDetails]);

    const handleUpdate = (updatedDetails) => {
        setUserDetails(updatedDetails);
        setEditMode(false); // Exit edit mode after updating
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleCloseModal = () => {
        setEditMode(false);
    };

    const handleChooseProfilePicture = (pronoun) => {
        let pictureUrl = '/male_icon.png';
        if (pronoun === 'she/her') {
            pictureUrl = '/female_icon.png';
        }
        setUserDetails(prevState => ({
            ...prevState,
            pronouns: pronoun,
            profile_picture: pictureUrl
        }));
    };
    return (
            <div className="bg-gradient-to-br from-blue-600 to-gray-700 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-semibold text-white">User Profile</h1>
                <button onClick={handleEditClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Edit</button>
            </div>
    
            <div className="bg-white rounded-lg shadow-md mb-0.5">
                <div className="flex flex-col items-center p-8">
                    <div className="mb-8">
                        {userDetails && userDetails.profile_picture ? (
                            <img src={userDetails.profile_picture} alt="Profile" className="w-24 h-24 rounded-full mb-2" />
                        ) : (
                            userDetails && userDetails.pronouns === 'he/him' ? (
                                <img src="/male_icon.png" alt="Male Profile" className="w-24 h-24 rounded-full mb-2" />
                            ) : userDetails && userDetails.pronouns === 'she/her' ? (
                                <img src="/female_icon.png" alt="Female Profile" className="w-24 h-24 rounded-full mb-2" />
                            ) : (
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-gray-600 text-4xl">?</span>
                                </div>
                            )
                        )}
                        <p className="text-gray-900 text-2xl">{userDetails?.uname || "nope"}</p>
                    </div>
                    <div className="flex flex-wrap justify-between=== w-full">
                        <div className="w-full md:w-1/2 mb-6">
                            {userDetails && (
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Email:</label>
                                        <p className="text-gray-900">{userDetails.email || 'Not provided'}</p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Full Name:</label>
                                        <p className="text-gray-900">{userDetails.full_name || 'Not provided'}</p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Pronouns:</label>
                                        <p className="text-gray-900">{userDetails.pronouns || 'Not provided'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-full md:w-1/2 mb-6">
                            {userDetails && (
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Phone Number:</label>
                                        <p className="text-gray-900">{userDetails.phone_num || 'Not provided'}</p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Aadhar Number:</label>
                                        <p className="text-gray-900">{userDetails.aadhar_number || 'Not provided'}</p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">PAN Card:</label>
                                        <p className="text-gray-900">{userDetails.pan_card || 'Not provided'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full mb-6">
                    {userDetails && (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Metamask ID:</label>
                            <p className="text-gray-900">{userDetails.metamask_id || 'Not provided'}</p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
    
            {editMode && (
                <UpdateProfile
                    userDetails={userDetails}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
    
    
}

export default userProfile;
