import { useState, useEffect } from 'react';
import API from '../services/api';

function ProjetForm({ onProjetAdded }) {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    nom: '',
    description: '',
    clientId: '',
    dateDebut: '',
    dateFinPrevue: '',
    statut: 'en cours'
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await API.get('/clients');
        setClients(res.data);
      } catch (err) {
        console.error('Erreur chargement clients', err);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projets', form);
      alert('Projet créé avec succès');
      setForm({
        nom: '',
        description: '',
        clientId: '',
        dateDebut: '',
        dateFinPrevue: '',
        statut: 'en cours'
      });
      if (onProjetAdded) onProjetAdded();
    } catch (err) {
      alert('Erreur création projet');
    }
  };

  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <h3>Nouveau projet</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Client *</label>
          <select
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Sélectionner un client</option>
            {clients.map(client => (
              <option key={client._id} value={client._id}>
                {client.nomSociete}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Nom du projet *</label>
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Date début *</label>
          <input
            type="date"
            name="dateDebut"
            value={form.dateDebut}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Date fin prévue</label>
          <input
            type="date"
            name="dateFinPrevue"
            value={form.dateFinPrevue}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Statut</label>
          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="en cours">En cours</option>
            <option value="terminé">Terminé</option>
            <option value="suspendu">Suspendu</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Créer le projet
        </button>
      </form>
    </div>
  );
}

export default ProjetForm;