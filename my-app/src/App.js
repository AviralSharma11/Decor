import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Home';
import Collections from "./Collections";
import Login from "./Components/Login";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections/>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>    
    </div>
  );
}

export default App;