// ----------------------------------------------------------------------

import {
    Heading,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import Page from "src/components/Page";
import MapEditorTab from "src/components/mapeditor/MapEditorTab";
import { MapEditorProvider } from "src/contexts/MapEditorContext";
import { TypesXMLProvider } from "src/contexts/TypesXMLContext";
import Layout from "src/layouts";
import TypesXMLTab from "../components/TypesXMLTab";

const FILES = ["Map Editor", "XML Editor"];

Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default function Home() {
    return (
        <Page title="Home">
            <Stack spacing={4} w="100%">
                <Heading>DayZ Economy Editor</Heading>

                <Tabs w="100%" variant="enclosed">
                    <TabList w="100%">
                        {FILES.map((file, index) => (
                            <Tab key={index}>{file}</Tab>
                        ))}
                    </TabList>

                    <TabPanels w="100%">
                        <TabPanel px={0} w="100%">
                            <MapEditorProvider>
                                <MapEditorTab />
                            </MapEditorProvider>
                        </TabPanel>

                        <TabPanel px={0} w="100%">
                            <TypesXMLProvider>
                                <TypesXMLTab />
                            </TypesXMLProvider>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Stack>
        </Page>
    );
}
