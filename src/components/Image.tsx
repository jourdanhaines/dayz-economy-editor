// ----------------------------------------------------------------------

import { BoxProps, chakra } from "@chakra-ui/react";
import { CSSProperties } from "react";

export interface ImageProps extends BoxProps {
    src?: string;
    disableDrag?: boolean;
    imgProps?: CSSProperties;
    alt: string;
}

const ImageWrapper = chakra("span", {
    baseStyle: {
        display: "block",
        overflow: "hidden",
        lineHeight: 0,
    },
});

export default function Image({
    src,
    disableDrag = false,
    imgProps,
    alt,
    ...other
}: ImageProps) {
    return (
        <ImageWrapper {...other}>
            <img
                src={src}
                alt={alt}
                draggable={!disableDrag}
                style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    ...imgProps,
                }}
            />
        </ImageWrapper>
    );
}
