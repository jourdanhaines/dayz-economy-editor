// ----------------------------------------------------------------------

import { Box } from '@chakra-ui/react';
import { ReactElement } from 'react';

type Props = {
    children: ReactElement;
};

export default function MainLayout({ children }: Props) {
    return (
        <Box m={0} mt={16} p={8} w="100vh" position="relative">
            {children}
        </Box>
    );
}
