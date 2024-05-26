import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";
import "./KazaaStyle.css";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch {
      setError("Failed to create an account");
    }

    setLoading(false);
  }

  return (
    <div className="kazaa-background">
      <header className="kazaa-header">Kazaa p2p</header>
      <CenteredContainer>
        <Card className="kazaa-card">
          <Card.Body>
            <h2 className="text-center mb-4 kazaa-title">Sign Up</h2>
            {error && <Alert variant="danger" className="kazaa-alert">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label className="kazaa-label">Email</Form.Label>
                <Form.Control className="kazaa-input" type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label className="kazaa-label">Password</Form.Label>
                <Form.Control className="kazaa-input" type="password" ref={passwordRef} required />
              </Form.Group>
              <Form.Group id="password-confirm">
                <Form.Label className="kazaa-label">Password Confirmation</Form.Label>
                <Form.Control className="kazaa-input" type="password" ref={passwordConfirmRef} required />
              </Form.Group>
              <Button disabled={loading} className="kazaa-button" type="submit">
                Sign Up
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2 kazaa-footer">
          Already have an account? <Link to="/login" className="kazaa-link">Log In</Link>
        </div>
      </CenteredContainer>
    </div>
  );
}
