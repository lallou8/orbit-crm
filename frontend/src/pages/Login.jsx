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
        {/* Logo ou titre */}
        <div style={styles.header}>
          <h1 style={styles.title}>ORBIT CRM</h1>
          <p style={styles.subtitle}>Gestion client centralisée</p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠️</span>
            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="exemple@orbit.com"
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
            &copy; 2026 ORBIT Engineering Solutions
          </p>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    animation: 'slideUp 0.5s ease'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginTop: '5px'
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  errorIcon: {
    fontSize: '1.2rem'
  },
  errorText: {
    color: '#dc2626',
    fontSize: '0.9rem',
    flex: 1
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#1e293b'
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'all 0.2s',
    outline: 'none',
    ':focus': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102,126,234,0.1)'
    }
  },
  button: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '10px',
    ':hover': {
      backgroundColor: '#5a67d8',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(102,126,234,0.4)'
    },
    ':active': {
      transform: 'translateY(0)'
    }
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '20px'
  },
  footerText: {
    fontSize: '0.8rem',
    color: '#94a3b8'
  }
};

// Animation keyframes (à ajouter dans ton index.css)
// @keyframes slideUp {
//   from {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

export default Login;