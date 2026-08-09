import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Journal from './pages/Journal';
import Mistakes from './pages/Mistakes';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Strategies from './pages/Strategies';
import Notes from './pages/Notes';
import AddTrade from './pages/AddTrade';
import TradeDetails from './pages/TradeDetails';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Gallery from './pages/Gallery';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="journal" element={<Journal />} />
          <Route path="mistakes" element={<Mistakes />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="strategies" element={<Strategies />} />
          <Route path="notes" element={<Notes />} />
          <Route path="settings" element={<Settings />} />
          <Route path="add-trade" element={<AddTrade />} />
          <Route path="trade/:id" element={<TradeDetails />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
