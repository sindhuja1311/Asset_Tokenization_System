import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllUsers, isUserVerified,isUserRegistered,verifyUser,isPropertyInspector,inspectorsList } from '../../services/functions';
import { useSelector } from 'react-redux';

function ApproveUsers() {
    const [users, setUsers] = useState([]);
    const inspector_address = useSelector(state => state.global.wallet);
    useEffect(() => {
       
        const fetchUsers = async () => {
            try {
                const inspector_status=await isPropertyInspector(inspector_address);
                console.log("status:",inspector_status);
                const list=await inspectorsList();
                console.log("inspectors:",list);
                const userAddresses = await fetchAllUsers();
                // Construct user objects with default values
                const users = await Promise.all(userAddresses.map(async (address) => {
                    const status = await checkStatus(address);
                    const regstatus= await regStatus(address);
                    return {
                        id: address,
                        isRegistered: regstatus, // Assuming all users are not registered by default
                        isApproved: status, // Assuming all users are not approved by default
                    };
                }));
                setUsers(users);
            } catch (error) {
                // Handle errors
                console.error("Error fetching users:", error);
            }
        };
    
        // Fetch users when component mounts
        fetchUsers();
    }, []);
    
    const regStatus = async(address)=>{
        try{
            const regstatus= await isUserRegistered(address);
            return regstatus
        }
        catch(error){
            console.error("Error fetching users:", error);
        }
    }
    const checkStatus = async(user_address)=>{
        try{
            
            const status= await isUserVerified(user_address);
            return status;
        }
        catch(error){
            console.error("Error fetching users:", error);
        }
    }
    const handleApprove = async(userId) => {
        try{

            await verifyUser(userId,inspector_address);
            
        }
        catch(error){
            console.error("couldnt approve:", error);
        }
        
    };

    return (
        <div className="bg-gray-100 h-screen font-sans">
            <div className="container mx-auto p-8">
                <div className="mb-8 ml-8 mt-2">
                    <button
                        onClick={() => window.history.back()}
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
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Is Registered
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Is Approved
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.isRegistered? 'Yes' : 'No'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.isApproved? 'Yes' : 'No'}
                                </td>
                                
                                {!user.isApproved ? (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleApprove(user.id)} // Assuming handleApprove is defined to handle user approval
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Approve </button></td>
                                ) : (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                    Approved</td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ApproveUsers;
