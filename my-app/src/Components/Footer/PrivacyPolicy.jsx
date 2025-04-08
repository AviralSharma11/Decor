import React from "react";
import "../../Styles/Footer/FooterLinks.css";
import Header from "../Header";
import Footer from "../Footer";

const PrivacyPolicy = () => {
  return (
    <>
    <Header />
    <div className="privacy-container">
        
      <h1 className="privacy-title">Privacy Policy</h1>

      <section>
        <h2>1. Consent</h2>
        <p>
          1.1 By using the Website and/or providing your information, you consent
          to its collection and use as per this Privacy Policy, including consent
          to share your information for the purposes listed herein.
        </p>
        <p>
          1.2 All personal data will be retained as required for operational or
          legal purposes. Non-personal data may be retained indefinitely.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect & Use</h2>
        <ul>
          <li>
            <strong>2.1 Personal Data:</strong> Name, email, address, phone number —
            used for identification, order processing, customer service, and
            personalization.
          </li>
          <li>
            <strong>2.2 Transaction Details:</strong> Payment mode and bank used (via
            third-party gateways); used for analytics and promotional campaigns.
          </li>
          <li>
            <strong>2.3 Network & Location Data:</strong> IP address and geolocation
            data collected for analytics, traffic analysis, and fraud detection.
          </li>
          <li>
            <strong>2.4 Communication Logs:</strong> Call and WhatsApp logs stored
            for training, quality, and security.
          </li>
          <li>
            <strong>2.5 Social Media Content:</strong> Public posts tagging OceanWays
            may be reshared or analyzed for engagement and fraud prevention.
          </li>
          <li>
            <strong>2.6 Third-Party Data:</strong> Supplemented from external sources
            for segmentation, personalization, and targeted advertising.
          </li>
          <li>
            <strong>2.7 Updates:</strong> You may be asked to refresh your data to
            improve service quality and relevance.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Access to Data</h2>
        <p>
          Only authorized personnel have access to your data, which is securely
          stored and used strictly for legitimate business needs.
        </p>
      </section>

      <section>
        <h2>4. Data Security</h2>
        <ul>
          <li>
            <strong>4.1 No Sale of Data:</strong> We do not sell your data. It may be
            shared with service providers (e.g., ad platforms) under confidentiality.
          </li>
          <li>
            <strong>4.2 Data Deletion:</strong> To delete your account or data, email
            us at <a href="mailto:support@oceanways.in">support@oceanways.in</a> with your full name and phone number.
          </li>
          <li>
            <strong>4.3 Communication Preferences:</strong> Opt out of marketing
            emails via ‘Unsubscribe’ or by writing to <a href="mailto:privacy@oceanways.in">privacy@oceanways.in</a>.
          </li>
          <li>
            <strong>4.4 Cookies:</strong> Used for session tracking and personalization. You can manage cookies
            in browser settings.
          </li>
          <li>
            <strong>4.5 External Links:</strong> While we link to trusted sites, OceanWays is not responsible
            for external content.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Policy Review & Updates</h2>
        <p>This policy may be updated periodically. Please review it regularly.</p>
        <p>Significant changes will be announced on our Website.</p>
      </section>

      <section>
        <h2>6. Opt-Out Rights</h2>
        <p>
          To withdraw consent or opt out of data usage, email <a href="mailto:privacy@oceanways.in">privacy@oceanways.in</a>. This may limit access to certain services.
        </p>
      </section>

      <section>
        <h2>7. Data Accuracy & Correction</h2>
        <p>
          You are responsible for ensuring your data is accurate. Contact us to
          correct any outdated or incorrect information.
        </p>
      </section>

      <section>
        <h2>8. Force Majeure</h2>
        <p>
          We are not liable for data loss due to natural disasters, cyberattacks,
          power failures, or other events beyond our control.
        </p>
        <p>
          We will take reasonable precautions, but full internet security cannot be guaranteed.
        </p>
      </section>

      <section>
        <h2>9. Grievance Officer</h2>
        <p>
          Name: [Insert Officer's Name] <br />
          Email: <a href="mailto:privacy@oceanways.in">privacy@oceanways.in</a> <br />
          Designation: Grievance Officer
        </p>
      </section>

      <section>
        <h2>10. Governing Law & Jurisdiction</h2>
        <p>
          This Policy is governed by Indian law. Any disputes shall be exclusively
          subject to the jurisdiction of courts in [City, India].
        </p>
      </section>
      
    </div>
    <Footer />
    </>
  );
};

export default PrivacyPolicy;
