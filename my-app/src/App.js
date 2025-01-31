import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Home';
import Collections from "./Collections";
import MaterialPage from "./Components/MaterialPage";
import Trending from "./Components/Collections/Trending";
import Themes from "./Components/Collections/Themes";  
import Style from "./Components/Collections/Style";
import Material from "./Components/Collections/Material";
import Checkout from "./Components/Checkout";
import WoodMaterialPage from "./Components/Material/Wood";
import AcrylicMaterialPage from "./Components/Material/Acrylic";
import ResinsMaterialPage from "./Components/Material/Resins";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections/>} />
          <Route path="/material/:materialType" element={<MaterialPage />} />
          <Route path="/collections/trending" element={<Trending/>} />
          <Route path="/collections/themes" element={<Themes/>} />
          <Route path="/collections/style" element={<Style />} />
          <Route path="/collections/material" element={<Material/>} />
          <Route path="/material/wood" element={<WoodMaterialPage />} />
          <Route path="/material/acrylic" element={<AcrylicMaterialPage />} />
          <Route path="/material/resins" element={<ResinsMaterialPage />} />
          <Route path="/checkout" element={<Checkout/>} />
        </Routes>
      </Router>    
    </div>
  );
}

export default App;