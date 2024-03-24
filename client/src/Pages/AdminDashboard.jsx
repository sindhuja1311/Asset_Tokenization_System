import { Link } from "react-router-dom";
import { useState } from "react";
import { addInspectorDetails,isPropertyInspector } from "../services/functions";
import { connectWallet,checkWallet } from "../services/functions";
import { setWallet } from "../redux/actions/globalActions";

function AdminDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [inspectorData, setInspectorData] = useState({
    inspector_address: "",
    inspector_name: "",
    age: "",
    designation: "",
    city: ""
  });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setInspectorData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
    const handleConnectWallet = async () => {
    
      try {
        await connectWallet(); // Call connectWallet function
  
        // Call checkWallet function to continuously monitor wallet changes
        await checkWallet();
       
        const accounts = await ethereum.request?.({ method: 'eth_requestAccounts' });
        console.log("acct:",accounts);
        setWallet(accounts?.[0]);
        console.log("wallet successfully connected");
      } catch (error) {
        console.log("failed to connect:",error);
      };
    };
  const handleGetStarted = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Destructure values from inspectorData object
      const { inspector_address, inspector_name, age, designation, city } = inspectorData;
      
      // Check if any of the required fields are empty
      if (!inspector_address || !inspector_name || !age || !designation || !city) {
        console.log("Please fill out all fields.");
        return;
      }
  
      // Create inspector object
      const inspector = {
        inspector_address,
        inspector_name,
        age,
        designation,
        city
      };
  
      console.log(inspector);
  
      // Call addInspectorDetails function with inspector details
      await addInspectorDetails(inspector.inspector_address, inspector.inspector_name, inspector.age, inspector.designation, inspector.city);
        console.log("Successfully added");
      
      handleCloseForm();
    } catch (error) {
      console.log("Error:", error);
      console.log("Error - can't add");
    }
  };
  

  return (
    
    <div className="relative">
      <button
        onClick={handleConnectWallet}
        className="absolute top-4 right-48 md:top-8 md:right-52 inline-block px-6 py-3 bg-green-500 text-white text-base md:text-lg font-semibold rounded-full transition duration-300 hover:bg-green-600"
      >
        Connect Wallet
      </button>
      <button
        onClick={handleGetStarted}
        className="absolute top-4 right-4 md:top-8 md:right-8 inline-block px-6 py-3 bg-green-500 text-white text-base md:text-lg font-semibold rounded-full transition duration-300 hover:bg-green-600"
      >
        Add Inspector
      </button>
  
      {showForm && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg z-50">
          <h2 className="text-2xl font-semibold mb-4">Add Inspector</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input type="text" name="inspector_address" placeholder="Inspector Address" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleChange}/>
            </div>
            <div className="mb-4">
              <input type="text" name="inspector_name" placeholder="Name" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleChange}/>
            </div>
            <div className="mb-4">
              <input type="number" name="age" placeholder="Age" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleChange}/>
            </div>
            <div className="mb-4">
              <input type="text" name="designation" placeholder="Designation" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleChange}/>
            </div>
            <div className="mb-4">
              <input type="text" name="city" placeholder="City" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleChange}/>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={handleCloseForm} className="mr-2 px-4 py-2 text-white bg-gray-500 rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-md">Submit</button>
            </div>
          </form>
        </div>
      )}
      <div className="body1 flex items-center justify-center h-screen m-0">
        <div className="admin-dashboard-container max-w-3xl p-8 box-border text-center bg-gray-100 rounded-lg shadow-lg flex flex-col items-center justify-center ">
          <h2 className="admin-dashboard-header text-3xl md:text-4xl font-bold mb-5 text-indigo-800">
            🚀 Welcome to Admin Dashboard 🚀
          </h2>
          <div className="admin-dashboard-content flex flex-col md:flex-row items-center">
            <div className="admin-dashboard-text flex-1 md:mr-8 mb-6 md:mb-0 text-center">
              <ul className="admin-dashboard-list list-none p-0">
                <li className="mb-3 md:mb-4 transform hover:scale-103">
                  <Link
                    to="/approve-users"
                    className="flex items-center justify-center decoration-none text-blue-500 font-bold text-lg pl-4 pr-8 border-blue-500 border-2 border-solid rounded-lg transition duration-300 ease-in-out hover:text-white hover:bg-blue-500 h-14"
                  >
                    Approve Users
                  </Link>
                </li>
                <li className="mb-3 md:mb-4 transform hover:scale-103">
                  <Link
                    to="/view-asset"
                    className="flex items-center justify-center decoration-none text-blue-500 font-bold text-lg pl-4 pr-8 border-blue-500 border-2 border-solid rounded-lg transition duration-300 ease-in-out hover:text-white hover:bg-blue-500 h-14"
                  >
                    View Assets
                  </Link>
                </li>
                <li className="mb-3 md:mb-4 transform hover:scale-103">
                  <Link
                    to="/approve-asset"
                    className="flex items-center justify-center decoration-none text-blue-500 font-bold text-lg pl-4 pr-8 border-blue-500 border-2 border-solid rounded-lg transition duration-300 ease-in-out hover:text-white hover:bg-blue-500 h-14"
                  >
                    Approve Assets
                  </Link>
                </li>
                <li className="mb-3 md:mb-4 transform hover:scale-103">
                  <Link
                    to="/list-asset"
                    className="flex items-center justify-center decoration-none text-blue-500 font-bold text-lg pl-4 pr-8 border-blue-500 border-2 border-solid rounded-lg transition duration-300 ease-in-out hover:text-white hover:bg-blue-500 h-14"
                  >
                    List Assets
                  </Link>
                </li>
              </ul>
            </div>
            <div className="admin-dashboard-gif flex-1 mt-5">
              <img src="admin_image.gif" className="max-w-full h-auto rounded-lg" alt="Your GIF" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
