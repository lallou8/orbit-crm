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
        <h1 style={styles.title}>ORBIT CRM</h1>
        <p style={styles.subtitle}>Gestion client centralisée</p>

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

        <div style={styles.footer}>
          <p style={styles.footerText}>
            © 2026 ORBIT Engineering Solutions
          </p>
        </div>
      </div>
    </div>
  );
}

// Styles simples et fiables
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#666',
    textAlign: 'center',
    marginBottom: '24px'
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  errorText: {
    color: '#dc2626',
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
    color: '#444'
  },
  input: {
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    ':focus': {
      borderColor: '#667eea'
    }
  },
  button: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#5a67d8'
    }
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center'
  },
  footerText: {
    fontSize: '0.8rem',
    color: '#999'
  }
};

export default Login;