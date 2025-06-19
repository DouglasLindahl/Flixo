"use client";

import { FormEvent, useState } from "react";
import styled from "styled-components";
import supabase from "../../../supabase";
import { useRouter } from "next/navigation";
import colors from "../../../theme";

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

const LoginLink = styled.p`
  text-align: center;
  color: ${colors.accent};
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.95rem;
  user-select: none;

  &:hover {
    color: ${colors.primary};
  }
`;

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Check if username is taken
    const { data: existingUsers, error: checkError } = await supabase
      .from("user_profile")
      .select("id")
      .eq("username", username)
      .limit(1);

    if (checkError) {
      setError("Failed to validate username. Please try again.");
      setLoading(false);
      return;
    }

    if (existingUsers && existingUsers.length > 0) {
      setError("Username is already taken. Please choose another.");
      setLoading(false);
      return;
    }

    // 2. Sign up the user
    const {
      data: { user },
      error: signupError,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError || !user) {
      setError(signupError?.message || "Registration failed");
      setLoading(false);
      return;
    }

    // 3. Insert into user_profile
    const { error: profileError } = await supabase.from("user_profile").insert([
      {
        id: user.id,
        username,
      },
    ]);

    if (profileError) {
      setError("Profile creation failed: " + profileError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    setLoading(false);
  };

  return (
    <Container>
      <Form onSubmit={handleRegister}>
        <Title>Create a Flixo Account</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <Button disabled={loading}>
          {loading ? "Registering..." : "Sign Up"}
        </Button>
        <LoginLink onClick={() => router.push("/login")}>
          Already have an account?
        </LoginLink>
      </Form>
    </Container>
  );
}
