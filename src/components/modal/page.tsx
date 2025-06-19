"use client";

import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  cursor: pointer;
`;

export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ModalContent>
    </Overlay>
  );
}
