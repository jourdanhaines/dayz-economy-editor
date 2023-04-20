import { AppProps } from "next/app";
import theme from "src/theme";

import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { NextPageWithLayout } from "src/@types/pages";
import "src/styles/globals.css";

interface MyAppProps extends AppProps {
    Component: NextPageWithLayout;
}

export default function App(props: MyAppProps) {
    const { Component, pageProps } = props;

    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>

            <ChakraProvider theme={theme}>
                {getLayout(<Component {...pageProps} />)}
            </ChakraProvider>
        </>
    );
}
