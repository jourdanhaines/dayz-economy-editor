import { ReactNode, createContext, useState } from "react";
import { AreaFlagsXMLRoot } from "src/@types/area_flags";
import { MapEditorType } from "src/data/map";

export type MapEditorContextType = {
    map: MapEditorType | null;
    setMap: (map: MapEditorType | null) => void;
    territories: AreaFlagsXMLRoot | null;
    setTerritories: (territories: AreaFlagsXMLRoot | null) => void;
};

const MapEditorContext = createContext<MapEditorContextType | null>(null);

type Props = {
    children: ReactNode;
};

function MapEditorProvider({ children }: Props) {
    const [map, setMap] = useState<MapEditorType | null>(null);
    const [territories, setTerritories] = useState<AreaFlagsXMLRoot | null>(
        null
    );

    return (
        <MapEditorContext.Provider
            value={{ map, setMap, territories, setTerritories }}
        >
            {children}
        </MapEditorContext.Provider>
    );
}

export { MapEditorProvider, MapEditorContext };
