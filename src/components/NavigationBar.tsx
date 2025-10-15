import { Navbar, Nav, NavbarBrand } from 'react-bootstrap';

function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark">
      <NavbarBrand href="#home">React-Bootstrap</NavbarBrand>
      <Nav className="me-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#link">Link</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default NavigationBar;