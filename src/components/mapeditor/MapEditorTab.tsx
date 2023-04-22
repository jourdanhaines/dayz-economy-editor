// ----------------------------------------------------------------------

import {
    Divider,
    FormControl,
    FormLabel,
    Select,
    Stack,
} from "@chakra-ui/react";
import { MAPS } from "src/data/map";
import useMapEditor from "src/hooks/useMapEditor";
import MapEditor from "./MapEditor";

export default function MapEditorTab() {
    const { map, setMap } = useMapEditor();

    return (
        <Stack spacing={8}>
            <FormControl>
                <FormLabel>Choose map</FormLabel>

                <Select
                    placeholder="Select an option..."
                    value={map?.name}
                    onChange={(e) =>
                        setMap(
                            MAPS.find((el) => el.name === e.target.value) ??
                                null
                        )
                    }
                    sx={{
                        "& option": {
                            backgroundColor: "grey.600",
                            color: "text.light",
                        },
                    }}
                >
                    {MAPS.map((map, index) => (
                        <option key={index} value={map.name}>
                            {map.name}
                        </option>
                    ))}
                </Select>
            </FormControl>

            {map && <Divider />}

            <MapEditor />
        </Stack>
    );
}
