import { useContext } from "react";
import {
    MapEditorContext,
    MapEditorContextType,
} from "src/contexts/MapEditorContext";

const useMapEditor = () => {
    const context = useContext(MapEditorContext);

    if (!context) throw new Error("Map editor context is null");

    return context as MapEditorContextType;
};

export default useMapEditor;
