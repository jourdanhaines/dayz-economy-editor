// ----------------------------------------------------------------------

import { Box, Divider, Flex, Skeleton, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AreaFlagType, EventSpawnType } from "src/@types/map";
import { EVENT_SPAWN_BLACKLIST } from "src/data/blacklist";
import { MapEditorType } from "src/data/map";
import { SVG_PATHS } from "src/data/svg_paths";
import useMapEditor from "src/hooks/useMapEditor";
import { alpha, getAreaFlagColorFromName } from "src/utils/colors";

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

    const {
        territories,
        isHiddenTerritory,
        hiddenTerritories,
        setSelectedAreaType,
        selectedAreaType,
        eventSpawns,
        isHiddenEventSpawn,
        hiddenEventSpawns,
    } = useMapEditor();

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(
        null
    );
    const [offset, setOffset] = useState<Point>(ORIGIN);
    const [mousePos, setMousePos] = useState<Point>(ORIGIN);
    const [viewportTopLeft, setViewportTopLeft] = useState<Point>(ORIGIN);
    const [scale, setScale] = useState(1);
    const [areaTypeHover, setAreaTypeHover] = useState<AreaFlagType | null>(
        null
    );
    const [eventSpawnHover, setEventSpawnHover] =
        useState<EventSpawnType | null>(null);

    const background = useMemo(
        () =>
            typeof window === "undefined" || typeof document === "undefined"
                ? undefined
                : new Image(),
        [map]
    );

    const mousePositionInMap = useMemo(() => {
        return {
            x:
                ((viewportTopLeft.x + mousePos.x / scale) /
                    (background?.width ?? 0)) *
                Number(map.size),
            y:
                Number(map.size) -
                ((viewportTopLeft.y + mousePos.y / scale) /
                    (background?.height ?? 0)) *
                    Number(map.size),
        };
    }, [viewportTopLeft.x, mousePos.x, mousePos.y, scale, background]);

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

    const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (event.button === 0) {
            if (
                event.pageX - lastMousePosRef.current.x <= 5 &&
                event.pageX - lastMousePosRef.current.x >= -5 &&
                event.pageY - lastMousePosRef.current.y <= 5 &&
                event.pageY - lastMousePosRef.current.y >= -5
            ) {
                setSelectedAreaType(areaTypeHover);
            }
        }
    };

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

            // draw territories
            if (territories && territories.elements) {
                for (const territoryType of territories.elements) {
                    if (!territoryType.elements) continue;

                    for (const territory of territoryType.elements) {
                        if (
                            !territory.elements ||
                            isHiddenTerritory(territory.attributes.name)
                        )
                            continue;

                        context.fillStyle = alpha(
                            getAreaFlagColorFromName(territory.attributes.name),
                            0.66
                        );
                        context.beginPath();

                        for (const zone of territory.elements) {
                            const spawnXPercentage =
                                Number(zone.attributes.x) / Number(map.size);
                            const spawnX = spawnXPercentage * background.width;

                            const spawnYPercentage =
                                Number(zone.attributes.z) / Number(map.size);
                            const spawnY =
                                background.height -
                                spawnYPercentage * background.height;

                            const radiusPercentage =
                                Number(zone.attributes.r) / Number(map.size);
                            const radius = radiusPercentage * background.width;

                            context.moveTo(spawnX + radius, spawnY);
                            context.arc(spawnX, spawnY, radius, 0, 2 * Math.PI);
                        }

                        if (selectedAreaType) {
                            const spawnXPercentage =
                                Number(selectedAreaType.x) / Number(map.size);
                            const spawnX = spawnXPercentage * background.width;

                            const spawnYPercentage =
                                Number(selectedAreaType.z) / Number(map.size);
                            const spawnY =
                                background.height -
                                spawnYPercentage * background.height;

                            const radiusPercentage =
                                Number(selectedAreaType.r) / Number(map.size);
                            const radius = radiusPercentage * background.width;

                            const previousFill = context.fillStyle;

                            context.fillStyle = "transparent";
                            context.strokeStyle = "#FF00FF";
                            context.setLineDash([5, 5]);
                            context.lineWidth = 2;

                            context.strokeRect(
                                spawnX - radius,
                                spawnY - radius,
                                radius * 2,
                                radius * 2
                            );

                            context.fillStyle = previousFill;
                        }

                        context.fill();
                    }
                }
            }

            // draw event spawns
            if (eventSpawns) {
                for (const spawn of eventSpawns.elements) {
                    if (
                        EVENT_SPAWN_BLACKLIST.includes(spawn.attributes.name) ||
                        isHiddenEventSpawn(spawn.attributes.name) ||
                        !spawn.elements
                    )
                        continue;

                    context.fillStyle = alpha(
                        getAreaFlagColorFromName(spawn.attributes.name),
                        0.66
                    );

                    context.beginPath();
                    const path = new Path2D();
                    for (const zone of spawn.elements) {
                        if (
                            !zone.attributes ||
                            zone.attributes.x === undefined ||
                            zone.attributes.z === undefined ||
                            zone.attributes.a === undefined
                        )
                            continue;

                        const spawnXPercentage =
                            Number(zone.attributes.x) / Number(map.size);
                        const spawnX = spawnXPercentage * background.width;

                        const spawnYPercentage =
                            Number(zone.attributes.z) / Number(map.size);
                        const spawnY =
                            background.height -
                            spawnYPercentage * background.height;

                        const radiusPercentage = 100 / Number(map.size);
                        const radius = radiusPercentage * background.width;

                        context.fillStyle = SVG_PATHS[spawn.attributes.name]
                            ? SVG_PATHS[spawn.attributes.name].color
                            : "#1D1D1D";

                        const newPath = new Path2D(
                            SVG_PATHS[spawn.attributes.name]
                                ? SVG_PATHS[spawn.attributes.name].path
                                : "M12 17q.425 0 .713-.288T13 16q0-.425-.288-.713T12 15q-.425 0-.713.288T11 16q0 .425.288.713T12 17Zm-1-4h2V7h-2v6Zm1 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"
                        );
                        path.addPath(newPath, { e: spawnX, f: spawnY });
                    }

                    path.closePath();
                    context.fill(path);
                }
            }
        }
    }, [
        background,
        context,
        scale,
        offset,
        viewportTopLeft,
        hiddenTerritories,
        territories,
        selectedAreaType,
        eventSpawns,
        hiddenEventSpawns,
    ]);

    useEffect(() => {
        if (!background) return;

        // Check if mouse position in world is colliding with a territory
        if (territories && territories.elements) {
            for (const territoryType of territories.elements) {
                if (!territoryType.elements || !territoryType.attributes?.name)
                    continue;

                for (const territory of territoryType.elements) {
                    if (
                        !territory.elements ||
                        isHiddenTerritory(territory.attributes.name)
                    )
                        continue;

                    for (const zone of territory.elements) {
                        const spawnX = Number(zone.attributes.x);
                        const spawnY = Number(zone.attributes.z);
                        const radius = Number(zone.attributes.r);

                        if (
                            mousePositionInMap.x > spawnX - radius &&
                            mousePositionInMap.x < spawnX + radius &&
                            mousePositionInMap.y > spawnY - radius &&
                            mousePositionInMap.y < spawnY + radius
                        ) {
                            setAreaTypeHover({
                                ...zone.attributes,
                                territoryType: territoryType.attributes.name,
                                territoryName: territory.attributes.name,
                            });
                            return;
                        }
                    }
                }
            }
        }

        if (eventSpawns) {
            for (const spawn of eventSpawns.elements) {
                if (
                    EVENT_SPAWN_BLACKLIST.includes(spawn.attributes.name) ||
                    isHiddenEventSpawn(spawn.attributes.name) ||
                    !spawn.elements
                )
                    continue;

                for (const zone of spawn.elements) {
                    if (
                        !zone.attributes ||
                        zone.attributes.x === undefined ||
                        zone.attributes.z === undefined ||
                        zone.attributes.a === undefined
                    )
                        continue;

                    const spawnX = Number(zone.attributes.x);
                    const spawnY = Number(zone.attributes.z);
                    const radius = 24;

                    if (
                        mousePositionInMap.x > spawnX - radius &&
                        mousePositionInMap.x < spawnX + radius &&
                        mousePositionInMap.y > spawnY - radius &&
                        mousePositionInMap.y < spawnY + radius
                    ) {
                        setEventSpawnHover({
                            name: spawn.attributes.name,
                            x: zone.attributes.x,
                            z: zone.attributes.z,
                            a: zone.attributes.a,
                        });
                        return;
                    }
                }
            }
        }

        setAreaTypeHover(null);
        setEventSpawnHover(null);
    }, [background, mousePositionInMap.x, mousePositionInMap.y]);

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
                onMouseUp={handleMouseUp}
                onMouseDown={startPan}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    width: containerRef.current?.clientWidth,
                    height: containerRef.current?.clientHeight,
                    backgroundColor: "#1D1D1D",
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
                pointerEvents="none"
            >
                <Text textAlign="center">
                    {mousePositionInMap.x.toFixed(2)} /{" "}
                    {mousePositionInMap.y.toFixed(2)}
                </Text>
                <Text textAlign="center">Scale: {scale.toFixed(2)}</Text>
            </Box>

            {areaTypeHover && (
                <Box
                    px={3}
                    py={2}
                    bgColor={alpha("#000000", 0.8)}
                    position="absolute"
                    top={`${mousePos.y}px`}
                    left={`${mousePos.x}px`}
                    transform="translate(-50%, calc(-100% - 8px))"
                    zIndex={2}
                    pointerEvents="none"
                >
                    <Flex alignItems="center" justifyContent="center" mb={2}>
                        <Box
                            borderRadius="50%"
                            border="1px solid black"
                            w="12px"
                            h="12px"
                            bgColor={getAreaFlagColorFromName(
                                areaTypeHover.territoryName
                            )}
                        />
                    </Flex>

                    <Text textAlign="center">{areaTypeHover.name}</Text>
                    <Text textAlign="center">
                        {areaTypeHover.territoryName}
                    </Text>

                    <Divider my={2} />

                    <Text textAlign="center">
                        X: {areaTypeHover.x}, Y: {areaTypeHover.z}
                    </Text>
                    <Text textAlign="center">Radius: {areaTypeHover.r}</Text>
                </Box>
            )}

            {eventSpawnHover && (
                <Box
                    px={3}
                    py={2}
                    bgColor={alpha("#000000", 0.8)}
                    position="absolute"
                    top={`${mousePos.y}px`}
                    left={`${mousePos.x}px`}
                    transform="translate(-50%, calc(-100% - 8px))"
                    zIndex={2}
                    pointerEvents="none"
                >
                    <Flex alignItems="center" justifyContent="center" mb={2}>
                        <Box
                            borderRadius="50%"
                            border="1px solid black"
                            w="12px"
                            h="12px"
                            bgColor={getAreaFlagColorFromName(
                                eventSpawnHover.name
                            )}
                        />
                    </Flex>

                    <Text textAlign="center">{eventSpawnHover.name}</Text>

                    <Divider my={2} />

                    <Text textAlign="center">
                        X: {eventSpawnHover.x}, Y: {eventSpawnHover.z}
                    </Text>
                </Box>
            )}

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
