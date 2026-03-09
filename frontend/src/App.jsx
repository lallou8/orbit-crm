import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // 👈 AJOUTE
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import FicheInterventionClient from './pages/FicheInterventionClient';
import AdminInterventionDetails from './pages/AdminInterventionDetails';
import NouveauTicket from './pages/NouveauTicket';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={token && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/intervention/:id" element={token && user.role === 'admin' ? <AdminInterventionDetails /> : <Navigate to="/login" />} />
        
        <Route path="/client" element={token && user.role === 'client' ? <ClientDashboard /> : <Navigate to="/login" />} />
        <Route path="/client/fiche/:id" element={token && user.role === 'client' ? <FicheInterventionClient /> : <Navigate to="/login" />} />
        
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/client/nouveau-ticket" element={token && user.role === 'client' ? <NouveauTicket /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;