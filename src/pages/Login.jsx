import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/clienti'); // Redirect to dashboard instead of home
      } else {
        setError('Login fallito. Controlla le credenziali.');
      }
    } catch (err) {
      setError('Errore durante il login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Col md={5}>
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="bg-primary p-4 text-center text-dark">
              <h3 className="fw-bold mb-0">Area Riservata</h3>
              <p className="mb-0 opacity-75">Accedi per gestire le spedizioni</p>
            </div>
            <Card.Body className="p-5">
              {error && <Alert variant="danger" className="border-0 shadow-sm mb-4">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="formBasicEmail">
                  <Form.Label className="fw-bold small text-uppercase text-muted">Email</Form.Label>
                  <Form.Control 
                    size="lg"
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-light border-0"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label className="fw-bold small text-uppercase text-muted">Password</Form.Label>
                  <Form.Control 
                    size="lg"
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-light border-0"
                    required
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  size="lg" 
                  className="w-100 fw-bold py-3 rounded-3 shadow-sm mt-2"
                  disabled={loading}
                >
                  {loading ? 'Accesso in corso...' : 'Accedi'}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="bg-light text-center py-3 border-0">
              <small className="text-muted">Non hai un account? Contatta l'amministratore.</small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
