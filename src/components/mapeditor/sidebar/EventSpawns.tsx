// ----------------------------------------------------------------------

import { Box, Button, Checkbox, List, Stack, Text } from "@chakra-ui/react";
import { EVENT_SPAWN_BLACKLIST } from "src/data/blacklist";
import useMapEditor from "src/hooks/useMapEditor";

export default function EventSpawns() {
    const {
        eventSpawns,
        showAllEventSpawns,
        hideAllEventSpawns,
        isHiddenEventSpawn,
        toggleHiddenEventSpawn,
    } = useMapEditor();

    if (!eventSpawns) return null;

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Button size="sm" onClick={() => showAllEventSpawns()}>
                    Show All
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => hideAllEventSpawns()}
                >
                    Hide All
                </Button>
            </Stack>

            <List
                p={3}
                maxHeight="200px"
                overflow="auto"
                bgColor="#1D1D1D"
                borderRadius="8px"
            >
                {eventSpawns.elements.map((event, index) => {
                    if (
                        !event.elements ||
                        EVENT_SPAWN_BLACKLIST.includes(event.attributes.name)
                    )
                        return null;

                    return (
                        <Stack
                            key={index}
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            w="100%"
                        >
                            <Checkbox
                                isChecked={
                                    !isHiddenEventSpawn(event.attributes.name)
                                }
                                onChange={() =>
                                    toggleHiddenEventSpawn(
                                        event.attributes.name
                                    )
                                }
                            >
                                <Text>{event.attributes.name}</Text>
                            </Checkbox>

                            <Box width="16px" height="16px" bgColor="#1D1D1D" />
                        </Stack>
                    );
                })}
            </List>
        </Stack>
    );
}
