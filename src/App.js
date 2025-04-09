import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/home/home';
import Consultation from './pages/consultation/consultation';
import Home2 from './pages/home/home2';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home2" element={<Home2 />} />
        <Route path="/consultation" element={<Consultation />} />
      </Routes>
    </Router>
  );
}

export default App;
