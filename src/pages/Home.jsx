import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center mb-5">
        <Col md={10} lg={8}>
          <h1 className="display-4 fw-bold text-primary mb-3">Gestione Spedizioni</h1>
          <p className="lead text-muted mb-4">
            La soluzione completa per gestire clienti, monitorare le consegne e offrire un servizio di tracking in tempo reale.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/tracking" variant="primary" size="lg" className="px-4 rounded-pill shadow-sm">
              Traccia Spedizione
            </Button>
            <Button as={Link} to="/login" variant="outline-secondary" size="lg" className="px-4 rounded-pill">
              Area Riservata
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="g-4 justify-content-center">
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm bg-dark border border-secondary">
            <Card.Body className="p-4 text-center">
              <div className="display-5 text-primary mb-3">📦</div>
              <Card.Title className="fw-bold text-light">Tracking Real-time</Card.Title>
              <Card.Text className="text-muted">
                Monitora lo stato delle tue spedizioni in ogni momento con aggiornamenti precisi.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm bg-dark border border-secondary">
            <Card.Body className="p-4 text-center">
              <div className="display-5 text-primary mb-3">👥</div>
              <Card.Title className="fw-bold text-light">Gestione Clienti</Card.Title>
              <Card.Text className="text-muted">
                Un database completo per gestire le anagrafiche e lo storico dei tuoi clienti.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm bg-dark border border-secondary">
            <Card.Body className="p-4 text-center">
              <div className="display-5 text-primary mb-3">🚚</div>
              <Card.Title className="fw-bold text-light">Logistica Semplice</Card.Title>
              <Card.Text className="text-muted">
                Organizza ritiri e consegne in modo efficiente con la nostra dashboard intuitiva.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
