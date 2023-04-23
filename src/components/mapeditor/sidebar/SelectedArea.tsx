// ----------------------------------------------------------------------

import {
    Code,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    GridItem,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Stack,
    Text,
} from "@chakra-ui/react";
import { Attributes4 } from "src/@types/area_flags";
import useMapEditor from "src/hooks/useMapEditor";
import { getAreaFlagColorFromName } from "src/utils/colors";

export default function SelectedArea() {
    const { map, selectedAreaType, setSelectedAreaType, setTerritories } =
        useMapEditor();

    const handleChange = (value: any, name: string) => {
        if (!selectedAreaType) return;

        setSelectedAreaType({
            ...selectedAreaType,
            [name]: value.toString(),
        });

        setTerritories((prevState) => {
            if (!prevState) return prevState;

            const temp = { ...prevState };

            const territoryTypeList = temp.elements
                .find((el) => el.name === "zg-config")
                ?.elements?.find((el) => el.name === "territory-type-list");

            if (!territoryTypeList) return prevState;

            const territoryType = territoryTypeList.elements?.find(
                (el) => el.attributes?.name === selectedAreaType.territoryType
            );

            if (!territoryType) return prevState;

            const territory = territoryType.elements?.find(
                (el) => el.attributes?.name === selectedAreaType.territoryName
            );

            if (!territory) return prevState;

            const zone = territory.elements?.find(
                (el) =>
                    el.attributes?.name === selectedAreaType.name &&
                    el.attributes.x === selectedAreaType.x &&
                    el.attributes.z === selectedAreaType.z &&
                    el.attributes.r === selectedAreaType.r
            );

            if (!zone) return prevState;

            zone.attributes[name as keyof Attributes4] = value.toString();

            return temp;
        });
    };

    if (!map) return null;

    if (!selectedAreaType) {
        return (
            <Text color="grey">
                Select an area on the map to edit it&apos;s details.
            </Text>
        );
    }

    return (
        <Stack spacing={3}>
            <Text>
                <strong>Territory:</strong> {selectedAreaType.territoryType}
                <br />
                <strong>Type:</strong>{" "}
                <span
                    style={{
                        color: getAreaFlagColorFromName(
                            selectedAreaType.territoryName
                        ),
                    }}
                >
                    {selectedAreaType.territoryName}
                </span>
            </Text>

            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                <GridItem colSpan={12}>
                    <FormControl>
                        <FormLabel>Zone Name</FormLabel>
                        <Input
                            value={selectedAreaType.name}
                            placeholder="Enter a zone name"
                            onChange={(e) =>
                                handleChange(e.target.value, "name")
                            }
                            size="sm"
                        />
                        <FormHelperText>
                            The name of the event in the <Code>events.xml</Code>{" "}
                            file
                        </FormHelperText>
                    </FormControl>
                </GridItem>

                <GridItem colSpan={6}>
                    <FormControl>
                        <FormLabel>Static Min</FormLabel>
                        <NumberInput
                            min={0}
                            value={Number(selectedAreaType.smin)}
                            onChange={(value) => handleChange(value, "smin")}
                            size="sm"
                        >
                            <NumberInputField />

                            <NumberInputStepper>
                                <NumberIncrementStepper color="white" />
                                <NumberDecrementStepper color="white" />
                            </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText>
                            The minimum number of this event in this area that
                            will be statically spawned
                        </FormHelperText>
                    </FormControl>
                </GridItem>

                <GridItem colSpan={6}>
                    <FormControl>
                        <FormLabel>Static Max</FormLabel>
                        <NumberInput
                            min={0}
                            value={Number(selectedAreaType.smax)}
                            onChange={(value) => handleChange(value, "smax")}
                            size="sm"
                        >
                            <NumberInputField />

                            <NumberInputStepper>
                                <NumberIncrementStepper color="white" />
                                <NumberDecrementStepper color="white" />
                            </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText>
                            The maximum number of this event in this area that
                            will be statically spawned
                        </FormHelperText>
                    </FormControl>
                </GridItem>

                <GridItem colSpan={6}>
                    <FormControl>
                        <FormLabel>Dynamic Min</FormLabel>
                        <NumberInput
                            min={0}
                            value={Number(selectedAreaType.dmin)}
                            onChange={(value) => handleChange(value, "dmin")}
                            size="sm"
                        >
                            <NumberInputField />

                            <NumberInputStepper>
                                <NumberIncrementStepper color="white" />
                                <NumberDecrementStepper color="white" />
                            </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText>
                            The minimum number of this event in this area that
                            will be dynamically spawned
                        </FormHelperText>
                    </FormControl>
                </GridItem>

                <GridItem colSpan={6}>
                    <FormControl>
                        <FormLabel>Dynamic Max</FormLabel>
                        <NumberInput
                            min={0}
                            value={Number(selectedAreaType.dmax)}
                            onChange={(value) => handleChange(value, "dmax")}
                            size="sm"
                        >
                            <NumberInputField />

                            <NumberInputStepper>
                                <NumberIncrementStepper color="white" />
                                <NumberDecrementStepper color="white" />
                            </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText>
                            The maximum number of this event in this area that
                            will be dynamically spawned
                        </FormHelperText>
                    </FormControl>
                </GridItem>

                <GridItem colSpan={4}>
                    <FormControl>
                        <FormLabel>X</FormLabel>
                        <NumberInput
                            min={0}
                            max={Number(map.size)}
                            value={Number(selectedAreaType.x)}
                            onChange={(value) => handleChange(value, "x")}
                            size="sm"
                        >
                            <NumberInputField />

                            <NumberInputStepper>
                                <NumberIncrementStepper color="white" />
                                <NumberDecrementStepper color="white" />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </GridItem>

                <GridItem colSpan={4}>
                    <FormControl>
                        <FormLabel>Y</FormLabel>
                        <NumberInput
                            min={0}
                            max={Number(map.size)}
                            value={Number(selectedAreaType.z)}
                            onChange={(value) => handleChange(value, "z")}
                            size="sm"
                        >
                            <NumberInputField />

                            <NumberInputStepper>
                                <NumberIncrementStepper color="white" />
                                <NumberDecrementStepper color="white" />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </GridItem>

                <GridItem colSpan={4}>
                    <FormControl>
                        <FormLabel>Radius</FormLabel>

                        <NumberInput
                            min={0}
                            max={1000}
                            value={Number(selectedAreaType.r)}
                            onChange={(value) => handleChange(value, "r")}
                            size="sm"
                        >
                            <NumberInputField />

                            <NumberInputStepper>
                                <NumberIncrementStepper color="white" />
                                <NumberDecrementStepper color="white" />
                            </NumberInputStepper>
                        </NumberInput>

                        <Slider
                            pt={0}
                            min={1}
                            max={1000}
                            onChange={(value) => handleChange(value, "r")}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>

                            <SliderThumb />
                        </Slider>
                    </FormControl>
                </GridItem>
            </Grid>
        </Stack>
    );
}
