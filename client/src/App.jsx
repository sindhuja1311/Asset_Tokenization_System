// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
//components
import Add from './Components/admin-functions/Add';
import View from './Components/admin-functions/View';
import AssetCard from './Components/admin-functions/AssetCard';
import Update from './Components/admin-functions/Update';
import Approve from './Components/admin-functions/Approve';
import Uncard from './Components/admin-functions/Uncard';
import ApproveUsers from './Components/admin-functions/ApproveUsers'
// Pages
import HomePage from './Pages/HomePage';
import Register from './Pages/Register';
import Login from './Pages/Login';
import AdminDashboard from './Pages/AdminDashboard';
import UserDashboard from './Pages/UserDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admindash/*" element={<AdminDashboard />} />
        <Route path="/userdash/*" element={<UserDashboard />}/>
        <Route path="/add-asset" element={<Add />} />
        <Route path="/view-asset" element={<View />} />
        <Route path="/asset-card" element={<AssetCard />} />
        <Route path="/update-asset/:unique_id" element={<Update />} />
        <Route path="/approve-asset" element={<Approve />} />
        <Route path="/approve-users" element={<ApproveUsers />} />
        <Route path="/uncard" element={<Uncard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
