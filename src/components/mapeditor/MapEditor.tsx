// ----------------------------------------------------------------------

import { Box, Code, Flex, Grid, GridItem, Stack, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import useMapEditor from "src/hooks/useMapEditor";
import { alpha } from "src/utils/colors";
import { generateRGBHexFromLargeNumber } from "src/utils/formatNumber";
import convert from "xml-js";
import DragDrop from "../DragDrop";
import Map from "./Map";

export default function MapEditor() {
    const { map, territories, setTerritories } = useMapEditor();

    const [xmlFile, setXmlFile] = useState<File | null>(null);

    const territoryTypeList = useMemo(() => {
        if (!territories) return undefined;

        return territories.elements
            .find((el) => el.name === "zg-config")
            ?.elements?.find((el) => el.name === "territory-type-list");
    }, [territories]);

    useEffect(() => {
        (async () => {
            if (!xmlFile) return;

            const xml = await xmlFile.text();
            const json = convert.xml2json(xml, { compact: false, spaces: 4 });

            setTerritories(JSON.parse(json));
        })();
    }, [xmlFile]);

    if (!map) return null;

    return (
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={6}>
                {!xmlFile && (
                    <Stack>
                        <Text>
                            Drag &amp; drop your <Code>Areaflags.xml</Code> file
                            below.
                        </Text>

                        <DragDrop onDrop={(file) => setXmlFile(file)} />
                    </Stack>
                )}

                {territories && (
                    <Flex gap={3} flexWrap="wrap">
                        {territoryTypeList &&
                            territoryTypeList.elements?.map(
                                (territoryType, index) =>
                                    territoryType.elements?.map(
                                        (territory, territoryIndex) => {
                                            if (
                                                !territory.elements ||
                                                territory.elements.length === 0
                                            )
                                                return null;

                                            return (
                                                <Stack
                                                    key={`${index}_${territoryIndex}`}
                                                    direction="row"
                                                    spacing={1.5}
                                                    alignItems="center"
                                                >
                                                    <Box
                                                        width="16px"
                                                        height="16px"
                                                        bgColor={alpha(
                                                            `${generateRGBHexFromLargeNumber(
                                                                Number(
                                                                    territory
                                                                        ?.attributes
                                                                        ?.color ??
                                                                        0
                                                                )
                                                            )}`,
                                                            0.66
                                                        )}
                                                    />

                                                    <Text>
                                                        {
                                                            territory
                                                                .elements[0]
                                                                .attributes.name
                                                        }
                                                    </Text>
                                                </Stack>
                                            );
                                        }
                                    )
                            )}
                    </Flex>
                )}
            </GridItem>

            <GridItem colSpan={6}></GridItem>

            <GridItem colSpan={12}>{<Map map={map} />}</GridItem>
        </Grid>
    );
}
