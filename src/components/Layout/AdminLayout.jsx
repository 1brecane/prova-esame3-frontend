import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout d-flex flex-column min-vh-100 bg-dark">
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm border-bottom border-secondary sticky-top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary me-4">
            📦 Dashboard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-navbar-nav" />
          <Navbar.Collapse id="admin-navbar-nav">
            <Nav className="me-auto my-2 my-lg-0">
              <Nav.Link 
                as={Link} 
                to="/clienti" 
                className={`mx-2 px-3 rounded ${isActive('/clienti') ? 'bg-primary text-dark fw-bold' : 'text-light'}`}
              >
                Clienti
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/consegne" 
                className={`mx-2 px-3 rounded ${isActive('/consegne') ? 'bg-primary text-dark fw-bold' : 'text-light'}`}
              >
                Consegne
              </Nav.Link>
              {user?.admin && (
                <Nav.Link 
                  as={Link} 
                  to="/utenti" 
                  className={`mx-2 px-3 rounded ${isActive('/utenti') ? 'bg-primary text-dark fw-bold' : 'text-light'}`}
                >
                  Utenti
                </Nav.Link>
              )}
            </Nav>
            <Nav className="align-items-center">
              <Dropdown align="end">
                <Dropdown.Toggle variant="dark" id="dropdown-user" className="border-0 bg-transparent text-light fw-medium">
                  👤 {user?.nome || user?.email || 'Admin'}
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow border-secondary mt-2 bg-dark">
                  <Dropdown.Item onClick={handleLogout} className="text-danger bg-dark hover-bg-secondary">Esci</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <Container fluid className="flex-grow-1 py-4 px-md-4">
        <div className="bg-dark rounded-3 shadow-sm p-4 h-100 border border-secondary">
          {children}
        </div>
      </Container>
    </div>
  );
};

export default AdminLayout;
