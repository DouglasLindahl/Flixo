"use client";

import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import colors from "../../../theme";
import supabase from "../../../supabase";
import { useRouter } from "next/navigation";

const Container = styled.main`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: ${colors.background};
  color: ${colors.text};
  font-family: "Georgia, serif";
`;

const Form = styled.form`
  background: ${colors.secondary};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(123, 31, 47, 0.5);
  width: 100%;
  max-width: 400px;
  border: 2px solid ${colors.accent};
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
  color: ${colors.accent};
  font-weight: 700;
  text-align: center;
  text-shadow: 1px 1px 2px ${colors.primary};
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 1.2rem;
  padding: 0.75rem;
  border: 1.5px solid ${colors.primary};
  border-radius: 0.5rem;
  background: ${colors.secondary};
  color: ${colors.primary};
  font-size: 1rem;

  &::placeholder {
    color: ${colors.primary};
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: ${colors.accent};
    box-shadow: 0 0 8px ${colors.accent};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${colors.accent};
  color: ${colors.secondary};
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-bottom: 1rem;

  &:hover {
    background: ${colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: ${colors.error};
  margin-bottom: 1rem;
  text-align: center;
`;

const CheckboxContainer = styled.div`
  margin-bottom: 1rem;
  color: ${colors.primary};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ForgotPasswordButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.accent};
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding: 0;

  &:hover {
    color: ${colors.primary};
  }
`;
const RegisterLink = styled.p`
  text-align: center;
  color: ${colors.accent};
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.95rem;
  margin-top: 0;
  user-select: none;

  &:hover {
    color: ${colors.primary};
  }
`;

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const keepLogin = localStorage.getItem("keepMeLoggedIn") === "true";
    setKeepMeLoggedIn(keepLogin);

    const checkUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session && keepLogin) {
        router.push("/dashboard");
      }
    };

    checkUserSession();
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (keepMeLoggedIn) {
      localStorage.setItem("keepMeLoggedIn", "true");
    } else {
      localStorage.removeItem("keepMeLoggedIn");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    if (!email) {
      setError("Please enter your email address to reset password.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/resetPassword`,
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Password reset email sent. Check your inbox.");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleLogin}>
        <Title>Login</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <CheckboxContainer>
          <input
            id="keepMeLoggedIn"
            type="checkbox"
            checked={keepMeLoggedIn}
            onChange={() => setKeepMeLoggedIn(!keepMeLoggedIn)}
          />
          <label htmlFor="keepMeLoggedIn">Keep me logged in</label>
        </CheckboxContainer>
        <ForgotPasswordButton type="button" onClick={handleForgotPassword}>
          Forgot Password?
        </ForgotPasswordButton>
        <Button disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </Button>
        <RegisterLink onClick={() => router.push("/register")}>
          Create an account
        </RegisterLink>
      </Form>
    </Container>
  );
}
