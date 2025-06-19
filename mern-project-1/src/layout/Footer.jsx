import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
  return (
    <footer className="bg-dark text-white pt-4 pb-2 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>About Us</h5>
            <p>
              Your brand’s mission statement or short description. Add some
              useful text about your website here.
            </p>
          </Col>

          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white text-decoration-none">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white text-decoration-none">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white text-decoration-none">
                  Login
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={4} className="mb-3">
            <h5>Follow Us</h5>
            <div className="d-flex gap-3">
              <Link to ="/" className="text-white">
                <FontAwesomeIcon icon={faFacebookF} />
              </Link>
              
              <Link to="#" className="text-white">
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
              <Link to="#" className="text-white">
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
              <Link to="#" className="text-white">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Link>
            </div>
          </Col>
        </Row>
        <hr className="border-light" />
        <p className="text-center m-0">&copy; {new Date().getFullYear()} Your Company Name</p>
      </Container>
    </footer>
  );
}

export default Footer;
