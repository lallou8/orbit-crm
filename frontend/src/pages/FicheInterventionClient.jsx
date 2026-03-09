import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

function FicheInterventionClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Page 1
    clientNom: '',
    site: '',
    adresse: '',
    dateIntervention: '',
    heureDebut: '',
    intervenant: '',
    fonction: '',
    reference: '',
    
    // Objet intervention (checkboxes)
    objetPreventive: false,
    objetCorrective: false,
    objetInstallation: false,
    objetReseau: false,
    objetOptimisation: false,
    objetAlerteClient: false,
    objetAlerteSysteme: false,
    objetControle: false,
    
    // Page 2
    equipements: [],
    defaillances: '',
    actionsVerification: false,
    actionsControle: false,
    actionsCorrection: false,
    actionsMiseAJour: false,
    actionsTest: false,
    actionsAutres: '',
    recommandations: '',
    
    // Page 3
    nomOrbit: '',
    nomClient: '',
    signatureOrbit: '',
    signatureClient: '',
    dateSignature: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const intervRes = await API.get(`/interventions/${id}`);
        const intervention = intervRes.data;

        let ticket = null;
        let client = null;
        if (intervention.ticketId) {
          const ticketRes = await API.get(`/tickets/${intervention.ticketId._id || intervention.ticketId}`);
          ticket = ticketRes.data;
          if (ticket.clientId) {
            const clientRes = await API.get(`/clients/${ticket.clientId._id || ticket.clientId}`);
            client = clientRes.data;
          }
        }

        setFormData({
          // Page 1
          clientNom: client?.nomSociete || '',
          site: client?.adresse || '',
          adresse: client?.adresse || '',
          dateIntervention: new Date(intervention.datePrevue).toISOString().split('T')[0],
          heureDebut: new Date(intervention.datePrevue).toTimeString().slice(0,5),
          intervenant: intervention.technicien || '',
          fonction: 'Technicien SAV',
          reference: `INT-${intervention._id?.slice(-6) || 'N/A'}`,
          
          // Objet (pré-rempli selon ticket)
          objetPreventive: false,
          objetCorrective: true,
          objetInstallation: false,
          objetReseau: ticket?.description?.includes('réseau') || false,
          objetOptimisation: false,
          objetAlerteClient: false,
          objetAlerteSysteme: false,
          objetControle: false,
          
          // Page 2
          equipements: [
            { equipement: 'Analyseur', reference: 'AN-001', etat: 'OK' },
            { equipement: 'Gateway', reference: 'GW-123', etat: 'À vérifier' }
          ],
          defaillances: ticket?.description || '',
          actionsVerification: true,
          actionsControle: true,
          actionsCorrection: false,
          actionsMiseAJour: true,
          actionsTest: false,
          actionsAutres: intervention.actionsRealisees || '',
          recommandations: 'Prévoir un remplacement de la gateway dans les 3 mois',
          
          // Page 3
          nomOrbit: intervention.technicien || '',
          nomClient: client?.nomSociete || '',
          signatureOrbit: '',
          signatureClient: '',
          dateSignature: new Date().toISOString().split('T')[0]
        });
      } catch (err) {
        console.error('Erreur chargement', err);
        alert('Erreur chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEquipementChange = (index, field, value) => {
    const newEquipements = [...formData.equipements];
    newEquipements[index][field] = value;
    setFormData({ ...formData, equipements: newEquipements });
  };

  const addEquipement = () => {
    setFormData({
      ...formData,
      equipements: [...formData.equipements, { equipement: '', reference: '', etat: '' }]
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Données à sauvegarder :', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Fiche sauvegardée !');
    } catch (err) {
      alert('Erreur sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={styles.container}>
      {/* Barre du haut */}
      <div style={styles.navbar}>
        <button onClick={() => navigate('/client')} style={styles.backButton}>← Retour</button>
        <h2>Fiche d'intervention</h2>
        <button onClick={handleSave} disabled={saving} style={styles.saveButton}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      {/* La fiche */}
      <div style={styles.fiche}>
        {/* En-tête */}
        <div style={styles.header}>
          <h1>FICHE D'INTERVENTION ORBIT</h1>
        </div>

        {/* PAGE 1 */}
        <div style={styles.page}>
          {/* Informations Client */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>● Informations Client</h3>
            <table style={styles.table}>
              <tbody>
                <tr><td style={styles.label}>Client :</td><td><input name="clientNom" value={formData.clientNom} onChange={handleChange} style={styles.input} /></td></tr>
                <tr><td style={styles.label}>Site :</td><td><input name="site" value={formData.site} onChange={handleChange} style={styles.input} /></td></tr>
                <tr><td style={styles.label}>Adresse :</td><td><input name="adresse" value={formData.adresse} onChange={handleChange} style={styles.input} /></td></tr>
                <tr><td style={styles.label}>Date intervention :</td><td><input type="date" name="dateIntervention" value={formData.dateIntervention} onChange={handleChange} style={styles.input} /></td></tr>
                <tr><td style={styles.label}>Heure début :</td><td><input type="time" name="heureDebut" value={formData.heureDebut} onChange={handleChange} style={styles.input} /></td></tr>
              </tbody>
            </table>
          </div>

          {/* Informations Prestataire */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>● Informations du Prestataire</h3>
            <table style={styles.table}>
              <tbody>
                <tr><td style={styles.label}>Intervenant Orbit :</td><td><input name="intervenant" value={formData.intervenant} onChange={handleChange} style={styles.input} /></td></tr>
                <tr><td style={styles.label}>Fonction :</td><td><input name="fonction" value={formData.fonction} onChange={handleChange} style={styles.input} /></td></tr>
                <tr><td style={styles.label}>Référence :</td><td><input name="reference" value={formData.reference} onChange={handleChange} style={styles.input} /></td></tr>
              </tbody>
            </table>
          </div>

          {/* Objet intervention */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>● Objet de l'intervention</h3>
            <div style={styles.checkboxGrid}>
              <label><input type="checkbox" name="objetPreventive" checked={formData.objetPreventive} onChange={handleChange} /> Maintenance préventive</label>
              <label><input type="checkbox" name="objetCorrective" checked={formData.objetCorrective} onChange={handleChange} /> Intervention corrective</label>
              <label><input type="checkbox" name="objetInstallation" checked={formData.objetInstallation} onChange={handleChange} /> Installation / Remplacement</label>
              <label><input type="checkbox" name="objetReseau" checked={formData.objetReseau} onChange={handleChange} /> Problème réseau</label>
              <label><input type="checkbox" name="objetOptimisation" checked={formData.objetOptimisation} onChange={handleChange} /> Optimisation énergétique</label>
              <label><input type="checkbox" name="objetAlerteClient" checked={formData.objetAlerteClient} onChange={handleChange} /> Alerte Client</label>
              <label><input type="checkbox" name="objetAlerteSysteme" checked={formData.objetAlerteSysteme} onChange={handleChange} /> Alerte Système</label>
              <label><input type="checkbox" name="objetControle" checked={formData.objetControle} onChange={handleChange} /> Contrôle métrologique</label>
            </div>
          </div>
        </div>

        {/* PAGE 2 */}
        <div style={styles.page}>
          {/* Équipements vérifiés */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>□ Équipements vérifiés</h3>
            <table style={styles.equipementTable}>
              <thead>
                <tr><th>Équipement</th><th>Référence / ID</th><th>État / Remarques</th></tr>
              </thead>
              <tbody>
                {formData.equipements.map((eq, index) => (
                  <tr key={index}>
                    <td><input value={eq.equipement} onChange={(e) => handleEquipementChange(index, 'equipement', e.target.value)} style={styles.input} /></td>
                    <td><input value={eq.reference} onChange={(e) => handleEquipementChange(index, 'reference', e.target.value)} style={styles.input} /></td>
                    <td><input value={eq.etat} onChange={(e) => handleEquipementChange(index, 'etat', e.target.value)} style={styles.input} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addEquipement} style={styles.addButton}>+ Ajouter équipement</button>
          </div>

          {/* Défaillances */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>□ Défaillances constatées</h3>
            <textarea name="defaillances" value={formData.defaillances} onChange={handleChange} style={styles.textarea} rows="3" />
          </div>

          {/* Actions réalisées */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>□ Actions réalisées</h3>
            <div style={styles.checkboxGrid}>
              <label><input type="checkbox" name="actionsVerification" checked={formData.actionsVerification} onChange={handleChange} /> Vérification mesures</label>
              <label><input type="checkbox" name="actionsControle" checked={formData.actionsControle} onChange={handleChange} /> Contrôle communication</label>
              <label><input type="checkbox" name="actionsCorrection" checked={formData.actionsCorrection} onChange={handleChange} /> Correction réseau</label>
              <label><input type="checkbox" name="actionsMiseAJour" checked={formData.actionsMiseAJour} onChange={handleChange} /> Mise à jour</label>
              <label><input type="checkbox" name="actionsTest" checked={formData.actionsTest} onChange={handleChange} /> Test fonctionnel</label>
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Autres :</label>
              <input name="actionsAutres" value={formData.actionsAutres} onChange={handleChange} style={{ ...styles.input, width: '100%' }} />
            </div>
          </div>

          {/* Recommandations */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>□ Recommandations & Actions Correctives</h3>
            <textarea name="recommandations" value={formData.recommandations} onChange={handleChange} style={styles.textarea} rows="3" />
          </div>
        </div>

        {/* PAGE 3 */}
        <div style={styles.page}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>□ Validation & Signatures</h3>
            <div style={styles.signatureContainer}>
              <div style={styles.signatureBlock}>
                <h4>Orbit Engineering Solutions</h4>
                <p>Nom : <input name="nomOrbit" value={formData.nomOrbit} onChange={handleChange} style={styles.input} /></p>
                <p>Signature : <input name="signatureOrbit" value={formData.signatureOrbit} onChange={handleChange} style={styles.input} /></p>
              </div>
              <div style={styles.signatureBlock}>
                <h4>Représentant Client</h4>
                <p>Nom : <input name="nomClient" value={formData.nomClient} onChange={handleChange} style={styles.input} /></p>
                <p>Signature : <input name="signatureClient" value={formData.signatureClient} onChange={handleChange} style={styles.input} /></p>
              </div>
            </div>
            <p>Date : <input type="date" name="dateSignature" value={formData.dateSignature} onChange={handleChange} style={styles.input} /></p>
          </div>
        </div>

        {/* Pied de page */}
        <div style={styles.footer}>
          <p>ORBIT ENGINEERING SOLUTIONS - Adresse : Pépinière ISTIC, Technopole de Borj Cédria, Route de Soliman BP 123, Hammam Chatt 1164; Ben Arous, Tunis</p>
          <p>Tél : +216 36 086 006 Email : contact@orbitsolutions.tn WebSite : www.orbitsolutions.tn</p>
          <p>MF : 1584065V/A/M/000 RC : B01198322018 RIB-BIAT : 08 110 01002 10 00785 1 29</p>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '10px 20px', borderRadius: '8px', marginBottom: '20px' },
  backButton: { padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  saveButton: { padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  fiche: { maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  header: { textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '10px' },
  page: { marginBottom: '40px' },
  section: { marginBottom: '25px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' },
  sectionTitle: { fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', borderLeft: '3px solid #007bff', paddingLeft: '10px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  label: { width: '30%', padding: '8px', fontWeight: 'bold', backgroundColor: '#f0f0f0', border: '1px solid #ddd' },
  input: { width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' },
  textarea: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' },
  checkboxGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' },
  equipementTable: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  addButton: { marginTop: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  signatureContainer: { display: 'flex', gap: '40px', marginBottom: '15px' },
  signatureBlock: { flex: 1 },
  footer: { marginTop: '30px', padding: '15px', fontSize: '0.8rem', color: '#666', borderTop: '1px solid #ddd', textAlign: 'center' }
};

export default FicheInterventionClient;