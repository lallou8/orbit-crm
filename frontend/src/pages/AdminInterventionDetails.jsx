import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

function AdminInterventionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intervention, setIntervention] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntervention = async () => {
      try {
        const res = await API.get(`/interventions/${id}`);
        setIntervention(res.data);
      } catch (err) {
        alert('Erreur chargement');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchIntervention();
  }, [id, navigate]);

  if (loading) return <p>Chargement...</p>;
  if (!intervention) return <p>Intervention introuvable</p>;

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <button onClick={() => navigate('/admin')} style={styles.backButton}>← Retour</button>
        <h2>Détails de l'intervention</h2>
      </div>

      <div style={styles.card}>
        <h3>Informations techniques</h3>
        <p><strong>Technicien :</strong> {intervention.technicien}</p>
        <p><strong>Date prévue :</strong> {new Date(intervention.datePrevue).toLocaleDateString('fr-FR')}</p>
        <p><strong>Statut :</strong> {intervention.statut}</p>
      </div>

      <div style={styles.card}>
        <h3>Informations client (saisies par le client)</h3>
        <p><strong>Nom :</strong> {intervention.clientNom || 'Non renseigné'}</p>
        <p><strong>Signature :</strong> {intervention.clientSignature || 'Non renseignée'}</p>
        <p><strong>Commentaires :</strong> {intervention.clientCommentaires || 'Aucun commentaire'}</p>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px' },
  navbar: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' },
  backButton: { padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
};

export default AdminInterventionDetails;