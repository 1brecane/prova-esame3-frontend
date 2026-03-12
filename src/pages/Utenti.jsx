import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Badge, Card, Row, Col } from 'react-bootstrap';
import { userService } from '../services/api';

const Utenti = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
    Admin: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAll();
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching users", err);
      setError("Errore nel caricamento degli utenti");
    } finally {
      setLoading(false);
    }
  };

  const handleShow = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData({
        Email: user.Email || '',
        Password: '', // Don't show password
        Admin: user.Admin || false
      });
    } else {
      setCurrentUser(null);
      setFormData({
        Email: '',
        Password: '',
        Admin: false
      });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        // Only send password if it's changed
        const dataToSend = { ...formData };
        if (!dataToSend.Password) delete dataToSend.Password;
        await userService.update(currentUser.UtenteID, dataToSend);
      } else {
        await userService.create(formData);
      }
      fetchUsers();
      handleClose();
    } catch (err) {
      console.error("Error saving user", err);
      setError("Errore nel salvataggio dell'utente (email duplicata o dati non validi)");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo utente?")) {
      try {
        await userService.delete(id);
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user", err);
        setError("Errore nell'eliminazione dell'utente");
      }
    }
  };

  return (
    <Container fluid className="p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0">Utenti</h2>
          <p className="text-muted mb-0">Gestisci gli accessi al sistema</p>
        </div>
        <Button variant="primary" onClick={() => handleShow()} className="rounded-pill px-4 shadow-sm">
          <i className="bi bi-plus-lg me-2"></i>Nuovo Utente
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible className="shadow-sm border-0">{error}</Alert>}

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="py-3 ps-4 border-0 text-uppercase small text-muted fw-bold">ID</th>
                <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Email</th>
                <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Ruolo</th>
                <th className="py-3 pe-4 border-0 text-end text-uppercase small text-muted fw-bold">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">Caricamento in corso...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">Nessun utente trovato.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.UtenteID}>
                    <td className="ps-4 fw-bold text-muted">#{user.UtenteID}</td>
                    <td className="fw-medium">{user.Email}</td>
                    <td>
                      {user.Admin ? (
                        <Badge bg="danger" className="text-uppercase px-2 py-1">Admin</Badge>
                      ) : (
                        <Badge bg="info" className="text-uppercase px-2 py-1 text-dark">Operatore</Badge>
                      )}
                    </td>
                    <td className="pe-4 text-end">
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(user)}>
                        ✏️ Modifica
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.UtenteID)}>
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

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">{currentUser ? 'Modifica Utente' : 'Nuovo Utente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small text-muted fw-bold text-uppercase">Email</Form.Label>
              <Form.Control type="email" name="Email" value={formData.Email} onChange={handleChange} required className="bg-light border-0" />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="small text-muted fw-bold text-uppercase">Password {currentUser && '(Lascia vuoto per non modificare)'}</Form.Label>
              <Form.Control type="password" name="Password" value={formData.Password} onChange={handleChange} required={!currentUser} className="bg-light border-0" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check 
                type="switch"
                id="admin-switch"
                label="Amministratore"
                name="Admin"
                checked={formData.Admin}
                onChange={handleChange}
                className="fw-bold text-muted"
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="light" onClick={handleClose}>Annulla</Button>
              <Button variant="primary" type="submit" className="px-4">Salva Utente</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Utenti;
