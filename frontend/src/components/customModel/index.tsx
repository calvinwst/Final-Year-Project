import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Divider,
} from "@chakra-ui/react";

interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    body: React.ReactNode;
    footer?: React.ReactNode;
}

export const CustomModal: React.FC<CustomModalProps> = ({
    isOpen,
    onClose,
    title,
    body,
    footer,
}) => {
    const { isOpen: isModalOpen, onClose: closeModal } = useDisclosure({
        isOpen,
        onClose,
    });

    return (
        <Modal isOpen={isModalOpen} onClose={closeModal} >
            <ModalOverlay />
            <Divider />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>{body}</ModalBody>
                {footer && <ModalFooter>{footer}</ModalFooter>}
            </ModalContent>
        </Modal>
    );
};

export default CustomModal;
