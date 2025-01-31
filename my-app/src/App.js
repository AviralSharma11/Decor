import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Home';
import Collections from "./Collections";
import MaterialPage from "./Components/MaterialPage";
import Checkout from "./Components/Checkout";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections/>} />
          <Route path="/material/:materialType" element={<MaterialPage />} />
          <Route path="/checkout" element={<Checkout/>} />
        </Routes>
      </Router>    
    </div>
  );
}

export default App;