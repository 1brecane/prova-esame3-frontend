import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col, ProgressBar } from 'react-bootstrap';
import { trackingService } from '../services/api';
import dayjs from 'dayjs';

const Tracking = () => {
  const [chiave, setChiave] = useState('');
  const [dataRitiro, setDataRitiro] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const response = await trackingService.track(chiave, dataRitiro);
      setResult(response.data);
    } catch (err) {
      console.error("Tracking error", err);
      setError("Spedizione non trovata. Controlla i dati inseriti.");
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (status) => {
    switch (status) {
      case 'da ritirare': return 25;
      case 'in deposito': return 50;
      case 'in consegna': return 75;
      case 'consegnato': return 100;
      case 'in giacenza': return 100; // Special case
      default: return 0;
    }
  };

  const getVariant = (status) => {
    if (status === 'in giacenza') return 'danger';
    if (status === 'consegnato') return 'success';
    return 'primary';
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="text-center mb-5">
            <h1 className="fw-bold text-primary mb-3">Traccia la tua spedizione</h1>
            <p className="text-muted fs-5">Inserisci il codice di tracking e la data di ritiro per conoscere lo stato del tuo pacco.</p>
          </div>
          
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            <Card.Body className="p-5">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-uppercase small text-muted">Codice Tracking</Form.Label>
                  <Form.Control 
                    size="lg"
                    type="text" 
                    placeholder="Es. A1B2C3D4" 
                    value={chiave}
                    onChange={(e) => setChiave(e.target.value)}
                    className="bg-light border-0"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-uppercase small text-muted">Data Ritiro</Form.Label>
                  <Form.Control 
                    size="lg"
                    type="date" 
                    value={dataRitiro}
                    onChange={(e) => setDataRitiro(e.target.value)}
                    className="bg-light border-0"
                    required
                  />
                </Form.Group>
                <Button 
                  variant="primary" 
                  type="submit" 
                  size="lg" 
                  className="w-100 fw-bold py-3 rounded-3 shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Ricerca in corso...' : 'Traccia Spedizione'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Row className="justify-content-center mt-4">
          <Col md={6}>
            <Alert variant="danger" className="text-center border-0 shadow-sm rounded-3">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {result && (
        <Row className="justify-content-center mt-5 fade-in">
          <Col md={10}>
            <Card className="border-0 shadow-sm rounded-4 bg-dark border border-secondary">
              <Card.Header className="bg-transparent border-bottom border-secondary p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <h4 className="mb-0 fw-bold text-light">Dettagli Spedizione</h4>
                  <span className={`badge bg-${getVariant(result.Stato)} px-3 py-2 rounded-pill text-uppercase text-dark fs-6`}>
                    {result.Stato}
                  </span>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="mb-4">
                  <ProgressBar 
                    now={getProgress(result.Stato)} 
                    variant={getVariant(result.Stato)} 
                    animated={result.Stato !== 'consegnato' && result.Stato !== 'in giacenza'} 
                    style={{ height: '10px' }}
                    className="rounded-pill"
                  />
                  <div className="d-flex justify-content-between mt-2 text-muted small fw-bold text-uppercase">
                    <span>Presa in carico</span>
                    <span>In transito</span>
                    <span>In consegna</span>
                    <span>Consegnato</span>
                  </div>
                </div>

                <Row className="g-4">
                  <Col md={6}>
                    <div className="p-3 bg-dark border border-secondary rounded-3 h-100">
                      <h6 className="text-uppercase text-muted small fw-bold mb-3">Informazioni Temporali</h6>
                      <div className="mb-2">
                        <span className="d-block text-muted small">Data Ritiro</span>
                        <span className="fw-bold fs-5 text-light">{dayjs(result.DataRitiro).format('DD MMMM YYYY')}</span>
                      </div>
                      <div>
                        <span className="d-block text-muted small">Consegna Prevista</span>
                        <span className="fw-bold fs-5 text-light">{dayjs(result.DataConsegna).format('DD MMMM YYYY')}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-3 bg-dark border border-secondary rounded-3 h-100">
                      <h6 className="text-uppercase text-muted small fw-bold mb-3">Destinatario</h6>
                      <div className="mb-2">
                        <span className="d-block text-muted small">Nominativo</span>
                        <span className="fw-bold fs-5 text-light">{result.Nominativo}</span>
                      </div>
                      <div>
                        <span className="d-block text-muted small">Indirizzo</span>
                        <span className="fw-bold text-light">{result.Via}</span>
                        <div className="text-muted">{result.Comune} ({result.Provincia})</div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Tracking;
