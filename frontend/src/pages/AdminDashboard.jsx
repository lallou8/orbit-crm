import { useState } from 'react';
import API from '../services/api';

function ClientForm({ onClientAdded }) {
  const [form, setForm] = useState({
    nomSociete: '',
    email: '',
    telephone: '',
    adresse: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/clients', form);
      alert('Client ajouté avec succès');
      setForm({ nomSociete: '', email: '', telephone: '', adresse: '' });
      if (onClientAdded) onClientAdded();
    } catch (err) {
      alert('Erreur lors de l\'ajout');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>➕ Nouveau client</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Société *</label>
            <input
              type="text"
              name="nomSociete"
              value={form.nomSociete}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Téléphone</label>
            <input
              type="text"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Adresse</label>
            <input
              type="text"
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>
        <button type="submit" style={styles.button}>
          Ajouter le client
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#64748b'
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    outline: 'none',
    ':focus': {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37,99,235,0.1)'
    }
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    alignSelf: 'flex-start',
    ':hover': {
      backgroundColor: '#1d4ed8'
    }
  }
};

export default ClientForm;