import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

interface ErrorModelProps {
  type: string;
  title: string;
  content: string;
}

const ErrorModel: React.FC<ErrorModelProps> = ({ type, content, title }) => {
  return (
    <>
      <Modal isOpen={true} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{content}</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => {}}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
