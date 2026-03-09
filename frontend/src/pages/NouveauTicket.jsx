import TicketForm from '../components/TicketForm';

function NouveauTicket() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Créer un nouveau ticket</h1>
      <TicketForm />
    </div>
  );
}

export default NouveauTicket;