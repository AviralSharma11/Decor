import React from "react";
import "../Styles/Modal.css";

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Login / Register</h2>
        <div className="modal-divider"></div>
        <form className="modal-form">
          <input
            type="text"
            placeholder="Enter Email ID or Phone Number"
            className="modal-input"
          />
          <button type="submit" className="modal-button">
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;


