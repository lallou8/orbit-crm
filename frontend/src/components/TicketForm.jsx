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
    <div style={styles.pageContainer}>
      {/* En-tête bleu ORBIT */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>ORBIT CRM</h1>
          <p style={styles.headerSubtitle}>Création d'un ticket d'assistance</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={styles.contentContainer}>
        <div style={styles.formCard}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Nouveau ticket</h2>
            <p style={styles.cardSubtitle}>
              Remplissez le formulaire ci-dessous pour nous signaler votre problème.
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
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    padding: '40px 0',
    marginBottom: '40px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  headerContent: {
    maxWidth: '700px',
    margin: '0 auto',
    textAlign: 'center',
    color: '#fff'
  },
  headerTitle: {
    fontSize: '2.2rem',
    fontWeight: 700,
    marginBottom: '8px',
    letterSpacing: '-0.5px'
  },
  headerSubtitle: {
    fontSize: '1rem',
    opacity: 0.9
  },
  contentContainer: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '0 20px'
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 40px -12px rgba(0,0,0,0.2)',
    marginBottom: '40px'
  },
  cardHeader: {
    marginBottom: '32px',
    textAlign: 'center'
  },
  cardTitle: {
    fontSize: '1.8rem',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '8px'
  },
  cardSubtitle: {
    fontSize: '0.95rem',
    color: '#64748b'
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    borderRadius: '12px',
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
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.2s',
    outline: 'none',
    ':focus': {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 4px rgba(37,99,235,0.1)'
    }
  },
  textarea: {
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'all 0.2s',
    outline: 'none',
    ':focus': {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 4px rgba(37,99,235,0.1)'
    }
  },
  select: {
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    backgroundColor: '#fff',
    cursor: 'pointer',
    outline: 'none'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    marginTop: '16px'
  },
  cancelButton: {
    padding: '14px 28px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#e2e8f0'
    }
  },
  submitButton: {
    padding: '14px 28px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#1d4ed8',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px -8px #2563eb'
    }
  }
};

export default TicketForm;