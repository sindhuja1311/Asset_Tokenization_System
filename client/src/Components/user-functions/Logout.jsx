import React from 'react';
import axios from 'axios';

function Logout() {
  const handleLogout = async () => {
    console.log("handlelogout");
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
