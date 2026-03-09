import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ajouté
import API from '../services/api';

function InterventionList() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Ajouté

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const res = await API.get('/interventions');
        setInterventions(res.data);
      } catch (err) {
        setError('Erreur lors du chargement des interventions');
      } finally {
        setLoading(false);
      }
    };

    fetchInterventions();
  }, []);

  const voirFiche = (id) => {
    navigate(`/client/fiche/${id}`);
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Historique des interventions</h2>
      {interventions.length === 0 ? (
        <p>Aucune intervention pour le moment.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Technicien</th>
              <th>Date prévue</th>
              <th>Statut</th>
              <th>Fiche</th> {/* Nouvelle colonne */}
            </tr>
          </thead>
          <tbody>
            {interventions.map((interv) => (
              <tr key={interv._id}>
                <td>{interv.ticketId?.titre || 'N/A'}</td>
                <td>{interv.technicien}</td>
                <td>{new Date(interv.datePrevue).toLocaleDateString('fr-FR')}</td>
                <td>{interv.statut}</td>
                <td>
                  <button
                    onClick={() => voirFiche(interv._id)}
                    style={{
                      padding: '5px 10px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Voir la fiche
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InterventionList;