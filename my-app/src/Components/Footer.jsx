import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Footer.css";

const Footer = () => {
  const footerLinks = [
    // { name: "Create a Return", path: "/create-return" },
    { name: "Shipping", path: "/shipping" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Return Policy", path: "/return-policy" },
    { name: "Terms & Conditions", path: "/terms-conditions" },
    { name: "Contact Us", path: "/contact-us" },
    { name: "FAQs", path: "/faqs" },
  ];

  const directLinks = [
    {name: "Home Decors" , path: "/collections"},
    {name: "Gifts" , path: "/collections/gifts"},
    {name: "Personalised Jewellary" , path: "/collections/personalised-jewellary"},
    {name: "Custom Art" , path: "/collections/customised-products"},
    {name: "Wall Art" , path: "/collections/wall-art"},
    {name: "Luxury" , path: "/collections/luxury"},
  ]

  const knowUsLinks = [
    {name: "Our Story" , path: "/our-story"},
    {name: "Blogs" , path: "/blogs"},
    {name: "Careers" , path: "/careers"},
    {name: "Sell on OceanWays" , path: "/sell-on-oceanways"},
  ]

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-contact">
          <Link to="/" style={{textDecoration: 'none'}}>
            <h1 className="title">OceanWays</h1>
            <span className="subtitle">Navigating Creativity, Inspiring Spaces</span>
            </Link>
            <div className="contact-us">
                <div className="icons insta">
                <a
                    href="https://www.instagram.com/aviralsharma.7/" // Replace with your Instagram link
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{color: "#333"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                    </svg>
                  </a>
                </div>
                <div className="icons whatsapp">
                <a
                  href="https://wa.me/qr/IMOVSX4SDTJ5M1 " // Replace with your WhatsApp link
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{color: "#333"}}> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                      </svg>
                    </a>
                </div>
                <div className="icons phone">
                <a 
                  href="tel:+918253048499"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{color: "#333"}}> { /*replace with phone number */ }
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-telephone" viewBox="0 0 16 16">
                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                  </svg>
                </a>
                </div>
            </div>
          </div>
        </div>


        {/* Top Categories Section */}
        <div className="footer-section">
          <h3>Top Categories</h3>
          <ul className="footer-list">
            {directLinks.map((link) => (
                <li key={link.name}>
                  <Link style={{textDecoration: "none", color:"#1f1f1f"}} to={link.path}>{link.name} </Link>
                </li>
              ))}
          </ul>
        </div>

        {/* About Us Section */}
        <div className="footer-section">
          <h3>About Us</h3>
          <ul className="footer-list">
              {knowUsLinks.map((link) => (
                    <li key={link.name}>
                      <Link style={{textDecoration: "none", color:"#1f1f1f"}} to={link.path}>{link.name} </Link>
                    </li>
                  ))}
          </ul>
        </div>


        {/* Help Section */}
        <div className="footer-section">
          <h3>Help</h3>
          <ul className="footer-list">
            {footerLinks.map((link) => (
              <li key={link.name}>
                <Link style={{textDecoration: "none", color:"#1f1f1f"}} to={link.path}>{link.name} </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
