// ----------------------------------------------------------------------

import {
    Heading,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from '@chakra-ui/react';
import { useState } from 'react';
import { TypesXMLProvider } from 'src/contexts/TypesXMLContext';
import TypesXMLTab from '../components/TypesXMLTab';

const FILES = [
    'types.xml',
    'globals.xml',
    'messages.xml',
    'events.xml',
    'economy.xml',
];

export default function Home() {
    const [tab, setTab] = useState(0);

    return (
        <Stack spacing={4} w="100%">
            <Heading>DayZ Economy Editor</Heading>

            <Tabs w="100%" variant="enclosed" onChange={setTab}>
                <TabList w="100%">
                    {FILES.map((file, index) => (
                        <Tab key={index}>{file}</Tab>
                    ))}
                </TabList>

                <TabPanels w="100%">
                    <TabPanel px={0} w="100%">
                        {tab === 0 && (
                            <TypesXMLProvider>
                                <TypesXMLTab />
                            </TypesXMLProvider>
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Stack>
    );
}
