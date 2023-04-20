// ----------------------------------------------------------------------

import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function MainLayout({ children }: Props) {
    return (
        <Box as="main" m={0} mt={16} p={8} w="100vh" position="relative">
            {children}
        </Box>
    );
}
