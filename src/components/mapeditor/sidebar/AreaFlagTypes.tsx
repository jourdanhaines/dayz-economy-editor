// ----------------------------------------------------------------------

import { Box, Button, Checkbox, List, Stack, Text } from "@chakra-ui/react";
import useMapEditor from "src/hooks/useMapEditor";
import { getAreaFlagColorFromName } from "src/utils/colors";

export default function AreaFlagTypes() {
    const {
        territories,
        isHiddenTerritory,
        toggleHiddenTerritory,
        hideAllTerritories,
        showAllTerritories,
    } = useMapEditor();

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Button size="sm" onClick={() => showAllTerritories()}>
                    Show All
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => hideAllTerritories()}
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
                {territories &&
                    territories.elements?.map((territoryType, index) =>
                        territoryType.elements?.map(
                            (territory, territoryIndex) => {
                                if (
                                    !territory.elements ||
                                    territory.elements.length === 0
                                )
                                    return null;

                                const isChecked = !isHiddenTerritory(
                                    territory.attributes.name
                                );

                                return (
                                    <Stack
                                        key={`${index}_${territoryIndex}`}
                                        direction="row"
                                        spacing={1.5}
                                        alignItems="center"
                                        w="100%"
                                    >
                                        <Checkbox
                                            isChecked={isChecked}
                                            onChange={() =>
                                                toggleHiddenTerritory(
                                                    territory.attributes.name
                                                )
                                            }
                                        >
                                            <Text>
                                                {territory.attributes.name}
                                            </Text>
                                        </Checkbox>

                                        <Box
                                            width="16px"
                                            height="16px"
                                            bgColor={getAreaFlagColorFromName(
                                                territory.attributes.name
                                            )}
                                        />
                                    </Stack>
                                );
                            }
                        )
                    )}
            </List>
        </Stack>
    );
}
