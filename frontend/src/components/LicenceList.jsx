import { useEffect, useState } from 'react';
import API from '../services/api';

function LicenceList() {
  const [licences, setLicences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLicences = async () => {
      try {
        const res = await API.get('/licences');
        setLicences(res.data);
      } catch (err) {
        setError('Erreur lors du chargement des licences');
      } finally {
        setLoading(false);
      }
    };

    fetchLicences();
  }, []);

  const getStatutStyle = (statut) => {
    switch (statut) {
      case 'active': return { color: 'green', fontWeight: 'bold' };
      case 'expirée': return { color: 'red', fontWeight: 'bold' };
      case 'suspendue': return { color: 'orange', fontWeight: 'bold' };
      default: return {};
    }
  };

  if (loading) return <p>Chargement des licences...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Mes licences</h2>
      {licences.length === 0 ? (
        <p>Aucune licence trouvée.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {licences.map((licence) => (
              <tr key={licence._id}>
                <td>{licence.nomProduit}</td>
                <td>{licence.quantite}</td>
                <td>{new Date(licence.dateDebut).toLocaleDateString('fr-FR')}</td>
                <td>{new Date(licence.dateFin).toLocaleDateString('fr-FR')}</td>
                <td style={getStatutStyle(licence.statut)}>{licence.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LicenceList;