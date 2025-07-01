"use client";
import { useState } from "react";
import styled from "styled-components";
import colors from "../../../theme";
import { MovieSlideshow } from "@/components/movieSlideshow/page";

const StyledDashboard = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${colors.background};
  display: flex;
  flex-direction: row;
  padding: 24px;
`;

const RightSideBar = styled.div`
  background-color: ${colors.secondary};
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
`;

const LeftSideBar = styled.div`
  background-color: ${colors.background};
  width: 80%;
  height: 100%;
  padding: 1rem;
  overflow-y: auto;
  color: ${colors.text};
`;

const TabButtons = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: #5a2a86;
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem 0;
  background-color: ${({ active }) => (active ? "#7d49b8" : "transparent")};
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #9c6fd1;
  }
`;

const FriendsList = styled.div`
  color: white;
  padding: 1rem;
`;

const GroupsList = styled.div`
  color: white;
  padding: 1rem;
`;
const OpenButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: ${colors.accent};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin: 1rem;
  font-weight: bold;

  &:hover {
    background-color: #9c6fd1;
  }
`;

const mockMovies = [
  {
    title: "Inception",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
  },
  {
    title: "The Dark Knight",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/rqAHkvXldb9tHlnbQDwOzRi0yVD.jpg",
  },
  {
    title: "Interstellar",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"groups" | "friends">("groups");

  return (
    <StyledDashboard>
      <LeftSideBar>
        <div
          style={{
            backgroundColor: "#000",
            minHeight: "0vh",
            padding: "0px",
          }}
        >
          <MovieSlideshow header="Recently Watched" movies={mockMovies} />
        </div>
      </LeftSideBar>

      <RightSideBar>
        <TabButtons>
          <TabButton
            active={activeTab === "groups"}
            onClick={() => setActiveTab("groups")}
          >
            Groups
          </TabButton>
          <TabButton
            active={activeTab === "friends"}
            onClick={() => setActiveTab("friends")}
          >
            Friends
          </TabButton>
        </TabButtons>

        {activeTab === "groups" ? (
          <GroupsList>
            {/* TODO: Render user groups here */}
            <p>Your Groups will appear here</p>
          </GroupsList>
        ) : (
          <FriendsList>
            {/* TODO: Render user friends here */}
            <p>Your Friends will appear here</p>
          </FriendsList>
        )}
      </RightSideBar>
    </StyledDashboard>
  );
}
