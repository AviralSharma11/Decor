import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './Home';
import AdminDashboard from './AdminDashboard';
import Collections from "./Collections";
// import MaterialPage from "./Components/MaterialPage";
// import Trending from "./Components/Collections/Trending";
// import Themes from "./Components/Collections/Themes";  
// import Style from "./Components/Collections/Style";
// import Material from "./Components/Collections/Material";
import Checkout from "./Components/Checkout";
// import WoodMaterialPage from "./Components/Material/WoodMaterialPage";
// import AcrylicMaterialPage from "./Components/Material/AcrylicMaterialPage";
// import ResinsMaterialPage from "./Components/Material/ResinsMaterialPage";
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
// import Coquette from "./Components/Trending/Coquette";
// import Dopamine from "./Components/Trending/Dopamine";
// import SoftGirlAesthetic from "./Components/Trending/SoftGirlAesthetic";
// import Earthy from "./Components/Themes/Earthy";
// import ModernMinimalist from "./Components/Themes/ModernMinimalist";
// import Safari from "./Components/Themes/Safari";
// import Wellness from "./Components/Themes/Wellness";
// import OfficeEssential from "./Components/Themes/Wellness";
// import Transitional from "./Components/Style/Transitional";
// import Traditional from "./Components/Style/Traditional";
// import Bohemian from "./Components/Style/Bohemian";
// import Vintage from "./Components/Style/Vintage";
// import Modern from "./Components/Style/Modern";
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
          {/* <Route path="/collections/trending" element={<Trending />} />
          <Route path="/collections/themes" element={<Themes />} />
          <Route path="/collections/style" element={<Style />} />
          <Route path="/collections/material" element={<Material />} /> */}
          <Route path="/collections/customised-products" element={<CustomisedMaterialPage />} />

          {/* Materials */}
          {/* <Route path="/material/:materialType" element={<MaterialPage />} />
          <Route path="/material/wood" element={<WoodMaterialPage />} />
          <Route path="/material/acrylic" element={<AcrylicMaterialPage />} />
          <Route path="/material/resins" element={<ResinsMaterialPage />} /> */}

          {/* Trending Pages */}
          {/* <Route path="/trending/dopamine" element={<Dopamine />} />
          <Route path="/trending/coquette" element={<Coquette />} />
          <Route path="/trending/soft-girl-aesthetic" element={<SoftGirlAesthetic />} /> */}

          {/* Theme pages */}
          {/* <Route path="/themes/earthy" element={<Earthy />} />
          <Route path="/themes/modern-minimalist" element={<ModernMinimalist />} />
          <Route path="/themes/office-essential" element={<OfficeEssential/>} />
          <Route path="/themes/safari" element={<Safari />} />
          <Route path="/themes/wellness" element={<Wellness />}/> */}

          {/* Style pages */}
          {/* <Route path="/style/bohemian" element={<Bohemian />} />
          <Route path="/style/modern" element={<Modern />} />
          <Route path="/style/traditional" element={<Traditional />} />
          <Route path="/style/vintage" element={<Vintage />}/>
          <Route path="/style/transitional" element={<Transitional />} /> */}

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
