import { useState, useEffect } from 'react';
import API from '../services/api';

function Messagerie() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
    fetchUsers();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await API.get('/messages');
      console.log('Messages reçus:', res.data);
      setMessages(res.data);
    } catch (err) {
      console.error('Erreur chargement messages', err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get('/messages/unread');
      console.log('Messages non lus:', res.data.count);
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error('Erreur chargement non lus', err);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('🔄 Chargement des utilisateurs...');
      
      const clientsRes = await API.get('/clients');
      console.log('✅ Clients reçus:', clientsRes.data);

      const clients = clientsRes.data.map(c => ({
        _id: c._id,
        nom: c.nomSociete,
        role: 'client'
      }));

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('👤 Utilisateur connecté:', user);

      const admin = {
        _id: user.id,
        nom: 'Support ORBIT (Admin)',
        role: 'admin'
      };

      const allUsers = [admin, ...clients];
      console.log('📋 Tous les utilisateurs:', allUsers);

      setUsers(allUsers);
      setLoading(false);
    } catch (err) {
      console.error('❌ Erreur chargement utilisateurs', err);
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !receiverId) {
      alert('Veuillez choisir un destinataire et écrire un message');
      return;
    }

    try {
      console.log('📤 Envoi message à:', receiverId, 'Contenu:', newMessage);
      await API.post('/messages', {
        receiverId,
        content: newMessage,
        relatedTo: 'general'
      });
      setNewMessage('');
      fetchMessages();
      fetchUnreadCount();
    } catch (err) {
      console.error('❌ Erreur envoi message', err);
      alert('Erreur envoi message');
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/messages/${id}/read`);
      fetchMessages();
      fetchUnreadCount();
    } catch (err) {
      console.error('Erreur marquage lu', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/messages/read-all');
      fetchMessages();
      fetchUnreadCount();
    } catch (err) {
      console.error('Erreur marquage tous lus', err);
    }
  };

  if (loading) return <p>Chargement de la messagerie...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📬 Messagerie</h2>
        {unreadCount > 0 && (
          <div style={styles.badge}>
            {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
            <button onClick={markAllAsRead} style={styles.markAllButton}>
              Tout marquer comme lu
            </button>
          </div>
        )}
      </div>

      {/* Formulaire d'envoi */}
      <form onSubmit={handleSend} style={styles.form}>
        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          style={styles.select}
          required
        >
          <option value="">Choisir un destinataire</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.nom} ({user.role === 'admin' ? 'Admin' : 'Client'})
            </option>
          ))}
        </select>

        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Votre message..."
          style={styles.textarea}
          required
        />

        <button type="submit" style={styles.sendButton}>
          Envoyer
        </button>
      </form>

      {/* Liste des messages */}
      <div style={styles.messageList}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
            Aucun message pour le moment
          </p>
        ) : (
          messages.map(message => (
            <div
              key={message._id}
              style={{
                ...styles.messageCard,
                backgroundColor: message.read ? '#f8fafc' : '#fff3e0'
              }}
              onClick={() => !message.read && markAsRead(message._id)}
            >
              <div style={styles.messageHeader}>
                <strong>
                  {message.senderId?.email || 'Inconnu'}
                </strong>
                <span style={styles.messageDate}>
                  {new Date(message.createdAt).toLocaleString('fr-FR')}
                </span>
              </div>
              <p style={styles.messageContent}>{message.content}</p>
              {!message.read && (
                <span style={styles.unreadTag}>Non lu</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '16px',
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
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '0.9rem'
  },
  markAllButton: {
    backgroundColor: 'white',
    color: '#ef4444',
    border: 'none',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  form: {
    marginBottom: '20px'
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    minHeight: '80px',
    resize: 'vertical',
    fontSize: '14px'
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%'
  },
  messageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px'
  },
  messageCard: {
    padding: '15px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    border: '1px solid #e2e8f0'
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px'
  },
  messageDate: {
    color: '#64748b',
    fontSize: '0.85rem'
  },
  messageContent: {
    margin: '5px 0',
    color: '#1e293b'
  },
  unreadTag: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem'
  }
};

export default Messagerie;