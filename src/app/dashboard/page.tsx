"use client";
import { useState } from "react";
import styled from "styled-components";
import Modal from "@/components/modal/page";
import AddMovie from "@/components/addMovie/page";
import colors from "../../../theme";

const StyledDashboard = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${colors.background};
  display: flex;
  flex-direction: row;
`;

const RightSideBar = styled.div`
  background-color: ${colors.secondary};
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"groups" | "friends">("groups");
  const [showAddMovie, setShowAddMovie] = useState(false);
  return (
    <StyledDashboard>
      {showAddMovie && (
        <Modal onClose={() => setShowAddMovie(false)}>
          <AddMovie />
        </Modal>
      )}
      <LeftSideBar>
        <h2>Recommendations for You</h2>
        <OpenButton onClick={() => setShowAddMovie(true)}>Add Movie</OpenButton>
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
