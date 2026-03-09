import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [activeSection, setActiveSection] = useState('tickets');

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

  const sections = [
    { id: 'tickets', label: 'Mes tickets', icon: '🎫' },
    { id: 'interventions', label: 'Interventions', icon: '🔧' },
    { id: 'licences', label: 'Licences', icon: '📜' },
    { id: 'factures', label: 'Factures', icon: '💰' },
    { id: 'messagerie', label: 'Messagerie', icon: '📬' }
  ];

  const renderSection = () => {
    switch(activeSection) {
      case 'tickets':
        return (
          <div style={styles.section}>
            <TicketList />
          </div>
        );
      case 'interventions':
        return (
          <div style={styles.section}>
            <InterventionList />
          </div>
        );
      case 'licences':
        return (
          <div style={styles.section}>
            <LicenceList />
          </div>
        );
      case 'factures':
        return (
          <div style={styles.section}>
            <FactureList />
          </div>
        );
      case 'messagerie':
        return (
          <div style={styles.section}>
            <Messagerie />
          </div>
        );
      default:
        return (
          <div style={styles.section}>
            <TicketList />
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>ORBIT</div>
          <div style={styles.logoBadge}>Client</div>
        </div>

        <nav style={styles.nav}>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                ...styles.navItem,
                backgroundColor: activeSection === section.id ? '#2563eb' : 'transparent',
                color: activeSection === section.id ? '#fff' : '#94a3b8'
              }}
            >
              <span style={styles.navIcon}>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>
              {clientInfo?.nomSociete?.charAt(0).toUpperCase()}
            </div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{clientInfo?.nomSociete}</div>
              <div style={styles.userRole}>Client</div>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <span style={styles.logoutIcon}>🚪</span>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={styles.main}>
        {/* En-tête */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.pageTitle}>
              {sections.find(s => s.id === activeSection)?.label}
            </h1>
          </div>
          <div style={styles.headerRight}>
            {activeSection === 'tickets' && (
              <button 
                onClick={() => navigate('/client/nouveau-ticket')}
                style={styles.newButton}
              >
                + Nouveau ticket
              </button>
            )}
            <div style={styles.notificationWrapper}>
              <NotificationBadge />
            </div>
          </div>
        </header>

        {/* Contenu */}
        <div style={styles.content}>
          {renderSection()}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

// Styles professionnels (identiques à l'admin)
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#1e293b',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    boxShadow: '4px 0 20px rgba(0,0,0,0.05)'
  },
  logoContainer: {
    padding: '32px 24px',
    borderBottom: '1px solid #334155'
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '4px',
    letterSpacing: '-0.5px'
  },
  logoBadge: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  nav: {
    flex: 1,
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
    textAlign: 'left'
  },
  navIcon: {
    fontSize: '1.2rem'
  },
  sidebarFooter: {
    padding: '24px 16px',
    borderTop: '1px solid #334155'
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#2563eb',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: 600
  },
  userInfo: {
    flex: 1
  },
  userName: {
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 500,
    marginBottom: '4px'
  },
  userRole: {
    color: '#94a3b8',
    fontSize: '0.8rem'
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#334155',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
    ':hover': {
      backgroundColor: '#475569'
    }
  },
  logoutIcon: {
    fontSize: '1rem'
  },
  main: {
    flex: 1,
    marginLeft: '280px',
    padding: '32px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  headerLeft: {
    flex: 1
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: 600,
    color: '#0f172a',
    margin: 0
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  newButton: {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#1d4ed8'
    }
  },
  notificationWrapper: {
    position: 'relative'
  },
  content: {
    maxWidth: '1400px'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  }
};

export default ClientDashboard;