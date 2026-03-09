import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function TicketForm() {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    priorite: 'moyenne'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/tickets', formData);
      navigate('/client');
    } catch (err) {
      setError('Erreur lors de la création du ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Créer un nouveau ticket</h2>
        <p style={styles.subtitle}>
          Décrivez votre problème, nous interviendrons rapidement.
        </p>
      </div>

      {error && (
        <div style={styles.errorContainer}>
          <span style={styles.errorIcon}>⚠️</span>
          <span style={styles.errorText}>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Titre <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            placeholder="Ex: Problème de connexion"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Description <span style={styles.required}>*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez le problème en détail..."
            required
            rows="5"
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Priorité</label>
          <select
            name="priorite"
            value={formData.priorite}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/client')}
            style={styles.cancelButton}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Création en cours...' : 'Créer le ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center'
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#64748b'
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    borderRadius: '10px',
    padding: '14px 16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  errorIcon: {
    fontSize: '1.2rem'
  },
  errorText: {
    color: '#b91c1c',
    fontSize: '0.9rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#334155'
  },
  required: {
    color: '#ef4444'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'all 0.2s',
    outline: 'none',
    ':focus': {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37,99,235,0.1)'
    }
  },
  textarea: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'all 0.2s',
    outline: 'none',
    ':focus': {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37,99,235,0.1)'
    }
  },
  select: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem',
    backgroundColor: '#fff',
    cursor: 'pointer',
    outline: 'none'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '16px'
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#e2e8f0'
    }
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#1d4ed8'
    }
  }
};

export default TicketForm;