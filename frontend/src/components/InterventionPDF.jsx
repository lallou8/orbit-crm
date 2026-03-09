import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InterventionPDF from './InterventionPDF';

function FicheInterventionFormulaire({ intervention, client, ticket }) {
  const [formData, setFormData] = useState({
    // Page 1
    clientNom: client?.nomSociete || '',
    site: client?.adresse || '',
    dateIntervention: new Date(intervention?.datePrevue || '').toISOString().split('T')[0],
    heureDebut: '',
    intervenant: intervention?.technicien || '',
    fonction: '',
    reference: intervention?._id?.slice(-6) || '',
    
    // Objet intervention
    objetPreventive: false,
    objetCorrective: false,
    objetInstallation: false,
    objetReseau: false,
    objetOptimisation: false,
    objetAlerteClient: false,
    objetAlerteSysteme: false,
    objetControle: false,
    
    // Équipements
    equipements: [{ equipement: '', reference: '', etat: '' }],
    
    // Défaillances
    defaillances: '',
    
    // Actions réalisées
    actionsVerification: false,
    actionsControle: false,
    actionsCorrection: false,
    actionsMiseAJour: false,
    actionsTest: false,
    actionsAutres: '',
    
    // Recommandations
    recommandations: '',
    
    // Signatures
    nomOrbit: '',
    nomClient: '',
    signatureOrbit: '',
    signatureClient: '',
    dateSignature: new Date().toISOString().split('T')[0]
  });

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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>FICHE D'INTERVENTION ORBIT</h1>
      
      {/* Page 1 - Infos Client */}
      <section style={sectionStyle}>
        <h2 style={titleStyle}>📋 Informations Client</h2>
        <div style={gridStyle}>
          <div>
            <label>Client *</label>
            <input
              name="clientNom"
              value={formData.clientNom}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label>Site</label>
            <input
              name="site"
              value={formData.site}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label>Date intervention *</label>
            <input
              type="date"
              name="dateIntervention"
              value={formData.dateIntervention}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label>Heure début</label>
            <input
              type="time"
              name="heureDebut"
              value={formData.heureDebut}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>
      </section>

      {/* Page 1 - Infos Prestataire */}
      <section style={sectionStyle}>
        <h2 style={titleStyle}>👤 Informations Prestataire</h2>
        <div style={gridStyle}>
          <div>
            <label>Intervenant Orbit *</label>
            <input
              name="intervenant"
              value={formData.intervenant}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label>Fonction</label>
            <input
              name="fonction"
              value={formData.fonction}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label>Référence</label>
            <input
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              style={inputStyle}
              placeholder="INT-..."
            />
          </div>
        </div>
      </section>

      {/* Page 1 - Objet intervention */}
      <section style={sectionStyle}>
        <h2 style={titleStyle}>🎯 Objet de l'intervention</h2>
        <div style={checkboxGridStyle}>
          <label><input type="checkbox" name="objetPreventive" checked={formData.objetPreventive} onChange={handleChange} /> Maintenance préventive</label>
          <label><input type="checkbox" name="objetCorrective" checked={formData.objetCorrective} onChange={handleChange} /> Intervention corrective</label>
          <label><input type="checkbox" name="objetInstallation" checked={formData.objetInstallation} onChange={handleChange} /> Installation / Remplacement</label>
          <label><input type="checkbox" name="objetReseau" checked={formData.objetReseau} onChange={handleChange} /> Problème réseau</label>
          <label><input type="checkbox" name="objetOptimisation" checked={formData.objetOptimisation} onChange={handleChange} /> Optimisation énergétique</label>
          <label><input type="checkbox" name="objetAlerteClient" checked={formData.objetAlerteClient} onChange={handleChange} /> Alerte Client</label>
          <label><input type="checkbox" name="objetAlerteSysteme" checked={formData.objetAlerteSysteme} onChange={handleChange} /> Alerte Système</label>
          <label><input type="checkbox" name="objetControle" checked={formData.objetControle} onChange={handleChange} /> Contrôle métrologique</label>
        </div>
      </section>

      {/* Page 2 - Équipements */}
      <section style={sectionStyle}>
        <h2 style={titleStyle}>🔧 Équipements vérifiés</h2>
        {formData.equipements.map((eq, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              placeholder="Équipement"
              value={eq.equipement}
              onChange={(e) => handleEquipementChange(index, 'equipement', e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <input
              placeholder="Référence"
              value={eq.reference}
              onChange={(e) => handleEquipementChange(index, 'reference', e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <input
              placeholder="État"
              value={eq.etat}
              onChange={(e) => handleEquipementChange(index, 'etat', e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
        ))}
        <button onClick={addEquipement} style={buttonStyle}>+ Ajouter équipement</button>
      </section>

      {/* Page 2 - Défaillances */}
      <section style={sectionStyle}>
        <h2 style={titleStyle}>⚠️ Défaillances constatées</h2>
        <textarea
          name="defaillances"
          value={formData.defaillances}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: '80px' }}
        />
      </section>

      {/* Page 2 - Actions réalisées */}
      <section style={sectionStyle}>
        <h2 style={titleStyle}>✅ Actions réalisées</h2>
        <div style={checkboxGridStyle}>
          <label><input type="checkbox" name="actionsVerification" checked={formData.actionsVerification} onChange={handleChange} /> Vérification mesures électriques</label>
          <label><input type="checkbox" name="actionsControle" checked={formData.actionsControle} onChange={handleChange} /> Contrôle communication</label>
          <label><input type="checkbox" name="actionsCorrection" checked={formData.actionsCorrection} onChange={handleChange} /> Correction réseau</label>
          <label><input type="checkbox" name="actionsMiseAJour" checked={formData.actionsMiseAJour} onChange={handleChange} /> Mise à jour équipements</label>
          <label><input type="checkbox" name="actionsTest" checked={formData.actionsTest} onChange={handleChange} /> Test fonctionnel</label>
        </div>
        <textarea
          name="actionsAutres"
          value={formData.actionsAutres}
          onChange={handleChange}
          placeholder="Autres actions..."
          style={{ ...inputStyle, marginTop: '10px', minHeight: '60px' }}
        />
      </section>

      {/* Page 3 - Signatures */}
      <section style={sectionStyle}>
        <h2 style={titleStyle}>✍️ Validation & Signatures</h2>
        <div style={gridStyle}>
          <div>
            <label>Nom (Orbit)</label>
            <input name="nomOrbit" value={formData.nomOrbit} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label>Nom (Client)</label>
            <input name="nomClient" value={formData.nomClient} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label>Signature (Orbit)</label>
            <input name="signatureOrbit" value={formData.signatureOrbit} onChange={handleChange} style={inputStyle} placeholder="Texte ou image" />
          </div>
          <div>
            <label>Signature (Client)</label>
            <input name="signatureClient" value={formData.signatureClient} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label>Date</label>
            <input type="date" name="dateSignature" value={formData.dateSignature} onChange={handleChange} style={inputStyle} />
          </div>
        </div>
      </section>

      {/* Bouton de téléchargement PDF */}
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <PDFDownloadLink
          document={
            <InterventionPDF
              formData={formData}
              client={client}
              intervention={intervention}
              ticket={ticket}
            />
          }
          fileName={`fiche-intervention-${formData.reference || 'new'}.pdf`}
        >
          {({ loading }) => (
            <button style={{ ...buttonStyle, fontSize: '16px', padding: '15px 30px' }}>
              {loading ? 'Préparation...' : '📄 TÉLÉCHARGER LA FICHE PDF'}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      {/* Pied de page ORBIT */}
      <div style={footerStyle}>
        ORBIT ENGINEERING SOLUTIONS - Tél : +216 36 086 006 - contact@orbitsolutions.tn
      </div>
    </div>
  );
}

// Styles
const sectionStyle = {
  marginBottom: '30px',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9'
};

const titleStyle = {
  marginBottom: '15px',
  color: '#2c3e50',
  borderBottom: '2px solid #3498db',
  paddingBottom: '5px'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '15px'
};

const checkboxGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '10px'
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginTop: '5px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px'
};

const buttonStyle = {
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  marginTop: '10px'
};

const footerStyle = {
  textAlign: 'center',
  marginTop: '40px',
  padding: '20px',
  fontSize: '12px',
  color: '#666',
  borderTop: '1px solid #ddd'
};

export default FicheInterventionFormulaire;