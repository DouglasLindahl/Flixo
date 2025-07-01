"use client";

import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import colors from "../../../theme";

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1.5px solid ${colors.primary};
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  color: ${colors.primary};
  background: ${colors.secondary};

  &::placeholder {
    opacity: 0.7;
  }

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 8px ${colors.accent};
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: ${colors.secondary};
  border: 1.5px solid ${colors.primary};
  border-top: none;
  max-height: 220px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: 0 0 0.5rem 0.5rem;
  z-index: 100;
  box-shadow: 0 8px 20px rgba(123, 31, 47, 0.5);
`;

const DropdownItem = styled.li<{ highlighted?: boolean }>`
  padding: 0.6rem 1rem;
  cursor: pointer;
  color: ${({ highlighted }) =>
    highlighted ? colors.secondary : colors.primary};
  background: ${({ highlighted }) =>
    highlighted ? colors.accent : "transparent"};
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${colors.accent};
    color: ${colors.secondary};
  }
`;

const LoadingMessage = styled.p`
  margin: 0.5rem 1rem;
  font-size: 0.9rem;
  color: ${colors.accent};
  text-align: center;
`;

const NoResultsMessage = styled.p`
  margin: 0.5rem 1rem;
  font-size: 0.9rem;
  color: ${colors.error};
  text-align: center;
`;
const DropdownItemContent = styled.div`
  display: flex;
  align-items: center;
`;

const PosterImage = styled.img`
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 12px;
  flex-shrink: 0;
`;

interface Movie {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string | null;
}

export default function MovieSearch({
  apiKey,
  onSelectMovie,
}: {
  apiKey: string;
  onSelectMovie: (movie: Movie) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setHighlightIndex(-1);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();
        setResults(data.results || []);
        setHighlightIndex(-1);
      } catch {
        setResults([]);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, apiKey]);

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < results.length) {
        onSelectMovie(results[highlightIndex]);
        setQuery("");
        setResults([]);
        setHighlightIndex(-1);
      }
    } else if (e.key === "Escape") {
      setResults([]);
      setHighlightIndex(-1);
    }
  };

  return (
    <SearchContainer ref={containerRef}>
      <Input
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-controls="movie-search-list"
        aria-activedescendant={
          highlightIndex >= 0 ? `movie-item-${results[highlightIndex].id}` : ""
        }
        role="combobox"
        aria-expanded={results.length > 0}
      />
      {(results.length > 0 || isLoading) && (
        <Dropdown id="movie-search-list" role="listbox">
          {isLoading && <LoadingMessage>Loading...</LoadingMessage>}
          {!isLoading && results.length === 0 && query && (
            <NoResultsMessage>No results found</NoResultsMessage>
          )}
          {!isLoading &&
            results.map((movie, idx) => (
              <DropdownItem
                key={movie.id}
                id={`movie-item-${movie.id}`}
                role="option"
                highlighted={highlightIndex === idx}
                onClick={() => {
                  onSelectMovie(movie);
                  setQuery("");
                  setResults([]);
                  setHighlightIndex(-1);
                }}
                onMouseEnter={() => setHighlightIndex(idx)}
              >
                <DropdownItemContent>
                  {movie.poster_path ? (
                    <PosterImage
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                    />
                  ) : (
                    <PosterImage
                      src="/placeholder-poster.png" // or any placeholder image you want
                      alt="No poster available"
                    />
                  )}
                  <span>
                    {movie.title}{" "}
                    {movie.release_date
                      ? `(${movie.release_date.slice(0, 4)})`
                      : ""}
                  </span>
                </DropdownItemContent>
              </DropdownItem>
            ))}
        </Dropdown>
      )}
    </SearchContainer>
  );
}
