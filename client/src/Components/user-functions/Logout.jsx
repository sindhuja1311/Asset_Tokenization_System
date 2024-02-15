import React from 'react';
import axios from 'axios';

function Logout() {
  const handleLogout = async () => {
    try {
      // Send a request to the logout route on the server
      const response = await axios.get('http://localhost:3001/users/logout');

      if (response.data.success) {
        // If logout is successful, redirect the user to the login page
        window.location.href = '/login'; // Redirect to your login page URL
      } else {
        console.error('Logout failed:', response.data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
