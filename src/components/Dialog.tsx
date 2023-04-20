import {
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    ModalProps,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { alpha } from "src/utils/colors";

export type DialogProps = {
    children?: ReactNode;
    isOpen: boolean;
    onClose: VoidFunction;
} & ModalProps;

export default function Dialog({
    children,
    isOpen,
    onClose,
    ...other
}: DialogProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size="xl"
            {...other}
        >
            <ModalOverlay
                bgColor={alpha("#000000", 0.6)}
                sx={{ backdropFilter: "blur(5px)" }}
            />

            <ModalContent
                sx={{
                    px: 6,
                    py: 4,
                    borderRadius: "16px",
                    bgColor: "grey.0",
                }}
            >
                <ModalBody width="100%">{children}</ModalBody>
            </ModalContent>
        </Modal>
    );
}
