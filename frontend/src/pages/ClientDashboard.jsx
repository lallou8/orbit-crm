import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TicketList from '../components/TicketList';
import InterventionList from '../components/InterventionList';
import LicenceList from '../components/LicenceList';
import FactureList from '../components/FactureList';
import Messagerie from '../components/Messagerie';
import NotificationBadge from '../components/NotificationBadge';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../services/api';

function ClientDashboard() {
  const navigate = useNavigate();
  const [clientInfo, setClientInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'client') {
      navigate('/login');
      return;
    }

    const fetchClientInfo = async () => {
      try {
        const res = await API.get(`/clients/${user.clientId}`);
        setClientInfo(res.data);
      } catch (err) {
        console.error('Erreur chargement client', err);
      }
    };

    fetchClientInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Barre du haut */}
      <div style={styles.navbar}>
        <div style={styles.navbarLeft}>
          <h1 style={styles.title}>ORBIT CRM</h1>
          {clientInfo && (
            <span style={styles.welcomeMessage}>
              Bonjour, <strong>{clientInfo.nomSociete}</strong>
            </span>
          )}
        </div>
        <div style={styles.navbarRight}>
          <Link to="/client/nouveau-ticket">
            <button style={styles.primaryButton}>
              + Nouveau ticket
            </button>
          </Link>
          <div style={{ position: 'relative' }}>
            <NotificationBadge />
          </div>
          <button onClick={handleLogout} style={styles.secondaryButton}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={styles.content}>
        {/* Section Tickets */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🎫 Mes tickets</h2>
          </div>
          <TicketList />
        </div>

        {/* Section Interventions */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🔧 Interventions</h2>
          </div>
          <InterventionList />
        </div>

        {/* Section Licences */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📜 Licences</h2>
          </div>
          <LicenceList />
        </div>

        {/* Section Factures */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>💰 Factures</h2>
          </div>
          <FactureList />
        </div>

        {/* Section Messagerie */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📬 Messagerie</h2>
          </div>
          <Messagerie />
        </div>
      </div>

      {/* ToastContainer pour les notifications */}
      <ToastContainer />
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f4f7fb',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  },
  navbar: {
    backgroundColor: 'white',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px'
  },
  navbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0
  },
  welcomeMessage: {
    color: '#64748b',
    fontSize: '0.95rem'
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#2563eb'
    }
  },
  secondaryButton: {
    backgroundColor: 'white',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#f8fafc',
      borderColor: '#cbd5e1'
    }
  },
  content: {
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  sectionHeader: {
    marginBottom: '20px',
    borderBottom: '2px solid #f1f5f9',
    paddingBottom: '12px'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0
  }
};

export default ClientDashboard;