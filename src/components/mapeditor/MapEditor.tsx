// ----------------------------------------------------------------------

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Button,
    Code,
    Grid,
    GridItem,
    Heading,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useMapEditor from "src/hooks/useMapEditor";
import convert from "xml-js";
import DragDrop from "../DragDrop";
import Map from "./Map";
import AreaFlagTypes from "./sidebar/AreaFlagTypes";
import SelectedArea from "./sidebar/SelectedArea";
import SelectedAreaEvents from "./sidebar/SelectedAreaEvents";

export default function MapEditor() {
    const { map, territories, setTerritories, download, events, setEvents } =
        useMapEditor();

    const [xmlFile, setXmlFile] = useState<File | null>(null);
    const [eventsXml, setEventsXml] = useState<File | null>(null);

    useEffect(() => {
        (async () => {
            if (!xmlFile) return;

            const xml = await xmlFile.text();
            const json = convert.xml2json(xml, { compact: false, spaces: 4 });

            setTerritories(JSON.parse(json));
        })();
    }, [xmlFile]);

    useEffect(() => {
        (async () => {
            if (!eventsXml) return;

            const xml = await eventsXml.text();
            const json = convert.xml2json(xml, { compact: false, spaces: 4 });

            setEvents(JSON.parse(json));
        })();
    }, [eventsXml]);

    if (!map) return null;

    return (
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={3}>
                {!xmlFile && !territories && (
                    <Stack>
                        <Text>
                            Drag &amp; drop your <Code>Areaflags.xml</Code> file
                            below.
                        </Text>

                        <DragDrop onDrop={(file) => setXmlFile(file)} />
                    </Stack>
                )}

                {territories && (
                    <>
                        <Stack direction="row" spacing={3} mb={3}>
                            <Button size="sm" onClick={download}>
                                Save Changes
                            </Button>

                            <Button size="sm" variant="outline" disabled>
                                Export Territories
                            </Button>
                        </Stack>

                        <Accordion defaultIndex={[0]} allowMultiple>
                            <AccordionItem>
                                <AccordionButton px={0}>
                                    <Heading
                                        as="span"
                                        flex="1"
                                        textAlign="start"
                                        fontSize="24px"
                                    >
                                        Territories
                                    </Heading>

                                    <AccordionIcon />
                                </AccordionButton>

                                <AccordionPanel px={0}>
                                    <AreaFlagTypes />
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <AccordionButton px={0}>
                                    <Heading
                                        as="span"
                                        flex="1"
                                        textAlign="start"
                                        fontSize="24px"
                                    >
                                        Selected Area
                                    </Heading>

                                    <AccordionIcon />
                                </AccordionButton>

                                <AccordionPanel px={0}>
                                    <SelectedArea />
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </>
                )}
            </GridItem>

            <GridItem colSpan={9}>{<Map map={map} />}</GridItem>

            <GridItem colSpan={12}>
                {territories && !events && (
                    <Stack>
                        <Text>
                            Drag &amp; drop your <Code>events.xml</Code> file
                            below.
                        </Text>

                        <DragDrop onDrop={(file) => setEventsXml(file)} />
                    </Stack>
                )}

                {events && <SelectedAreaEvents />}
            </GridItem>
        </Grid>
    );
}
