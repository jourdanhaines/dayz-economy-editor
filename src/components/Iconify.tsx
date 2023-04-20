import { Box, BoxProps } from "@chakra-ui/react";
import { Icon, IconifyIcon } from "@iconify/react";

// ----------------------------------------------------------------------

interface Props extends BoxProps {
    icon: IconifyIcon | string;
}

export default function Iconify({ icon, sx, ...other }: Props) {
    return (
        <Box sx={{ ...sx }} {...other}>
            <Icon icon={icon} />
        </Box>
    );
}
