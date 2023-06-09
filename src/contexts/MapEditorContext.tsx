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
import { Element as Event, EventSpawnsXMLRoot } from "src/@types/event_spawns";
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
    eventSpawns: Event | null;
    setEventSpawns: Dispatch<SetStateAction<EventSpawnsXMLRoot | null>>;
    hiddenEventSpawns: string[];
    isHiddenEventSpawn: (spawn: string) => boolean;
    toggleHiddenEventSpawn: (spawn: string) => void;
    hideAllEventSpawns: () => void;
    showAllEventSpawns: () => void;
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
    const [hiddenEventSpawns, setHiddenEventSpawns] = useState<string[]>([]);
    const [eventSpawns, setEventSpawns] = useState<EventSpawnsXMLRoot | null>(
        null
    );

    const territoryTypeList = useMemo(() => {
        if (!territories) return undefined;

        return territories.elements
            .find((el) => el.name === "zg-config")
            ?.elements?.find((el) => el.name === "territory-type-list");
    }, [territories]);

    const spawns = useMemo(() => {
        if (!eventSpawns) return null;

        return eventSpawns.elements.find((el) => el.name === "eventposdef");
    }, [eventSpawns]);

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

    /**
     * ===================
     * =   Territories   =
     * ===================
     */

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

    /**
     * ====================
     * =   Event Spawns   =
     * ====================
     */

    const isHiddenEventSpawn = (spawn: string) =>
        hiddenEventSpawns.includes(spawn);

    const toggleHiddenEventSpawn = (spawn: string) => {
        if (isHiddenEventSpawn(spawn)) {
            setHiddenEventSpawns(hiddenEventSpawns.filter((t) => t !== spawn));
        } else {
            setHiddenEventSpawns([...hiddenEventSpawns, spawn]);
        }
    };

    const hideAllEventSpawns = () => {
        if (!spawns || !spawns.elements) return;

        const spawnsToHide: string[] = [];

        for (const event of spawns.elements) {
            spawnsToHide.push(event.attributes.name);
        }

        setHiddenEventSpawns(spawnsToHide);
    };

    const showAllEventSpawns = () => {
        setHiddenEventSpawns([]);
    };

    useEffect(() => {
        if (!territories) setHiddenTerritories([]);
    }, [territories]);

    useEffect(() => {
        if (!eventSpawns) setHiddenEventSpawns([]);
    }, [eventSpawns]);

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
                eventSpawns: spawns ?? null,
                setEventSpawns,
                hiddenEventSpawns,
                hideAllEventSpawns,
                isHiddenEventSpawn,
                showAllEventSpawns,
                toggleHiddenEventSpawn,
            }}
        >
            {children}
        </MapEditorContext.Provider>
    );
}

export { MapEditorProvider, MapEditorContext };
