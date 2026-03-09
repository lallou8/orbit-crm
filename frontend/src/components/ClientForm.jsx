import { useState } from 'react';
import API from '../services/api';

function ClientForm({ onClientAdded }) {
  const [form, setForm] = useState({
    nomSociete: '',
    email: '',
    telephone: '',
    adresse: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/clients', form);
      alert('Client ajouté avec succès');
      setForm({ nomSociete: '', email: '', telephone: '', adresse: '' });
      if (onClientAdded) onClientAdded();
    } catch (err) {
      alert('Erreur lors de l\'ajout');
    }
  };

  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc' }}>
      <h3>Ajouter un client</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nomSociete"
          placeholder="Nom société"
          value={form.nomSociete}
          onChange={handleChange}
          required
          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '300px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '300px' }}
        />
        <input
          type="text"
          name="telephone"
          placeholder="Téléphone"
          value={form.telephone}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '300px' }}
        />
        <input
          type="text"
          name="adresse"
          placeholder="Adresse"
          value={form.adresse}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '300px' }}
        />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default ClientForm;