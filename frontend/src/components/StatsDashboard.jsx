import { useEffect, useState } from 'react';
import API from '../services/api';

function StatsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/stats');
        setStats(res.data);
      } catch (err) {
        setError('Erreur chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Chargement des statistiques...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Tableau de bord</h2>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Clients</span>
            <span style={styles.statValue}>{stats.clients.total}</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🎫</div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Tickets</span>
            <span style={styles.statValue}>{stats.tickets.total}</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔧</div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Interventions</span>
            <span style={styles.statValue}>{stats.interventions.total}</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📜</div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Licences</span>
            <span style={styles.statValue}>{stats.licences.total}</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Chiffre d'affaires</span>
            <span style={styles.statValue}>{formatMontant(stats.factures.caTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '24px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  statCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  statIcon: {
    fontSize: '2rem',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  statLabel: {
    color: '#64748b',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1e293b'
  }
};

export default StatsDashboard;