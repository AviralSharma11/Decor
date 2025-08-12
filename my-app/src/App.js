import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './Home';
import AdminDashboard from './AdminDashboard';
import Collections from "./Collections";
import Checkout from "./Components/Checkout";
import ProductDetailPage from "./Components/ProductDetailPage";
import ProductComponent from "./Components/ProductComponent";
import CustomisedMaterialPage from "./Components/Collections/CustomisedMaterialPage";
import HIMPage from "./Components/HomePage/GiftingGuide/HIMPage";
import HERPage from "./Components/HomePage/GiftingGuide/HERPage";
import FriendsPage from "./Components/HomePage/GiftingGuide/FriendsPage";
import FamilyPage from "./Components/HomePage/GiftingGuide/FamilyPage";
import OfficePage from "./Components/HomePage/GiftingGuide/OfficePage";
import DIYPage from "./Components/HomePage/GiftingGuide/DIYPage";
import ScrollToTop from "./Components/ScrollToTop";
import Shipping from "./Components/Footer/Shipping";
import ContactUS from "./Components/Footer/ContactUS";
import TermsConditions from "./Components/Footer/TermsConditions";
import PrivacyPolicy from "./Components/Footer/PrivacyPolicy";
import ReturnPolicy from "./Components/Footer/ReturnPolicy";
import Blogs from "./Components/Footer/KnowUs/Blogs";
import OurStory from "./Components/Footer/KnowUs/OurStory";
import Careers from "./Components/Footer/KnowUs/Careers";
import SellOnOceanWays from "./Components/Footer/KnowUs/SellOnOceanWays";
import Gifts from "./Components/Footer/DirectLinks/Gifts";
import Luxury from "./Components/Footer/DirectLinks/Luxury";
import PersonalisedJewellary from "./Components/Footer/DirectLinks/PersonalisedJewellary";
import WallArt from "./Components/Footer/DirectLinks/WallArt";
import FAQ from "./Components/Footer/FAQ";
import Users from "./Components/AdminDashboard/Users";
import Orders from "./Components/AdminDashboard/Orders";
import Settings from "./Components/AdminDashboard/Settings";
import Products from "./Components/AdminDashboard/Products";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import DynamicSubcategoryPage from "./Components/DynamicSubcategoryPage";
import DynamicCategory from "./Components/DynamicCategoryPage";

function App() {
  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Home />} />

          {/* Admin Dashboard */}
         <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        >
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>



          {/* Collections */}
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/him" element={<HIMPage />} />
          <Route path="/collections/her" element={<HERPage />} />
          <Route path="/collections/friends" element={<FriendsPage />} />
          <Route path="/collections/family" element={<FamilyPage />} />
          <Route path="/collections/office" element={<OfficePage />} />
          <Route path="/collections/diy" element={<DIYPage />} />
          <Route path="/collections/:category" element={<DynamicCategory />} />
          <Route path="/collections/:category/:subcategory" element={<DynamicSubcategoryPage />} />
          <Route path="/collections/customised-products" element={<CustomisedMaterialPage />} />


          {/* Product Pages */}
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/products" element={<ProductComponent addToCart={() => {}} />} />

          {/* Footer Links */}
          <Route path="/shipping" element={<Shipping/>}/>
          <Route path="/contact-us" element={<ContactUS />}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy/>} />
          <Route path="/terms-conditions" element = {<TermsConditions />} />
          <Route path="/faqs" element={<FAQ />} />

          {/* Know Us */}
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/sell-on-oceanways" element={<SellOnOceanWays />} />

          {/* Direct Links */}
          <Route path="/collections/gifts" element={<Gifts />} />
          <Route path="/collections/luxury" element={<Luxury />} />
          <Route path="/collections/personalised-jewellary" element={<PersonalisedJewellary />} />
          <Route path="/collections/wall-art" element={<WallArt />} />

          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Redirect invalid routes to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>    
    </div>
  );
}

export default App;
