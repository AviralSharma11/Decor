import React, { useEffect, useState } from "react";
import "../../Styles/AdminDashboard/Settings.css";
import { API_BASE_URL } from "../../api/config";

export default function Settings() {
  const [form, setForm] = useState({
    site_name: "",
    contact_email: "",
    contact_phone: "",
    user_registration_enabled: false,
  });

  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/settings`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch((err) => console.error(err));
  };

  return (
     
    <div className="settings-container">
      <h2>Admin Settings</h2>
      <form className="settings-form" onSubmit={handleSubmit}>
        <label>
          Website Name:
          <input
            type="text"
            name="site_name"
            value={form.site_name}
            onChange={handleChange}
          />
        </label>

        <label>
          Contact Email:
          <input
            type="email"
            name="contact_email"
            value={form.contact_email}
            onChange={handleChange}
          />
        </label>

        <label>
          Contact Phone:
          <input
            type="text"
            name="contact_phone"
            value={form.contact_phone}
            onChange={handleChange}
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="user_registration_enabled"
            checked={form.user_registration_enabled}
            onChange={handleChange}
          />
          Enable User Registration
        </label>

        <button className="sbutton" type="submit">Save Settings</button>
        {status && <p className="status">{status}</p>}
      </form>
    </div>
  );
}
