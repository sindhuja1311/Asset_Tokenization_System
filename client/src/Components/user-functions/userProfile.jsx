import React, { useState, useEffect } from "react";
import UpdateProfile from "./UpdateProfile";
import { useSelector } from "react-redux";
import { getUserDetails } from "../../services/functions";

function UserProfile() {
    const metamaskId = useSelector(state => state.global.wallet);
    const [userDetails, setUserDetails] = useState({
        id: metamaskId || '',
        email: 'Not provided',
        uname: 'Not provided',
        pronouns: 'Not provided',
        phone_num: 'Not provided',
        aadharNumber: 'Not provided',
        pan_card: 'Not provided',
        profile_picture: '' // Initialize profile_picture as an empty string
    });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                console.log("Fetching user details...");
                const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
                const userDetails = await getUserDetails(accounts[0]);
                setUserDetails(userDetails);
                // Set the profile picture based on pronouns
                handleChooseProfilePicture(userDetails.pronouns);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUserDetails();
    }, []);

    const handleUpdate = (updatedDetails) => {
        setUserDetails(updatedDetails);
        setEditMode(false);
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
            profile_picture: pictureUrl
        }));
    };

    return (
        <div className="bg-gradient-to-br from-blue-600 to-gray-700 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-semibold text-white">User Profile</h1>
                <button onClick={handleEditClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Setup Profile</button>
            </div>

            <div className="bg-white rounded-lg shadow-md mb-0.5">
                <div className="flex flex-col items-center p-8">
                    <div className="mb-8">
                        <img src={userDetails.profile_picture || "/male_icon.png"} alt="Profile" className="w-24 h-24 rounded-full mb-2" />
                    </div>
                    <div className="flex flex-wrap justify-between w-full">
                        <div className="w-full md:w-1/2 mb-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Email:</label>
                                <p className="text-gray-900">{userDetails.email}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Full Name:</label>
                                <p className="text-gray-900">{userDetails.uname}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Pronouns:</label>
                                <p className="text-gray-900">{userDetails.pronouns}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 mb-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Phone Number:</label>
                                <p className="text-gray-900">{userDetails.phone_num}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Aadhar Number:</label>
                                <p className="text-gray-900">{userDetails.aadharNumber}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">PAN Card:</label>
                                <p className="text-gray-900">{userDetails.pan_card}</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Metamask ID:</label>
                            <p className="text-gray-900">{userDetails.id}</p>
                        </div>
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

export default UserProfile;
