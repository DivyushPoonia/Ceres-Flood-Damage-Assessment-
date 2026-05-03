import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddFarm from "./pages/AddFarm.jsx";
import FarmDetails from "./pages/FarmDetails.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddFarm />} />
        <Route path="/farm/:id" element={<FarmDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
