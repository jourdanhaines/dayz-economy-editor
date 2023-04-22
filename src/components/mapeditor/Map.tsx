// ----------------------------------------------------------------------

import { Box, Skeleton, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapEditorType } from "src/data/map";
import { alpha } from "src/utils/colors";

type Props = {
    map: MapEditorType;
};

type Point = {
    x: number;
    y: number;
};

const ORIGIN = Object.freeze({ x: 0, y: 0 });

function diffPoints(p1: Point, p2: Point) {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
}

function addPoints(p1: Point, p2: Point) {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
}

function scalePoint(p1: Point, scale: number) {
    return { x: p1.x / scale, y: p1.y / scale };
}

const ZOOM_SENSITIVITY = 500; // bigger for lower zoom per scroll
const ZOOM_MAX = 2.25;
const ZOOM_MIN = 0.066;

export default function Map({ map }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lastMousePosRef = useRef<Point>(ORIGIN);
    const lastOffsetRef = useRef<Point>(ORIGIN);
    const isResetRef = useRef<boolean>(false);

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(
        null
    );
    const [offset, setOffset] = useState<Point>(ORIGIN);
    const [mousePos, setMousePos] = useState<Point>(ORIGIN);
    const [viewportTopLeft, setViewportTopLeft] = useState<Point>(ORIGIN);
    const [scale, setScale] = useState(1);

    const background = useMemo(
        () =>
            typeof window === "undefined" || typeof document === "undefined"
                ? undefined
                : new Image(),
        [map]
    );

    // reset
    const reset = useCallback(
        (context: CanvasRenderingContext2D) => {
            if (context && !isResetRef.current && background && map) {
                background.src = map.image;

                if (canvasRef.current && containerRef.current) {
                    background.onload = () => {
                        canvasRef.current!.width =
                            containerRef.current!.clientWidth;
                        canvasRef.current!.height =
                            containerRef.current!.clientHeight;
                        context.scale(1, 1);
                        setScale(1);

                        // reset state and refs
                        setContext(context);
                        setOffset(ORIGIN);
                        setMousePos(ORIGIN);
                        setViewportTopLeft(ORIGIN);
                        lastOffsetRef.current = ORIGIN;
                        lastMousePosRef.current = ORIGIN;

                        // this thing is so multiple resets in a row don't clear canvas
                        isResetRef.current = true;
                    };
                }
            }
        },
        [background]
    );

    // functions for panning
    const mouseMove = useCallback(
        (event: MouseEvent) => {
            if (context) {
                const lastMousePos = lastMousePosRef.current;
                const currentMousePos = { x: event.pageX, y: event.pageY }; // use document so can pan off element
                lastMousePosRef.current = currentMousePos;

                const mouseDiff = diffPoints(currentMousePos, lastMousePos);
                setOffset((prevOffset) => addPoints(prevOffset, mouseDiff));
            }
        },
        [background, context]
    );

    const mouseUp = useCallback(() => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
    }, [mouseMove]);

    const startPan = useCallback(
        (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
            lastMousePosRef.current = { x: event.pageX, y: event.pageY };
        },
        [mouseMove, mouseUp]
    );

    const handleDisableScroll = (e: WheelEvent) => {
        e.preventDefault();
    };

    // pan when offset or scale changes
    useEffect(() => {
        if (context && lastOffsetRef.current) {
            const offsetDiff = scalePoint(
                diffPoints(offset, lastOffsetRef.current),
                scale
            );
            context.translate(offsetDiff.x, offsetDiff.y);
            setViewportTopLeft((prevVal) => diffPoints(prevVal, offsetDiff));
            isResetRef.current = false;
        }
    }, [context, offset, scale]);

    // draw
    useEffect(() => {
        if (!background) return;

        if (context) {
            // clear canvas but maintain transform
            const storedTransform = context.getTransform();
            context.canvas.width = context.canvas.width;
            context.setTransform(storedTransform);

            context.drawImage(background, 0, 0);
        }
    }, [background, context, scale, offset, viewportTopLeft]);

    // update last offset
    useEffect(() => {
        lastOffsetRef.current = offset;
    }, [offset]);

    useEffect(() => {
        if (canvasRef.current) {
            // get new drawing context
            const renderCtx = canvasRef.current!.getContext("2d");

            if (renderCtx) {
                reset(renderCtx);
            }
        }
    }, [reset, containerRef.current]);

    useEffect(() => {
        if (!containerRef.current) return;

        containerRef.current.addEventListener("wheel", handleDisableScroll, {
            passive: false,
        });

        return () =>
            containerRef.current?.removeEventListener(
                "wheel",
                handleDisableScroll
            );
    }, [containerRef]);

    // add event listener on canvas for mouse position
    useEffect(() => {
        const canvasElem = canvasRef.current;
        if (canvasElem === null) {
            return;
        }

        function handleUpdateMouse(event: MouseEvent) {
            event.preventDefault();
            if (canvasRef.current) {
                setMousePos({
                    x: event.offsetX,
                    y: event.offsetY,
                });
            }
        }

        canvasElem.addEventListener("mousemove", handleUpdateMouse);
        canvasElem.addEventListener("wheel", handleUpdateMouse);
        return () => {
            canvasElem.removeEventListener("mousemove", handleUpdateMouse);
            canvasElem.removeEventListener("wheel", handleUpdateMouse);
        };
    }, [background]);

    // add event listener on canvas for zoom
    useEffect(() => {
        const canvasElem = canvasRef.current;
        if (canvasElem === null) {
            return;
        }

        // this is tricky. Update the viewport's "origin" such that
        // the mouse doesn't move during scale - the 'zoom point' of the mouse
        // before and after zoom is relatively the same position on the viewport
        function handleWheel(event: WheelEvent) {
            event.preventDefault();
            if (context) {
                const zoom = 1 - event.deltaY / ZOOM_SENSITIVITY;
                const viewportTopLeftDelta = {
                    x: (mousePos.x / scale) * (1 - 1 / zoom),
                    y: (mousePos.y / scale) * (1 - 1 / zoom),
                };
                const newViewportTopLeft = addPoints(
                    viewportTopLeft,
                    viewportTopLeftDelta
                );

                if (scale * zoom < ZOOM_MIN || scale * zoom > ZOOM_MAX) return;

                context.translate(viewportTopLeft.x, viewportTopLeft.y);
                context.scale(zoom, zoom);
                context.translate(-newViewportTopLeft.x, -newViewportTopLeft.y);

                setViewportTopLeft(newViewportTopLeft);
                setScale((prevState) => prevState * zoom);
                isResetRef.current = false;
            }
        }

        canvasElem.addEventListener("wheel", handleWheel);
        return () => canvasElem.removeEventListener("wheel", handleWheel);
    }, [context, mousePos.x, mousePos.y, viewportTopLeft, scale]);

    return (
        <Box
            ref={containerRef}
            width="100%"
            position="relative"
            cursor="pointer"
            sx={{ aspectRatio: "1/1" }}
        >
            <canvas
                key={map.name}
                ref={canvasRef}
                width={containerRef.current?.clientWidth}
                height={containerRef.current?.clientHeight}
                onMouseDown={startPan}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    width: containerRef.current?.clientWidth,
                    height: containerRef.current?.clientHeight,
                    backgroundColor: "black",
                }}
            />

            <Box
                px={3}
                py={2}
                bgColor={alpha("#000000", 0.8)}
                position="absolute"
                top="16px"
                left="50%"
                zIndex={2}
                transform="translateX(-50%)"
            >
                <Text textAlign="center">
                    {(
                        ((viewportTopLeft.x + mousePos.x / scale) /
                            (background?.width ?? 0)) *
                        Number(map.size)
                    ).toFixed(2)}{" "}
                    /{" "}
                    {(
                        Number(map.size) -
                        ((viewportTopLeft.y + mousePos.y / scale) /
                            (background?.height ?? 0)) *
                            Number(map.size)
                    ).toFixed(2)}
                </Text>
            </Box>

            {!context && (
                <Skeleton
                    position="absolute"
                    top={0}
                    bottom={0}
                    left={0}
                    right={0}
                    zIndex={0}
                />
            )}
        </Box>
    );
}
