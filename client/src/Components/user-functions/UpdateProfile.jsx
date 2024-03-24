import React, { useEffect, useState } from "react";
import axios from 'axios';
import { addUserDetails } from "../../services/functions";
import { getEthereumContract } from "../../services/functions";

function UpdateProfile({ userDetails, onClose, onUpdate }) {
    useEffect(() => {
        getEthereumContract();
      });
    
    const [editedUserDetails, setEditedUserDetails] = useState({
        id:userDetails?.id|| '',
        email: userDetails?.email === 'Not provided' ? '' : userDetails?.email || '',
        uname: userDetails?.uname === 'Not provided' ? '' : userDetails?.uname || '',
        phone_num: userDetails?.phone_num === 'Not provided' ? '' : userDetails?.phone_num || '',
        aadharNumber: userDetails?.aadharNumber === 'Not provided' ? '' : userDetails?.aadharNumber || '',
        pan_card: userDetails?.pan_card === 'Not provided' ? '' : userDetails?.pan_card || '',
        pronouns: userDetails?.pronouns === 'Not provided' ? 'he/him' : userDetails?.pronouns || 'he/him' // Include pronouns in the state
    });
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUserDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleChooseProfilePicture = (pronouns) => {
        console.log("Selected pronouns:", pronouns);
        setEditedUserDetails(prevState => ({
            ...prevState,
            pronouns: pronouns
        }));
    };
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { id, uname, pronouns, email, phone_num, aadharNumber, pan_card } = editedUserDetails; // Destructure the editedUserDetails object to access its properties
    
            if (!id || !uname || !pronouns || !email || !phone_num || !aadharNumber || !pan_card) return;
    
            const user = {
                uname,
                pronouns: pronouns === 'he/him' ? 'he/him' : 'she/her', // Ensure pronouns are set properly
                email,
                phone_num,
                id,
                aadharNumber,
                pan_card
            };
    
            console.log(user);
    
            await addUserDetails(user.uname, user.email, user.phone_num, user.aadharNumber, user.pan_card, user.pronouns);
            console.log("Successfully added");
    
        } catch (error) {
            console.log("Error:", error);
            console.log("Error - can't add");
        }
    }
    

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
                            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email:</label>
                            <input type="email" name="email" id="email" value={editedUserDetails.email} onChange={handleChange} className="bg-gray-100 border-2 border-gray-300 p-2 rounded-md w-full" />
                        </div>
                        <div className="w-full lg:w-1/2 px-4 mb-4">
                            <label htmlFor="uname" className="block text-gray-700 font-semibold mb-2">Full Name:</label>
                            <input type="text" name="uname" id="uname" value={editedUserDetails.uname} onChange={handleChange} className="bg-gray-100 border-2 border-gray-300 p-2 rounded-md w-full" />
                        </div>
                        <div className="w-full lg:w-1/2 px-4 mb-4">
                            <label htmlFor="phone_num" className="block text-gray-700 font-semibold mb-2">Phone Number:</label>
                            <input type="text" name="phone_num" id="phone_num" value={editedUserDetails.phone_num} onChange={handleChange} className="bg-gray-100 border-2 border-gray-300 p-2 rounded-md w-full" />
                        </div>
                        <div className="w-full px-4 mb-4">
                            <label htmlFor="id" className="block text-gray-700 font-semibold mb-2">Metamask ID:</label>
                            <input type="text" name="id" id="id" value={editedUserDetails.id} onChange={handleChange} className="bg-gray-100 border-2 border-gray-300 p-2 rounded-md w-full" />
                        </div>
                        <div className="w-full px-4 mb-4">
                            <label htmlFor="aadharNumber" className="block text-gray-700 font-semibold mb-2">Aadhar Number:</label>
                            <input type="text" name="aadharNumber" id="aadharNumber" value={editedUserDetails.aadharNumber} onChange={handleChange} className="bg-gray-100 border-2 border-gray-300 p-2 rounded-md w-full" />
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
