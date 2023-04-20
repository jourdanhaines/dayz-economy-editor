import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import components from "./overrides";

const fonts = {
    heading: `'Axiforma', sans-serif`,
    body: `'Axiforma', sans-serif`,
};

const breakpoints = {
    xs: "0px",
    sm: "600px",
    md: "900px",
    lg: "1200px",
    xl: "1536px",
};

const space = {
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    18: "4.5rem",
    20: "5rem",
    22: "5.5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
};

const colors = {
    brand: {
        100: "#7A93AC",
    },
    grey: {
        0: "#617073",
        50: "#FAFAFA",
        300: "#E0E0E0",
        600: "#757575",
    },
    text: {
        dark: "#0A142F",
        light: "#FFFFFF",
    },
    background: {
        dark: "#FFFFFF",
        light: "#171A21",
    },
};

const styles = {
    global: (props: any) => ({
        body: {
            bgColor: mode(
                colors.background.light,
                colors.background.dark
            )(props),
            color: mode(colors.text.light, colors.text.dark)(props),
            margin: 0,
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            flexGrow: "1",
        },
    }),
};

const textStyles = {
    p: {
        fontSize: "14px",
    },
    other: {
        fontSize: "14px",
        fontFamily: `'Inter', sans-serif`,
    },
};

const config = {
    initialColorMode: "light",
    useSystemColorMode: false,
};

const theme = extendTheme({
    config,
    styles,
    colors,
    components,
    breakpoints,
    space,
    fonts,
    textStyles,
});
export default theme;
