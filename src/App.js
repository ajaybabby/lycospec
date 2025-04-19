import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/home/home';
import Consultation from './pages/consultation/consultation';
import Home2 from './pages/home/home2';
import Doctors from './pages/doctors/doctors';
import DoctorLogin from './pages/doctorlogin/doctorlogin';
import DoctorDashboard from './pages/doctorlogin/doctordashboard/doctordashboard';
import VideoConsultations from './pages/doctorlogin/videoconsultations/videoconsultations';
import HospitalMap from './components/HospitalMap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookingPage from './pages/booking/BookingPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import ProfilePage from './pages/profile/ProfilePage';
import DoctorVideoCall from './pages/doctorlogin/doctordashboard/DoctorVideoCall';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home2" element={<Home2 />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctorlogin" element={<DoctorLogin />} />
        <Route path="/doctordashboard" element={<DoctorDashboard />} />
        <Route path="/video-consult" element={<VideoConsultations />} />
        <Route path="/hospitalmap" element={<HospitalMap />} />
        <Route path="/book-appointment" element={<BookingPage />} />
        // In your routes configuration
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/doctor/video-call/:requestId" element={<DoctorVideoCall />} />
      </Routes>
    </Router>
  );
}

export default App;
