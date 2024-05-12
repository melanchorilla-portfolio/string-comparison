import { Link } from "react-router-dom";
import { Navbar } from "flowbite-react";

export function NavBar() {
  return (
    <Navbar fluid>
      <Navbar.Brand as={Link} to="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Speech Recognition</span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link as={Link} to="/" active>
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} to="/about">
          Tentang
        </Navbar.Link>
        <Navbar.Link as={Link} to="/jaro-winkler">Jaro Winkler</Navbar.Link>
        <Navbar.Link as={Link} to="/levenshtein">Levenshtein</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
