import React from "react";
import "../Styles/SocialMediaBadges.css"; // CSS file for styling

const SocialMediaBadges = () => {
  return (
    <div className="social-media-badges">
      <a
        href="https://wa.me/1234567890" // Replace with your WhatsApp link
        target="_blank"
        rel="noopener noreferrer"
        className="badge whatsapp-badge"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
          alt="WhatsApp"
        />
      </a>
      <a
        href="https://www.instagram.com/aviralshama.7/" // Replace with your Instagram link
        target="_blank"
        rel="noopener noreferrer"
        className="badge instagram-badge"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733558.png"
          alt="Instagram"
        />
      </a>
    </div>
  );
};

export default SocialMediaBadges;
