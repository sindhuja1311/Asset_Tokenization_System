import React, { useState } from "react";
import axios from 'axios';

function UpdateProfile({ userDetails, onClose, onUpdate }) {
    const [editedUserDetails, setEditedUserDetails] = useState({
        uname: userDetails.uname || '',
        email: userDetails.email || '',
        full_name: userDetails.full_name || '',
        phone_num: userDetails.phone_num || '',
        metamask_id: userDetails.metamask_id || '',
        aadhar_number: userDetails.aadhar_number || '',
        pan_card: userDetails.pan_card || '',
        pronouns: userDetails.pronouns || 'he/him' // Include pronouns in the state
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUserDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const handleChooseProfilePicture = (pronouns) => {
        let pictureUrl = '/male_icon.png';
        if (pronouns === 'she/her') {
            pictureUrl = '/female_icon.png';
        }
        setEditedUserDetails(prevState => ({
            ...prevState,
            pronouns: pronouns
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make API call to update user details
            await axios.put(`http://localhost:3001/users/update/${userDetails._id}`, editedUserDetails);
            console.log('Profile updated successfully');
            onUpdate(editedUserDetails); // Pass updated details to parent component
            window.location.reload(); 
        } catch (error) {
            console.error('Error updating profile:', error);
            // Handle error
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Edit Profile</h2>
                <div className="flex justify-around mb-4">
                    {/* Option 1 */}
                    <img src="/male_icon.png" alt="Profile Picture 1" className={`w-16 h-16 rounded-full cursor-pointer ${editedUserDetails.pronouns === 'he/him' && 'border-2 border-blue-500'}`} onClick={() => handleChooseProfilePicture('he/him')} />
                    {/* Option 2 */}
                    <img src="/female_icon.png" alt="Profile Picture 2" className={`w-16 h-16 rounded-full cursor-pointer ${editedUserDetails.pronouns === 'she/her' && 'border-2 border-blue-500'}`} onClick={() => handleChooseProfilePicture('she/her')} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input type="radio" id="he_him" name="pronouns" value="he/him" onChange={handleChange} checked={editedUserDetails.pronouns === 'he/him'} />
                        <label htmlFor="he_him" className="ml-2">He/Him</label>
                        <input type="radio" id="she_her" name="pronouns" value="she/her" onChange={handleChange} checked={editedUserDetails.pronouns === 'she/her'} />
                        <label htmlFor="she_her" className="ml-2">She/Her</label>
                    </div>
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full lg:w-1/2 px-4 mb-4">
                            <label htmlFor="uname" className="block text-gray-700 font-semibold mb-2">Username:</label>
                            <input type="text" name="uname" id="uname" value={editedUserDetails.uname} onChange={handleChange} className="bg-gray-100 border-2 border-gray-300 p-2 rounded-md w-full" />
                        </div>
                        <div className="w-full lg:w-1/2 px-4 mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email:</label>
                            <input type="email" name="email" id="email" value={editedUserDetails.email} onChange={handleChange} className="bg-gray-100 border-2 border-gray-300 p-2 rounded-md w-full" />
                        </div>
                        <div className="w-full lg:w-1/2 px-4 mb-4">
                            <label htmlFor="full_name" className="block text-gray-700 font-semibold mb-2">Full Name:</label>
                            <input type="text" name="full_name" id="full_name" value={editedUserDetails.full_name} onChange={handleChange} className="bg-gray-100 border-2 border-gray-300 p-2 rounded-md w-full" />
                        </div>
                        <div className="w-full lg:w-1/2 px-4 mb-4">
                            <label htmlFor="phone_num" className="block text-gray-700 font-semibold mb-2">Phone Number:</label>
                            <input type="text" name="phone_num" id="phone_num" value={editedUserDetails.phone_num} onChange={handleChange} className="bg-gray-100 border-2 border-gray-300 p-2 rounded-md w-full" />
                        </div>
                        <div className="w-full px-4 mb-4">
                            <label htmlFor="metamask_id" className="block text-gray-700 font-semibold mb-2">Metamask ID:</label>
                            <input type="text" name="metamask_id" id="metamask_id" value={editedUserDetails.metamask_id} onChange={handleChange} className="bg-gray-100 border-2 border-gray-300 p-2 rounded-md w-full" />
                        </div>
                        <div className="w-full px-4 mb-4">
                            <label htmlFor="aadhar_number" className="block text-gray-700 font-semibold mb-2">Aadhar Number:</label>
                            <input type="text" name="aadhar_number" id="aadhar_number" value={editedUserDetails.aadhar_number} onChange={handleChange} className="bg-gray-100 border-2 border-gray-300 p-2 rounded-md w-full" />
                        </div>
                        <div className="w-full px-4 mb-4">
                            <label htmlFor="pan_card" className="block text-gray-700 font-semibold mb-2">PAN Card:</label>
                            <input type="text" name="pan_card" id="pan_card" value={editedUserDetails.pan_card} onChange={handleChange} className="bg-gray-100 border-2 border-gray-300 p-2 rounded-md w-full" />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
                        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateProfile;
