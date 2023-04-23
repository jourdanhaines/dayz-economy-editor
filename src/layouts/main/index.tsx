// ----------------------------------------------------------------------

import { Box, Container } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function MainLayout({ children }: Props) {
    return (
        <Box as="main" m={0} mt={16} p={8} w="100vw" position="relative">
            <Container maxWidth="7xl">{children}</Container>
        </Box>
    );
}
