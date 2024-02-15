import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import MyAssets from "../Components/user-functions/MyAssets";
import BuyInvest from "../Components/user-functions/BuyInvest";
import Requests from "../Components/user-functions/Requests";
import UserProfile from "../Components/user-functions/userProfile"; // Update 'UserProfile' to 'userProfile'
import AssetUpload from "../Components/user-functions/AssetUpload";
import Logout from "../Components/user-functions/Logout";
import React from "react";
import { useLocation } from "react-router-dom";

function UserDashboard() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const email = queryParams.get("email");

  // Use state to manage the active component
  const [activeComponent, setActiveComponent] = useState(() => {
    // On component mount, check if there's an active component in session storage
    // If not, default to 'user-profile'
    return sessionStorage.getItem("activeComponent") || "user-profile";
  });

  // Update session storage when the active component changes
  useEffect(() => {
    sessionStorage.setItem("activeComponent", activeComponent);
  }, [activeComponent]);

  // Render the selected component
  const renderComponent = (component) => {
    switch (component) {
      case "my-assets":
        return <MyAssets email={email} />;
      case "buy-invest":
        return <BuyInvest />;
      case "requests":
        return <Requests />;
      case "user-profile":
        return <UserProfile email={email} />;
      case "asset-upload":
        return <AssetUpload />;
      case "logout":
        return <Logout />;
      default:
        return null;
    }
  };

    return(
        <div className="flex h-screen ">  
          <div className="relative flex flex-col bg-clip-border  font-extrabold bg-white text-gray-700  w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 opacity-100">
          <div className="mb-2 p-4">
            <h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-gray-900">User Dashboard</h5>
          </div>
          <nav className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-gray-700">
            <div onClick={() => setActiveComponent("my-assets")} role="button" tabIndex="0" className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
              <div className="grid place-items-center mr-4">
                <img src="/my_assets.gif"  fill="currentColor" aria-hidden="true" className="h-10 w-10"/>
              </div>
              My Assets
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
              </div>Requests <div className="grid place-items-center ml-auto justify-self-end">
                <div className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-blue-500/20 text-blue-900 py-1 px-2 text-xs rounded-full opacity-100">
                  <span className="">14</span>
                </div>
              </div>
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
            <div onClick={() => setActiveComponent("logout")} role="button" tabIndex="0" className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
              <div className="grid place-items-center mr-4">
                <img src="/logout.gif"  fill="currentColor" aria-hidden="true" className="h-10 w-10"/>
              </div>Log Out
            </div>
          </nav>
        </div>
        <div className="flex-grow p-8">
        {renderComponent(activeComponent)}
        
          <Routes>
            <Route path="/my-assets" element={<MyAssets email={email}/>} />
            <Route path="/buy-invest" element={<BuyInvest email={email} />} />
            <Route path="/requests" element={<Requests email={email}/>} />
            <Route path="/user-profile" element={<UserProfile email={email} />} />
            <Route path="/asset-upload" element={<AssetUpload email={email}/>} />
            <Route path="/logout" element={<Logout email={email}/>} />
          </Routes>
        
      </div>
        </div>
    );
}

export default UserDashboard; 


