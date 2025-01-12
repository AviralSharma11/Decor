import Header from './Components/Header';
import Showcase from './Components/Showcase';
import GiftingGuide from './Components/GiftingGuide';
import BestSeller from './Components/BestSeller';
import Collage from './Components/Collage';
import Testimonials from './Components/Testimonials';
import SocialMediaBadges from './Components/SocialMediaBadges';
import Footer from './Components/Footer';


function Home() {
  return (
    <div className="Home">
     <Header/>
     <Showcase />
     <GiftingGuide />
     <BestSeller />
     <Collage />
     <SocialMediaBadges />
     <Testimonials />
     <Footer />
    </div>
  );
}

export default Home;
