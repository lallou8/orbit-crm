import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientList from '../components/ClientList';
import ClientForm from '../components/ClientForm';
import AdminInterventionList from '../components/AdminInterventionList';
import API from '../services/api';
import AdminFactureList from '../components/AdminFactureList';
import ProjetList from '../components/ProjetList';
import ProjetForm from '../components/ProjetForm';
import StatsDashboard from '../components/StatsDashboard';
import Messagerie from '../components/Messagerie';
import NotificationBadge from '../components/NotificationBadge';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [refreshClients, setRefreshClients] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    setAdminInfo({
      email: user.email,
      role: 'Administrateur'
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleClientAdded = () => {
    setRefreshClients(!refreshClients);
  };

  const sections = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'interventions', label: 'Interventions', icon: '🔧' },
    { id: 'factures', label: 'Factures', icon: '💰' },
    { id: 'projets', label: 'Projets', icon: '📋' },
    { id: 'messagerie', label: 'Messagerie', icon: '📬' }
  ];

  const renderSection = () => {
    switch(activeSection) {
      case 'dashboard':
        return <StatsDashboard />;
      case 'clients':
        return (
          <>
            <ClientForm onClientAdded={handleClientAdded} />
            <ClientList key={refreshClients} />
          </>
        );
      case 'interventions':
        return <AdminInterventionList />;
      case 'factures':
        return <AdminFactureList />;
      case 'projets':
        return (
          <>
            <ProjetForm onProjetAdded={() => window.location.reload()} />
            <ProjetList />
          </>
        );
      case 'messagerie':
        return <Messagerie />;
      default:
        return <StatsDashboard />;
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>ORBIT</div>
          <div style={styles.logoBadge}>Admin</div>
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
          <div style={styles.adminCard}>
            <div style={styles.adminAvatar}>
              {adminInfo?.email?.charAt(0).toUpperCase()}
            </div>
            <div style={styles.adminInfo}>
              <div style={styles.adminEmail}>{adminInfo?.email}</div>
              <div style={styles.adminRole}>{adminInfo?.role}</div>
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

// Styles professionnels
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
  adminCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  adminAvatar: {
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
  adminInfo: {
    flex: 1
  },
  adminEmail: {
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 500,
    marginBottom: '4px'
  },
  adminRole: {
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
  notificationWrapper: {
    position: 'relative'
  },
  content: {
    maxWidth: '1400px'
  }
};

export default AdminDashboard;