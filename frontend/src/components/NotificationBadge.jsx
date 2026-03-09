import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get('/messages/unread');
      const previousCount = unreadCount;
      const newCount = res.data.count;

      setUnreadCount(newCount);

      if (newCount > previousCount) {
        toast.info(`📬 Vous avez ${newCount} message${newCount > 1 ? 's' : ''} non lu${newCount > 1 ? 's' : ''}`, {
          position: "top-right",
          autoClose: 5000,
          onClick: () => {
            const role = JSON.parse(localStorage.getItem('user') || '{}').role;
            if (role === 'admin') {
              window.location.href = '/admin#messagerie';
            } else {
              window.location.href = '/client#messagerie';
            }
          }
        });
      }
    } catch (err) {
      console.error('Erreur chargement notifications', err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    const role = JSON.parse(localStorage.getItem('user') || '{}').role;
    if (role === 'admin') {
      navigate('/admin#messagerie');
    } else {
      navigate('/client#messagerie');
    }
  };

  if (unreadCount === 0) return null;

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer'
      }}
    >
      <span style={styles.badge}>{unreadCount}</span>
    </div>
  );
}

// Styles définis APRÈS la fonction
const styles = {
  badge: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    backgroundColor: '#ef4444',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px',
    minWidth: '18px',
    textAlign: 'center'
  }
};

export default NotificationBadge;