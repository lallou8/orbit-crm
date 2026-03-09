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
      setClients(clients.filter(c => c._id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Liste des clients</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Société</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client._id}>
              <td>{client.nomSociete}</td>
              <td>{client.email}</td>
              <td>{client.telephone}</td>
              <td>{client.adresse}</td>
              <td>
                <button>Modifier</button>
                <button onClick={() => handleDelete(client._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientList;