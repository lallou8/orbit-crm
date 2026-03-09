import { useEffect, useState } from 'react';
import API from '../services/api';

function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await API.get('/clients');
      setClients(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce client ?')) return;
    try {
      await API.delete(`/clients/${id}`);
      fetchClients();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Liste des clients</h3>
        <span style={styles.count}>{clients.length} client(s)</span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Société</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Téléphone</th>
              <th style={styles.th}>Adresse</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client._id} style={styles.tr}>
                <td style={styles.td}>
                  <span style={styles.clientName}>{client.nomSociete}</span>
                </td>
                <td style={styles.td}>{client.email}</td>
                <td style={styles.td}>{client.telephone || '-'}</td>
                <td style={styles.td}>{client.adresse || '-'}</td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button style={styles.editButton}>
                      <span style={styles.buttonIcon}>✏️</span>
                      Modifier
                    </button>
                    <button 
                      style={styles.deleteButton}
                      onClick={() => handleDelete(client._id)}
                    >
                      <span style={styles.buttonIcon}>🗑️</span>
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0
  },
  count: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 500
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b'
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    color: '#ef4444'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    fontSize: '0.85rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #e2e8f0'
  },
  tr: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f8fafc'
    }
  },
  td: {
    padding: '16px',
    color: '#334155',
    fontSize: '0.95rem'
  },
  clientName: {
    fontWeight: 500,
    color: '#1e293b'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#e2e8f0'
    }
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#fee2e2'
    }
  },
  buttonIcon: {
    fontSize: '0.9rem'
  }
};

export default ClientList;