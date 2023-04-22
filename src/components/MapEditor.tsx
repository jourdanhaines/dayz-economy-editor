// ----------------------------------------------------------------------

import { Grid, GridItem } from "@chakra-ui/react";
import useMapEditor from "src/hooks/useMapEditor";
import Map from "./mapeditor/Map";

export default function MapEditor() {
    const { map } = useMapEditor();

    return (
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={6}></GridItem>

            <GridItem colSpan={6}></GridItem>

            <GridItem colSpan={12}>{map && <Map map={map} />}</GridItem>
        </Grid>
    );
}
