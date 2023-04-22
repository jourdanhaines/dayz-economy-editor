import { ReactNode, createContext, useState } from "react";
import { MapEditorType } from "src/data/map";

export type MapEditorContextType = {
    map: MapEditorType | null;
    setMap: (map: MapEditorType | null) => void;
};

const MapEditorContext = createContext<MapEditorContextType | null>(null);

type Props = {
    children: ReactNode;
};

function MapEditorProvider({ children }: Props) {
    const [map, setMap] = useState<MapEditorType | null>(null);

    return (
        <MapEditorContext.Provider value={{ map, setMap }}>
            {children}
        </MapEditorContext.Provider>
    );
}

export { MapEditorProvider, MapEditorContext };
