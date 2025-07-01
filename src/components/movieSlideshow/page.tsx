"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

type Movie = {
  id?: string | number;
  title: string;
  posterUrl: string;
  rating?: number;
};

type Props = {
  header: string;
  movies: Movie[];
};

const Wrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 40px auto;
`;

const Header = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  padding: 0 16px;
`;

const SlideshowContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background-color: #111;
`;

const SlidesWrapper = styled(motion.div)`
  display: flex;
  width: 100%;
`;

const Slide = styled.div`
  width: 100%;
  flex-shrink: 0;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Poster = styled.img`
  border-radius: 12px;
  max-height: 400px;
  object-fit: cover;
`;

const ArrowButton = styled.button<{ position: "left" | "right" }>`
  position: absolute;
  top: 50%;
  ${(props) => (props.position === "left" ? "left: 8px;" : "right: 8px;")}
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  padding: 8px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 1;
  color: white;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const MovieTitle = styled.div`
  text-align: center;
  margin-top: 12px;
  font-size: 16px;
  color: #fff;
`;

export const MovieSlideshow: React.FC<Props> = ({ header, movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () =>
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  const next = () =>
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));

  return (
    <Wrapper>
      <Header>{header}</Header>
      <SlideshowContainer>
        <SlidesWrapper
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ ease: "easeInOut", duration: 0.6 }}
          style={{ width: `${movies.length * 100}%` }}
        >
          {movies.map((movie, index) => (
            <Slide key={index}>
              <Poster src={movie.posterUrl} alt={movie.title} />
            </Slide>
          ))}
        </SlidesWrapper>

        <ArrowButton onClick={prev} position="left">
          <ChevronLeft />
        </ArrowButton>
        <ArrowButton onClick={next} position="right">
          <ChevronRight />
        </ArrowButton>
      </SlideshowContainer>
      <MovieTitle>{movies[currentIndex]?.title}</MovieTitle>
    </Wrapper>
  );
};
