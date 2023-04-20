// next
import Document, { Head, Html, Main, NextScript } from "next/document";
// theme
// import theme from "../theme/index";

// ----------------------------------------------------------------------

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="utf-8" />
                    <link
                        rel="apple-touch-icon"
                        sizes="180x180"
                        href="/favicon/apple-touch-icon.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                        href="/favicon/favicon-32x32.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="16x16"
                        href="/favicon/favicon-16x16.png"
                    />

                    {/* <meta
                        name="theme-color"
                        content={theme.colors.primary.main}
                    /> */}

                    <meta name="description" content="" />
                    <meta name="keywords" content="" />
                    <meta name="author" content="" />
                    <meta name="og:title" content="DayZ Economy Editor" />
                    <meta name="og:image" content="/img/example.png" />
                    <meta name="og:type" content="website" />
                    <meta
                        name="og:url"
                        content="https://dayz-economy-editor.vercel.app"
                    />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:image" content="/img/example.png" />
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
