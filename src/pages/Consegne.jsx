import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Badge, Card, Row, Col } from 'react-bootstrap';
import { deliveryService, clientService } from '../services/api';
import dayjs from 'dayjs';

const Consegne = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [formData, setFormData] = useState({
    ClienteID: '',
    DataRitiro: '',
    DataConsegna: '',
    Stato: 'da ritirare'
  });
  const [filters, setFilters] = useState({
    cliente: '',
    stato: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
    fetchClients();
  }, [filters]); // Re-fetch when filters change

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.cliente) params.cliente = filters.cliente;
      if (filters.stato) params.stato = filters.stato;
      
      const response = await deliveryService.getAll(params);
      setDeliveries(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching deliveries", err);
      setError("Errore nel caricamento delle consegne");
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientService.getAll();
      setClients(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching clients", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleShow = (delivery = null) => {
    if (delivery) {
      setCurrentDelivery(delivery);
      setFormData({
        ClienteID: delivery.ClienteID || '',
        DataRitiro: delivery.DataRitiro ? dayjs(delivery.DataRitiro).format('YYYY-MM-DD') : '',
        DataConsegna: delivery.DataConsegna ? dayjs(delivery.DataConsegna).format('YYYY-MM-DD') : '',
        Stato: delivery.Stato || 'da ritirare'
      });
    } else {
      setCurrentDelivery(null);
      setFormData({
        ClienteID: '',
        DataRitiro: '',
        DataConsegna: '',
        Stato: 'da ritirare'
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
      if (currentDelivery) {
        await deliveryService.update(currentDelivery.ConsegnaID, formData);
      } else {
        await deliveryService.create(formData);
      }
      fetchDeliveries();
      handleClose();
    } catch (err) {
      console.error("Error saving delivery", err);
      setError("Errore nel salvataggio della consegna");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questa consegna?")) {
      try {
        await deliveryService.delete(id);
        fetchDeliveries();
      } catch (err) {
        console.error("Error deleting delivery", err);
        setError("Errore nell'eliminazione della consegna");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'da ritirare': return 'secondary';
      case 'in deposito': return 'info';
      case 'in consegna': return 'primary';
      case 'consegnato': return 'success';
      case 'in giacenza': return 'danger';
      default: return 'light';
    }
  };

  const getClientName = (id) => {
    const client = clients.find(c => c.ClienteID === id);
    return client ? client.Nominativo : 'Sconosciuto';
  };

  return (
    <Container fluid className="p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0">Consegne</h2>
          <p className="text-muted mb-0">Monitora e gestisci le spedizioni</p>
        </div>
        <Button variant="primary" onClick={() => handleShow()} className="rounded-pill px-4 shadow-sm">
          <i className="bi bi-plus-lg me-2"></i>Nuova Consegna
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-4 mb-4 bg-dark border border-secondary">
        <Card.Body className="p-3">
          <Row className="g-3 align-items-center">
            <Col md={1} className="text-muted fw-bold small text-uppercase">Filtri:</Col>
            <Col md={4}>
              <Form.Select 
                name="cliente" 
                value={filters.cliente} 
                onChange={handleFilterChange}
                className="bg-dark text-light border-secondary"
                size="sm"
              >
                <option value="">Tutti i Clienti</option>
                {clients.map(client => (
                  <option key={client.ClienteID} value={client.ClienteID}>{client.Nominativo}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select 
                name="stato" 
                value={filters.stato} 
                onChange={handleFilterChange}
                className="bg-dark text-light border-secondary"
                size="sm"
              >
                <option value="">Tutti gli Stati</option>
                <option value="da ritirare">Da ritirare</option>
                <option value="in deposito">In deposito</option>
                <option value="in consegna">In consegna</option>
                <option value="consegnato">Consegnato</option>
                <option value="in giacenza">In giacenza</option>
              </Form.Select>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => setFilters({ cliente: '', stato: '' })}
                disabled={!filters.cliente && !filters.stato}
              >
                Resetta Filtri
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible className="shadow-sm border-0">{error}</Alert>}

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="py-3 ps-4 border-0 text-uppercase small text-muted fw-bold">ID</th>
                <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Cliente</th>
                <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Date</th>
                <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Tracking</th>
                <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Stato</th>
                <th className="py-3 pe-4 border-0 text-end text-uppercase small text-muted fw-bold">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">Caricamento in corso...</td>
                </tr>
              ) : deliveries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">Nessuna consegna trovata.</td>
                </tr>
              ) : (
                deliveries.map(delivery => (
                  <tr key={delivery.ConsegnaID}>
                    <td className="ps-4 fw-bold text-muted">#{delivery.ConsegnaID}</td>
                    <td className="fw-medium">{getClientName(delivery.ClienteID)}</td>
                    <td>
                      <div className="d-flex flex-column small">
                        <span className="text-muted">Ritiro: <span className="text-dark fw-bold">{dayjs(delivery.DataRitiro).format('DD/MM/YYYY')}</span></span>
                        <span className="text-muted">Consegna: <span className="text-dark fw-bold">{dayjs(delivery.DataConsegna).format('DD/MM/YYYY')}</span></span>
                      </div>
                    </td>
                    <td>
                      <code className="bg-light px-2 py-1 rounded border border-secondary text-light">{delivery.ChiaveConsegna}</code>
                    </td>
                    <td>
                      <Badge bg={getStatusBadge(delivery.Stato)} className="fw-normal text-uppercase px-2 py-1 text-dark">
                        {delivery.Stato}
                      </Badge>
                    </td>
                    <td className="pe-4 text-end">
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(delivery)}>
                        ✏️ Modifica
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(delivery.ConsegnaID)}>
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
          <Modal.Title className="fw-bold">{currentDelivery ? 'Modifica Consegna' : 'Nuova Consegna'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-4">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold text-uppercase">Cliente</Form.Label>
                  <Form.Select name="ClienteID" value={formData.ClienteID} onChange={handleChange} required className="bg-light border-0">
                    <option value="">Seleziona Cliente</option>
                    {clients.map(client => (
                      <option key={client.ClienteID} value={client.ClienteID}>{client.Nominativo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold text-uppercase">Data Ritiro</Form.Label>
                  <Form.Control type="date" name="DataRitiro" value={formData.DataRitiro} onChange={handleChange} required className="bg-light border-0" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold text-uppercase">Data Consegna</Form.Label>
                  <Form.Control type="date" name="DataConsegna" value={formData.DataConsegna} onChange={handleChange} required className="bg-light border-0" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold text-uppercase">Stato</Form.Label>
                  <Form.Select name="Stato" value={formData.Stato} onChange={handleChange} className="bg-light border-0">
                    <option value="da ritirare">Da ritirare</option>
                    <option value="in deposito">In deposito</option>
                    <option value="in consegna">In consegna</option>
                    <option value="consegnato">Consegnato</option>
                    <option value="in giacenza">In giacenza</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="light" onClick={handleClose}>Annulla</Button>
              <Button variant="primary" type="submit" className="px-4">Salva Consegna</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Consegne;
