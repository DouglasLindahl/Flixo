"use client";

import { FormEvent, useState } from "react";
import styled from "styled-components";
import supabase from "../../../supabase";
import colors from "../../../theme";

const FormContainer = styled.form`
  background: ${colors.secondary};
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 0 10px rgba(123, 31, 47, 0.3);
  max-width: 400px;
  margin: 1rem auto;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.6rem;
  border: 1.5px solid ${colors.primary};
  border-radius: 0.4rem;
  font-size: 1rem;
  color: ${colors.primary};
  background: ${colors.secondary};
  &::placeholder {
    opacity: 0.7;
  }
  &:focus {
    outline: none;
    border-color: ${colors.accent};
    box-shadow: 0 0 5px ${colors.accent};
  }
`;

const Select = styled.select`
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.6rem;
  border: 1.5px solid ${colors.primary};
  border-radius: 0.4rem;
  font-size: 1rem;
  color: ${colors.primary};
  background: ${colors.secondary};
  &:focus {
    outline: none;
    border-color: ${colors.accent};
    box-shadow: 0 0 5px ${colors.accent};
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

  &:hover {
    background: ${colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Message = styled.p<{ error?: boolean }>`
  text-align: center;
  color: ${({ error }) => (error ? colors.error : colors.accent)};
  margin-bottom: 1rem;
`;

export default function AddMovie() {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("5");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to add a movie.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("user_movies").insert([
      {
        user_id: user.id,
        movie_title: title,
        rating: parseInt(rating),
      },
    ]);

    if (error) {
      setError("Failed to add movie: " + error.message);
    } else {
      setMessage(`Added "${title}" with rating ${rating}`);
      setTitle("");
      setRating("5");
    }
    setLoading(false);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {error && <Message error>{error}</Message>}
      {message && <Message>{message}</Message>}
      <Input
        type="text"
        placeholder="Movie title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        required
      >
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </Select>
      <Button disabled={loading}>{loading ? "Adding..." : "Add Movie"}</Button>
    </FormContainer>
  );
}
