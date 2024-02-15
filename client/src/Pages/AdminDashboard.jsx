import { Link,Route,Routes } from "react-router-dom";


function AdminDashboard() {
  return (
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
                  to="/add-asset"
                  className="flex items-center justify-center decoration-none text-blue-500 font-bold text-lg pl-4 pr-8 border-blue-500 border-2 border-solid rounded-lg transition duration-300 ease-in-out hover:text-white hover:bg-blue-500 h-14"
                >
                  Add Assets
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
            </ul>
          </div>
          <div className="admin-dashboard-gif flex-1 mt-5">
            <img src="admin_image.gif" className="max-w-full h-auto rounded-lg" alt="Your GIF" />
          </div>
        </div>
      </div>
      <Routes>
        
        </Routes>
    </div>
  );
}

export default AdminDashboard;
