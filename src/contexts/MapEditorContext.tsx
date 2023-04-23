import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { AreaFlagsXMLRoot, Element2 } from "src/@types/area_flags";
import { EventsXMLRoot } from "src/@types/events";
import { AreaFlagType } from "src/@types/map";
import { MapEditorType } from "src/data/map";
import convert from "xml-js";

export type MapEditorContextType = {
    map: MapEditorType | null;
    setMap: (map: MapEditorType | null) => void;
    territories: Element2 | null;
    setTerritories: Dispatch<SetStateAction<AreaFlagsXMLRoot | null>>;
    hiddenTerritories: string[];
    isHiddenTerritory: (territory: string) => boolean;
    toggleHiddenTerritory: (territory: string) => void;
    hideAllTerritories: () => void;
    showAllTerritories: () => void;
    selectedAreaType: AreaFlagType | null;
    setSelectedAreaType: (areaType: AreaFlagType | null) => void;
    download: VoidFunction;
    events: EventsXMLRoot | null;
    setEvents: Dispatch<SetStateAction<EventsXMLRoot | null>>;
};

const MapEditorContext = createContext<MapEditorContextType | null>(null);

type Props = {
    children: ReactNode;
};

function MapEditorProvider({ children }: Props) {
    const [map, setMap] = useState<MapEditorType | null>(null);
    const [hiddenTerritories, setHiddenTerritories] = useState<string[]>([]);
    const [territories, setTerritories] = useState<AreaFlagsXMLRoot | null>(
        null
    );
    const [events, setEvents] = useState<EventsXMLRoot | null>(null);
    const [selectedAreaType, setSelectedAreaType] =
        useState<AreaFlagType | null>(null);

    const territoryTypeList = useMemo(() => {
        if (!territories) return undefined;

        return territories.elements
            .find((el) => el.name === "zg-config")
            ?.elements?.find((el) => el.name === "territory-type-list");
    }, [territories]);

    const handleDownload = () => {
        if (!territories) return;

        const xml = convert.js2xml(territories, { compact: false, spaces: 4 });

        const blob = new Blob([xml as any], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "Areaflags.xml");

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode!.removeChild(link);
    };

    const isHiddenTerritory = (territory: string) =>
        hiddenTerritories.includes(territory);

    const toggleHiddenTerritory = (territory: string) => {
        if (isHiddenTerritory(territory)) {
            setHiddenTerritories(
                hiddenTerritories.filter((t) => t !== territory)
            );
        } else {
            setHiddenTerritories([...hiddenTerritories, territory]);
        }
    };

    const hideAllTerritories = () => {
        if (!territoryTypeList || !territoryTypeList.elements) return;

        const territoriesToHide: string[] = [];

        for (const territoryType of territoryTypeList.elements) {
            if (!territoryType.elements) continue;

            for (const territory of territoryType.elements) {
                territoriesToHide.push(territory.attributes?.name);
            }
        }

        setHiddenTerritories(territoriesToHide);
        setSelectedAreaType(null);
    };

    const showAllTerritories = () => {
        setHiddenTerritories([]);
    };

    useEffect(() => {
        if (!territories) setHiddenTerritories([]);
    }, [territories]);

    return (
        <MapEditorContext.Provider
            value={{
                map,
                setMap,
                territories: territoryTypeList ?? null,
                setTerritories,
                hiddenTerritories,
                isHiddenTerritory,
                toggleHiddenTerritory,
                hideAllTerritories,
                showAllTerritories,
                selectedAreaType,
                setSelectedAreaType,
                download: handleDownload,
                events,
                setEvents,
            }}
        >
            {children}
        </MapEditorContext.Provider>
    );
}

export { MapEditorProvider, MapEditorContext };
