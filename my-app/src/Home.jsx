import Header from './Components/Header';
import Showcase from './Components/Showcase';
import GiftingGuide from './Components/GiftingGuide';
import BestSeller from './Components/BestSeller';
import Collage from './Components/Collage';
import Testimonials from './Components/Testimonials';
import SocialMediaBadges from './Components/SocialMediaBadges';
import Footer from './Components/Footer';
import "./Home.css";

function Home() {
  return (
    <div className="Home">
      <Header />
        <Showcase />
        <div className="parallax1"></div> {/* Parallax background section */}
        <div className="content-section">
        <GiftingGuide />
      </div>
      <div className="parallax2"></div> {/* Add another parallax section if needed */}
      <div className="content-section">
        <BestSeller />
      </div>
      <div className="parallax3"></div> {/* Add another parallax section if needed */}
      <div className="content-section">
        <Collage />
        <SocialMediaBadges />
        <Testimonials />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
