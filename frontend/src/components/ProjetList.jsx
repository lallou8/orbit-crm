import { useEffect, useState } from 'react';
import API from '../services/api';

function ProjetList() {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjets();
  }, []);

  const fetchProjets = async () => {
    try {
      const res = await API.get('/projets');
      setProjets(res.data);
    } catch (err) {
      setError('Erreur chargement projets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce projet ?')) return;
    try {
      await API.delete(`/projets/${id}`);
      fetchProjets();
    } catch (err) {
      alert('Erreur suppression');
    }
  };

  const getStatutStyle = (statut) => {
    switch (statut) {
      case 'en cours': return { color: '#3b82f6', fontWeight: 'bold' };
      case 'terminé': return { color: 'green', fontWeight: 'bold' };
      case 'suspendu': return { color: 'orange', fontWeight: 'bold' };
      default: return {};
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h3>Liste des projets</h3>
      {projets.length === 0 ? (
        <p>Aucun projet trouvé.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Nom projet</th>
              <th>Description</th>
              <th>Début</th>
              <th>Fin prévue</th>
              <th>Statut</th>
              <th>Tickets liés</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projets.map((projet) => (
              <tr key={projet._id}>
                <td>{projet.clientId?.nomSociete || 'N/A'}</td>
                <td>{projet.nom}</td>
                <td>{projet.description || '-'}</td>
                <td>{new Date(projet.dateDebut).toLocaleDateString('fr-FR')}</td>
                <td>{projet.dateFinPrevue ? new Date(projet.dateFinPrevue).toLocaleDateString('fr-FR') : '-'}</td>
                <td style={getStatutStyle(projet.statut)}>{projet.statut}</td>
                <td>{projet.tickets?.length || 0}</td>
                <td>
                  <button
                    onClick={() => alert('Modification à venir')}
                    style={{
                      padding: '5px 10px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(projet._id)}
                    style={{
                      padding: '5px 10px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Supprimer
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

export default ProjetList;