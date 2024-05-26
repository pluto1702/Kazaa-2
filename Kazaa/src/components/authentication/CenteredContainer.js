import React from "react";
import { Container } from "react-bootstrap";
import "./KazaaStyle.css";

export default function CenteredContainer({ children }) {
  return (
    <Container className="kazaa-centered-container">
      <div className="kazaa-content animate__animated animate__fadeIn">
        {children}
      </div>
    </Container>
  );
}
