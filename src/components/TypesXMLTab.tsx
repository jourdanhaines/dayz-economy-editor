// ----------------------------------------------------------------------

import { Code, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FormFilterType } from "src/@types/filter";
import { TypesXMLRoot } from "src/@types/xml";
import useTypesXML from "src/hooks/useTypesXML";
import convert from "xml-js";
import DragDrop from "./DragDrop";
import EditorContainer from "./EditorContainer";
import FilterForm from "./types/FilterForm";

export default function TypesXMLTab() {
    const { json, setJson } = useTypesXML();

    const [xmlFile, setXmlFile] = useState<File | null>(null);
    const [filteredData, setFilteredData] = useState<TypesXMLRoot | null>(null);

    const handleFilter = (filter: FormFilterType) => {
        setFilteredData(() => {
            if (!json) return null;

            const filtered = json.elements.map((type) => {
                const filteredElements = type.elements.filter((el) => {
                    const name = el.attributes?.name;
                    const category = el.elements?.find(
                        (attr) => attr.name === "category"
                    );

                    if (!name || !category) return false;

                    if (
                        filter.name &&
                        !name.toLowerCase().includes(filter.name.toLowerCase())
                    )
                        return false;
                    if (
                        filter.category &&
                        !category.attributes?.name
                            ?.toLowerCase()
                            .includes(filter.category.toLowerCase())
                    )
                        return false;

                    return true;
                });

                return {
                    ...type,
                    elements: filteredElements,
                };
            });

            return {
                ...json,
                elements: filtered,
            };
        });
    };

    const handleDownload = () => {
        if (!json) return;

        const xml = convert.js2xml(json, { compact: false, spaces: 4 });

        const blob = new Blob([xml as any], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "types.xml");

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode!.removeChild(link);
    };

    useEffect(() => {
        (async () => {
            if (!xmlFile) return;

            const xml = await xmlFile.text();
            const json = convert.xml2json(xml, { compact: false, spaces: 4 });

            setJson(JSON.parse(json));
        })();
    }, [xmlFile]);

    useEffect(() => {
        if (json) {
            handleFilter({
                name: "",
                category: "",
                usage: "",
            });
        }
    }, [json]);

    return (
        <Stack spacing={3}>
            {!xmlFile && (
                <>
                    <Text>
                        Drag &amp; drop your <Code>types.xml</Code> file below.
                    </Text>

                    <DragDrop onDrop={(file) => setXmlFile(file)} />
                </>
            )}

            {json && (
                <Stack spacing={8}>
                    <FilterForm
                        onDownload={handleDownload}
                        onFilter={handleFilter}
                    />
                    {filteredData && <EditorContainer data={filteredData} />}
                </Stack>
            )}

            {xmlFile && (!filteredData || !json) && (
                <Skeleton height="200px" borderRadius="8px" />
            )}
        </Stack>
    );
}
