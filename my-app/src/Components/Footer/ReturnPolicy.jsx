import React from "react";
import "../../Styles/Footer/FooterLinks.css";
import Header from "../Header";
import Footer from "../Footer";

const ReturnPolicy = () => {
  return (
    <>
    <Header />
    <div className="returns-policy-container">
      <h1>Returns & Refunds Policy</h1>
      <ol>
        <li>
          <strong>Damaged Products:</strong> If your product arrives damaged, please email us at care@oceanways.in within 24 hours with a photo of the damaged item and box. We will resolve it promptly.
        </li>
        <li>
          <strong>Return Eligibility:</strong> Return within 7 days of delivery. Mention the item(s) clearly. Hand over only the return items.
          <ul>
            <li><strong>a)</strong> Free return shipping. Store credit issued after pickup. Shipping charges are non-refundable.</li>
            <li><strong>b)</strong> Multiple returns from the same account may be denied or charged.</li>
          </ul>
        </li>
        <li><strong>Return Conditions:</strong> Unused items with original packaging and documents only.</li>
        <li><strong>Unserviceable Pin Codes:</strong> Pickup will be rescheduled when service resumes.</li>
        <li><strong>Missing Products / Tampering:</strong> Record video while unboxing. Contact support within 24 hours.</li>
        <li><strong>Shipping Delays:</strong> OceanWays is not liable for courier delays.</li>
        <li><strong>Order Cancellations:</strong> No cancellations after 4 hours. Packed orders are returnable only. Prepaid returns may incur two-way shipping fees.</li>
        <li><strong>Return Processing:</strong> Returns processed within 10 days. Contact care@oceanways.in or WhatsApp us.</li>
        <li><strong>Approval Required:</strong> All returns must be pre-approved via email/WhatsApp.</li>
        <li><strong>Online Only:</strong> Online orders cannot be returned in physical stores.</li>
        <li><strong>Store Credit:</strong> Valid for 3 months without restrictions.</li>
        <li><strong>Disputes:</strong> Jurisdiction: Courts of [City], India.</li>
        <li><strong>Handcrafted Products:</strong> Slight variations in handmade goods are natural and not defects.</li>
        <li><strong>Bulk / Custom Orders:</strong> Return policy does not apply. Reviewed case by case.</li>
        <li><strong>Policy Abuse:</strong> Repeated returns may be denied.</li>
      </ol>
      <p>For questions or clarifications, reach out to care@oceanways.in – we’re happy to assist!</p>
    </div>
    <Footer />
    </>
  );
};

export default ReturnPolicy;
