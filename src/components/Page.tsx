import { Box, BoxProps } from "@chakra-ui/react";
import Head from "next/head";
import { ReactNode, forwardRef } from "react";

interface Props extends BoxProps {
    children: ReactNode;
    meta?: ReactNode;
    title: string;
}

// eslint-disable-next-line react/display-name
const Page = forwardRef<HTMLDivElement, Props>(
    ({ children, title = "", meta, ...other }, ref) => (
        <>
            <Head>
                <title>{`${title} | DayZ Economy Editor`}</title>
            </Head>

            <Box ref={ref} {...other}>
                {children}
            </Box>
        </>
    )
);

export default Page;
