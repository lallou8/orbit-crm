import { useState } from 'react';
import API from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (res.data.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/client';
      }
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo / En-tête */}
        <div style={styles.header}>
          <div style={styles.logo}>ORBIT</div>
          <h2 style={styles.title}>Connexion à votre espace</h2>
          <p style={styles.subtitle}>
            Accédez à votre tableau de bord client ou administrateur
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div style={styles.errorContainer}>
            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email professionnel</label>
            <input
              type="email"
              placeholder="prenom.nom@entreprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Se connecter
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            © 2026 ORBIT Engineering Solutions. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}

// Styles professionnels
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 8px 24px -6px rgba(0, 0, 0, 0.05)'
  },
  header: {
    marginBottom: '32px'
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '16px',
    letterSpacing: '-0.5px'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#0f172a',
    margin: 0,
    marginBottom: '8px',
    lineHeight: 1.3
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#475569',
    margin: 0,
    lineHeight: 1.5
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '24px'
  },
  errorText: {
    color: '#b91c1c',
    fontSize: '0.9rem',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#334155',
    letterSpacing: '0.2px'
  },
  input: {
    padding: '14px 16px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.2s',
    outline: 'none',
    backgroundColor: '#ffffff',
    ':focus': {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)'
    },
    '::placeholder': {
      color: '#94a3b8',
      fontSize: '0.95rem'
    }
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '16px 24px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '8px',
    letterSpacing: '0.3px',
    ':hover': {
      backgroundColor: '#1d4ed8',
      transform: 'translateY(-1px)',
      boxShadow: '0 8px 20px -8px rgba(37, 99, 235, 0.5)'
    },
    ':active': {
      transform: 'translateY(0)'
    }
  },
  footer: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0',
    textAlign: 'center'
  },
  footerText: {
    fontSize: '0.8rem',
    color: '#64748b'
  }
};

export default Login;