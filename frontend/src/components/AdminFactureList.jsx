import { useEffect, useState } from 'react';
import API from '../services/api';

function AdminFactureList() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const res = await API.get('/factures');
        setFactures(res.data);
      } catch (err) {
        setError('Erreur lors du chargement des factures');
      } finally {
        setLoading(false);
      }
    };

    fetchFactures();
  }, []);

  const getStatutStyle = (statut) => {
    switch (statut) {
      case 'payée': return { color: 'green', fontWeight: 'bold' };
      case 'impayée': return { color: 'red', fontWeight: 'bold' };
      case 'en attente': return { color: 'orange', fontWeight: 'bold' };
      default: return {};
    }
  };

  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant);
  };

  if (loading) return <p>Chargement des factures...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Gestion des factures</h2>
      {factures.length === 0 ? (
        <p>Aucune facture trouvée.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Client</th>
              <th>N° Facture</th>
              <th>Date émission</th>
              <th>Date échéance</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {factures.map((facture) => (
              <tr key={facture._id}>
                <td>{facture.clientId?.nomSociete || 'N/A'}</td>
                <td>{facture.numeroFacture}</td>
                <td>{new Date(facture.dateEmission).toLocaleDateString('fr-FR')}</td>
                <td>{new Date(facture.dateEcheance).toLocaleDateString('fr-FR')}</td>
                <td>{formatMontant(facture.montant)}</td>
                <td style={getStatutStyle(facture.statut)}>{facture.statut}</td>
                <td>{facture.description || '-'}</td>
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
                    onClick={() => alert('Suppression à venir')}
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

export default AdminFactureList;