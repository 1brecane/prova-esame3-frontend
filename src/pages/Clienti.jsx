import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Card, Row, Col, Badge } from 'react-bootstrap';
import { clientService } from '../services/api';

const Clienti = () => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [formData, setFormData] = useState({
    Nominativo: '',
    Via: '',
    Comune: '',
    Provincia: '',
    Telefono: '',
    Email: '',
    Note: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await clientService.getAll();
      if (Array.isArray(response.data)) {
        setClients(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setClients([]);
        setError("Formato dati non valido dal server");
      }
    } catch (err) {
      console.error("Error fetching clients", err);
      setError("Errore nel caricamento dei clienti: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleShow = (client = null) => {
    if (client) {
      setCurrentClient(client);
      setFormData({
        Nominativo: client.Nominativo || '',
        Via: client.Via || '',
        Comune: client.Comune || '',
        Provincia: client.Provincia || '',
        Telefono: client.Telefono || '',
        Email: client.Email || '',
        Note: client.Note || ''
      });
    } else {
      setCurrentClient(null);
      setFormData({
        Nominativo: '',
        Via: '',
        Comune: '',
        Provincia: '',
        Telefono: '',
        Email: '',
        Note: ''
      });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentClient) {
        await clientService.update(currentClient.ClienteID, formData);
      } else {
        await clientService.create(formData);
      }
      fetchClients();
      handleClose();
    } catch (err) {
      console.error("Error saving client", err);
      setError("Errore nel salvataggio del cliente");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo cliente?")) {
      try {
        await clientService.delete(id);
        fetchClients();
      } catch (err) {
        console.error("Error deleting client", err);
        setError("Errore nell'eliminazione del cliente (potrebbe avere consegne associate)");
      }
    }
  };

  return (
    <Container fluid className="p-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-light mb-0">Clienti</h2>
          <p className="text-muted mb-0">Gestisci l'anagrafica dei tuoi clienti</p>
        </div>
        <Button variant="primary" onClick={() => handleShow()} className="rounded-pill px-4 shadow-sm">
          <i className="bi bi-plus-lg me-2"></i>Nuovo Cliente
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible className="shadow-sm border-0">{error}</Alert>}

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead className="bg-dark border-bottom border-secondary">
              <tr>
                <th className="py-3 ps-4 border-0 text-uppercase small text-muted fw-bold">ID</th>
                <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Nominativo</th>
                <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Indirizzo</th>
                <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Contatti</th>
                <th className="py-3 pe-4 border-0 text-end text-uppercase small text-muted fw-bold">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">Caricamento in corso...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">Nessun cliente trovato.</td>
                </tr>
              ) : (
                clients.map(client => (
                  <tr key={client.ClienteID}>
                    <td className="ps-4 fw-bold text-muted">#{client.ClienteID}</td>
                    <td className="fw-medium">{client.Nominativo}</td>
                    <td>
                      <div className="d-flex flex-column">
                        <span>{client.Via}</span>
                        <small className="text-muted">{client.Comune} ({client.Provincia})</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        {client.Telefono && (
                          <Badge bg="dark" text="light" className="fw-normal border border-secondary text-start">
                            📞 {client.Telefono}
                          </Badge>
                        )}
                        {client.Email && (
                          <Badge bg="dark" text="light" className="fw-normal border border-secondary text-start">
                            ✉️ {client.Email}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="pe-4 text-end">
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(client)}>
                        ✏️ Modifica
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(client.ClienteID)}>
                        🗑️ Elimina
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">{currentClient ? 'Modifica Cliente' : 'Nuovo Cliente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-4">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold text-uppercase">Nominativo</Form.Label>
                  <Form.Control type="text" name="Nominativo" value={formData.Nominativo} onChange={handleChange} required className="bg-light border-0" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold text-uppercase">Via</Form.Label>
                  <Form.Control type="text" name="Via" value={formData.Via} onChange={handleChange} required className="bg-light border-0" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold text-uppercase">Comune</Form.Label>
                  <Form.Control type="text" name="Comune" value={formData.Comune} onChange={handleChange} required className="bg-light border-0" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold text-uppercase">Provincia</Form.Label>
                  <Form.Control type="text" name="Provincia" value={formData.Provincia} onChange={handleChange} required className="bg-light border-0" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold text-uppercase">Telefono</Form.Label>
                  <Form.Control type="text" name="Telefono" value={formData.Telefono} onChange={handleChange} className="bg-light border-0" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold text-uppercase">Email</Form.Label>
                  <Form.Control type="email" name="Email" value={formData.Email} onChange={handleChange} className="bg-light border-0" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold text-uppercase">Note</Form.Label>
                  <Form.Control as="textarea" rows={3} name="Note" value={formData.Note} onChange={handleChange} className="bg-light border-0" />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="light" onClick={handleClose}>Annulla</Button>
              <Button variant="primary" type="submit" className="px-4">Salva Cliente</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Clienti;
