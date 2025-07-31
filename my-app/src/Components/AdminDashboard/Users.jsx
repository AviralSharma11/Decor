import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/AdminDashboard/Users.css";
import AdminSidebar from "../../AdminSidebar";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  const handleExport = () => {
    window.open("http://localhost:5000/api/users/export", "_blank");
  };

  return (
     <div style={{ display: 'flex' }}>
          <AdminSidebar />
    <div className="users-container">
      <h2>User List</h2>
      <button className="export-button" onClick={handleExport}>
        Download Excel
      </button>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            {/* <th>Name</th> */}
            <th>Email</th>
            {/* <th>Phone</th> */}
            {/* <th>Created At</th> */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              {/* <td>{user.name}</td> */}
              <td>{user.email}</td>
              {/* <td>{user.phone}</td> */}
              {/* <td>{new Date(user.created_at).toLocaleString()}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
