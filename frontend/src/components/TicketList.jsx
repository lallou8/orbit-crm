import { useEffect, useState } from 'react';
import API from '../services/api';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await API.get('/tickets');
        setTickets(res.data);
      } catch (err) {
        setError('Erreur lors du chargement des tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Mes tickets</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Description</th>
            <th>Statut</th>
            <th>Priorité</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket._id}>
              <td>{ticket.titre}</td>
              <td>{ticket.description}</td>
              <td>{ticket.statut}</td>
              <td>{ticket.priorite}</td>
              <td>{new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketList;