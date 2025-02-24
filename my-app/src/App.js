import {  Router, Routes, Route } from "react-router-dom";
import Home from './Home';
import Collections from "./Collections";
import MaterialPage from "./Components/MaterialPage";
import Trending from "./Components/Collections/Trending";
import Themes from "./Components/Collections/Themes";  
import Style from "./Components/Collections/Style";
import Material from "./Components/Collections/Material";
import Checkout from "./Components/Checkout";
import WoodMaterialPage from "./Components/Material/WoodMaterialPage";
import AcrylicMaterialPage from "./Components/Material/AcrylicMaterialPage";
import ResinsMaterialPage from "./Components/Material/ResinsMaterialPage";
import ProductDetailPage from "./Components/ProductDetailPage";
import ProductComponent from "./Components/ProductComponent";
import { products } from "./List/product";
import CustomisedMaterialPage from "./Components/Collections/CustomisedMaterialPage";
import HIMPage from "./Components/HomePage/GiftingGuide/HIMPage";
import HERPage from "./Components/HomePage/GiftingGuide/HERPage";
import FriendsPage from "./Components/HomePage/GiftingGuide/FriendsPage";
import FamilyPage from "./Components/HomePage/GiftingGuide/FamilyPage";
import OfficePage from "./Components/HomePage/GiftingGuide/OfficePage";
import DIYPage from "./Components/HomePage/GiftingGuide/DIYPage";
import ScrollToTop from "./Components/ScrollToTop";

function App() {
  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/him" element={<HIMPage />} />
          <Route path="/collections/her" element={<HERPage />} />
          <Route path="/collections/friends" element={<FriendsPage />} />
          <Route path="/collections/family" element={<FamilyPage />} />
          <Route path="/collections/office" element={<OfficePage />} />
          <Route path="/collections/diy" element={<DIYPage />} />
          <Route path="/material/:materialType" element={<MaterialPage />} />
          <Route path="/collections/trending" element={<Trending />} />
          <Route path="/collections/themes" element={<Themes />} />
          <Route path="/collections/style" element={<Style />} />
          <Route path="/collections/material" element={<Material />} />
          <Route path="/material/wood" element={<WoodMaterialPage />} />
          <Route path="/" element={<ProductComponent products={products} addToCart={() => {}} />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/material/acrylic" element={<AcrylicMaterialPage />} />
          <Route path="/material/resins" element={<ResinsMaterialPage />} />
          <Route path="/collections/customised-products" element={<CustomisedMaterialPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>    
    </div>
  );
}

export default App;
