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
import Messagerie from '../components/Messagerie'; // ✅ AJOUTÉ

function AdminDashboard() {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [refreshClients, setRefreshClients] = useState(false);

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

  return (
    <div style={styles.container}>
      {/* Barre du haut */}
      <div style={styles.navbar}>
        <div style={styles.navbarLeft}>
          <h1 style={styles.title}>ORBIT CRM</h1>
          {adminInfo && (
            <span style={styles.welcomeMessage}>
              Admin : <strong>{adminInfo.email}</strong>
            </span>
          )}
        </div>
        <div style={styles.navbarRight}>
          <button onClick={handleLogout} style={styles.secondaryButton}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={styles.content}>
        {/* Tableau de bord */}
        <StatsDashboard />

        {/* Section Clients */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>👥 Gestion des clients</h2>
          </div>
          <ClientForm onClientAdded={handleClientAdded} />
          <ClientList key={refreshClients} />
        </div>

        {/* Section Interventions */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🔧 Interventions</h2>
          </div>
          <AdminInterventionList />
        </div>

        {/* Section Factures */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>💰 Factures</h2>
          </div>
          <AdminFactureList />
        </div>

        {/* Section Projets */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📋 Projets</h2>
          </div>
          <ProjetForm onProjetAdded={() => window.location.reload()} />
          <ProjetList />
        </div>

        {/* ✅ Section Messagerie */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📬 Messagerie</h2>
          </div>
          <Messagerie />
        </div>
      </div>
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

export default AdminDashboard;