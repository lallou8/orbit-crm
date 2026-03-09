import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function AdminInterventionList() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const res = await API.get('/interventions');
        setInterventions(res.data);
      } catch (err) {
        console.error('Erreur chargement interventions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterventions();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Liste des interventions</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Technicien</th>
            <th>Date prévue</th>
            <th>Statut</th>
            <th>Client</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {interventions.map((interv) => (
            <tr key={interv._id}>
              <td>{interv.ticketId?.titre || 'N/A'}</td>
              <td>{interv.technicien}</td>
              <td>{new Date(interv.datePrevue).toLocaleDateString('fr-FR')}</td>
              <td>{interv.statut}</td>
              <td>{interv.ticketId?.clientId?.nomSociete || 'N/A'}</td>
              <td>
                <button
                  onClick={() => navigate(`/admin/intervention/${interv._id}`)}
                  style={{
                    padding: '5px 10px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Voir détail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminInterventionList;