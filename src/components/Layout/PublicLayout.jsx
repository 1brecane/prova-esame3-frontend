import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-3 border-bottom border-secondary">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-4">
            📦 Gestione Spedizioni
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link as={Link} to="/tracking" className="mx-2 fw-medium text-light">Tracking</Nav.Link>
              <Button as={Link} to="/login" variant="primary" className="ms-2 px-4 rounded-pill">
                Accedi
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className="py-5">
        {children}
      </main>
      <footer className="bg-dark py-4 mt-auto border-top border-secondary">
        <Container className="text-center text-muted">
          <small>&copy; {new Date().getFullYear()} Gestione Spedizioni. Tutti i diritti riservati.</small>
        </Container>
      </footer>
    </div>
  );
};

export default PublicLayout;
