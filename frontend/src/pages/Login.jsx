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
      {/* Partie gauche - Branding ORBIT */}
      <div style={styles.leftPanel}>
        <div style={styles.brandContent}>
          <div style={styles.logo}>ORBIT</div>
          <h1 style={styles.brandTitle}>Smart Monitoring</h1>
          <p style={styles.brandSubtitle}>
            Plateforme de gestion client centralisée<br />
            pour un suivi en temps réel de vos équipements
          </p>
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>✓</span>
              <span>Suivi des interventions</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>✓</span>
              <span>Gestion des tickets SAV</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>✓</span>
              <span>Tableaux de bord en temps réel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Partie droite - Formulaire de connexion */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Connexion</h2>
          <p style={styles.formSubtitle}>
            Accédez à votre espace client ou administrateur
          </p>

          {error && (
            <div style={styles.errorContainer}>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
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

          <p style={styles.footerText}>
            © 2026 ORBIT Engineering Solutions
          </p>
        </div>
      </div>
    </div>
  );
}

// Styles split screen professionnels
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(145deg, #0a2c4e 0%, #1a4b7a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    color: 'white'
  },
  brandContent: {
    maxWidth: '440px'
  },
  logo: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '24px',
    letterSpacing: '-0.5px'
  },
  brandTitle: {
    fontSize: '2.2rem',
    fontWeight: 600,
    marginBottom: '16px',
    lineHeight: 1.2
  },
  brandSubtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    marginBottom: '40px',
    lineHeight: 1.6
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '1rem',
    opacity: 0.95
  },
  featureIcon: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#60a5fa'
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: '48px'
  },
  formContainer: {
    maxWidth: '400px',
    width: '100%'
  },
  formTitle: {
    fontSize: '1.8rem',
    fontWeight: 600,
    color: '#0a2c4e',
    marginBottom: '8px'
  },
  formSubtitle: {
    fontSize: '0.95rem',
    color: '#475569',
    marginBottom: '32px'
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    borderRadius: '8px',
    padding: '12px',
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
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#334155'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s',
    outline: 'none',
    ':focus': {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
    }
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '12px',
    ':hover': {
      backgroundColor: '#1d4ed8'
    }
  },
  footerText: {
    marginTop: '32px',
    fontSize: '0.8rem',
    color: '#64748b',
    textAlign: 'center'
  }
};

export default Login;