import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MyAssets from "../Components/user-functions/MyAssets";
import BuyInvest from "../Components/user-functions/BuyInvest";
import Requests from "../Components/user-functions/Requests";
import Pendings from "../Components/user-functions/Pendings";
import UserProfile from "../Components/user-functions/userProfile"; // Update 'UserProfile' to 'userProfile'
import AssetUpload from "../Components/user-functions/AssetUpload";
import CoOwned from "../Components/user-functions/CoOwned";
import React from "react";
import { useLocation } from "react-router-dom";

function UserDashboard() {
  // Use state to manage the active component
  const [activeComponent, setActiveComponent] = useState(() => {
    // On component mount, check if there's an active component in session storage
    // If not, default to 'user-profile'
    return sessionStorage.getItem("activeComponent") || "user-profile";
  });
  const metamaskId = useSelector(state => state.global.wallet);
    const userAddress=metamaskId;
  // Update session storage when the active component changes
  useEffect(() => {
    sessionStorage.setItem("activeComponent", activeComponent);
  }, [activeComponent]);

  // Render the selected component
  const renderComponent = (component) => {
    switch (component) {
      case "my-assets":
        return <MyAssets  />;
      case "buy-invest":
        return <BuyInvest />;
      case "co-owned":
        return <CoOwned />;
      case "requests":
        return <Requests />;
      case "pendings":
        return <Pendings />;
      case "user-profile":
        return <UserProfile  />;
      case "asset-upload":
        return <AssetUpload />;
      default:
        return null;
    }
  };

    return(
        <div className="flex h-screen ">  
          <div className="relative flex flex-col flex-grow bg-clip-border  font-extrabold bg-white text-gray-700  w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 opacity-100 h-12/6">
          <div className=" mb-2 p-4">
            <h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-gray-900">User Dashboard</h5>
          </div>
          <nav className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal flex-grow overflow-y-auto text-gray-700 h-full">
            <div onClick={() => setActiveComponent("my-assets")} role="button" tabIndex="0" className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
              <div className="grid place-items-center mr-4">
                <img src="/my_assets.gif"  fill="currentColor" aria-hidden="true" className="h-10 w-10"/>
              </div>
              My Assets
            </div>
            <div onClick={() => setActiveComponent("co-owned")} role="button" tabIndex="0" className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
              <div className="grid place-items-center mr-4">
                <img src="/listed.gif"  fill="currentColor" aria-hidden="true" className="h-10 w-10"/> 
              </div>
              Co-Owned
            </div>
            <div onClick={() => setActiveComponent("buy-invest")} role="button" tabIndex="0" className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
              <div className="grid place-items-center mr-4">
                <img src="/shopping-cart.gif"  fill="currentColor" aria-hidden="true" className="h-10 w-10"/> 
              </div>
              Buy or Invest
            </div>
            <div  onClick={() => setActiveComponent("requests")} role="button" tabIndex="0" className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
              <div className="grid place-items-center mr-4">
                <img src= "/request.gif"  fill="currentColor" aria-hidden="true" className="h-10 w-10" />
              </div>
              Requests
            </div>
            <div onClick={() => setActiveComponent("pendings")} role="button" tabIndex="0" className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
              <div className="grid place-items-center mr-4">
                <img src="/pending.gif"  fill="currentColor" aria-hidden="true" className="h-10 w-10"/> 
              </div>
              Pending Payments
            </div>
            <div onClick={() => setActiveComponent("user-profile")} role="button" tabIndex="0" className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
              <div className="grid place-items-center mr-4">
                <img src="/profile.gif"  fill="currentColor" aria-hidden="true" className="h-10 w-10"/>
              </div>Profile
            </div>
            <div onClick={() => setActiveComponent("asset-upload")} role="button" tabIndex="0" className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
              <div className="grid place-items-center mr-4">
                <img src="/bbuyy.gif"  fill="currentColor" aria-hidden="true" className="h-10 w-10"/>
              </div>Request Asset Upload
            </div>
            <Link to="/" role="button" tabIndex="0" className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
              <div className="grid place-items-center mr-4">
                <img src="/logout.gif"  fill="currentColor" aria-hidden="true" className="h-10 w-10"/>
              </div>Go Back Home
            </Link>
          </nav>
        </div>
        <div className="flex-grow p-8">
        {renderComponent(activeComponent)}
        
          <Routes>
            <Route path="/my-assets" element={<MyAssets userAddress={userAddress}/>} />
            <Route path="/buy-invest" element={<BuyInvest  />} />
            <Route path="/co-owned" element={<CoOwned  />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/pendings" element={<Pendings />} />
            <Route path="/user-profile" element={<UserProfile  />} />
            <Route path="/asset-upload" element={<AssetUpload />} />
          </Routes>
        
      </div>
        </div>
    );
}

export default UserDashboard; 



