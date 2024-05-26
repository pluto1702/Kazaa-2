import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";
import "./KazaaStyle.css";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  return (
    <div className="kazaa-background">
      <div className="kazaa-animated-background"></div>
      <header className="kazaa-header">Kazaa p2p</header>
      <CenteredContainer>
        <Card className="kazaa-card">
          <Card.Body>
            <h2 className="text-center mb-4 kazaa-title">Log In</h2>
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
              <Button disabled={loading} className="kazaa-button" type="submit">
                Log In
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/forgot-password" className="kazaa-link">Forgot Password?</Link>
            </div>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2 kazaa-footer">
          Need an account? <Link to="/signup" className="kazaa-link">Sign Up</Link>
        </div>
      </CenteredContainer>
    </div>
  );
}
