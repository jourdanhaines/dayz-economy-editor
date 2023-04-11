// ----------------------------------------------------------------------

import {
    Button,
    Code,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Skeleton,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { TypesXMLRoot } from 'src/@types/xml';
import useTypesXML from 'src/hooks/useTypesXML';
import convert from 'xml-js';
import DragDrop from './DragDrop';
import EditorContainer from './EditorContainer';

export default function TypesXMLTab() {
    const { json, setJson } = useTypesXML();

    const [xmlFile, setXmlFile] = useState<File | null>(null);
    const [filter, setFilter] = useState({
        name: '',
        category: '',
        usage: '',
    });
    const [filteredData, setFilteredData] = useState<TypesXMLRoot | null>(null);

    const handleFilter = useCallback(
        (e: React.FormEvent<HTMLFormElement> | undefined = undefined) => {
            e?.preventDefault();
            e?.stopPropagation();

            setFilteredData(() => {
                if (!json) return null;

                const filtered = json.elements.map((type) => {
                    const filteredElements = type.elements.filter((el) => {
                        const name = el.attributes?.name;
                        const category = el.elements?.find(
                            (attr) => attr.name === 'category'
                        );

                        if (!name || !category) return false;

                        if (
                            filter.name &&
                            !name
                                .toLowerCase()
                                .includes(filter.name.toLowerCase())
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
        },
        [json, filter]
    );

    const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFilter((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDownload = () => {
        if (!json) return;

        const xml = convert.js2xml(json, { compact: false, spaces: 4 });

        const blob = new Blob([xml as any], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', 'types.xml');

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
            handleFilter();
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
                    <form onSubmit={handleFilter}>
                        <Stack spacing={4}>
                            <Stack direction="row" spacing={4}>
                                <FormControl minWidth="60%">
                                    <FormLabel>Item name</FormLabel>

                                    <Input
                                        type="text"
                                        name="name"
                                        value={filter.name}
                                        onChange={handleChangeFilter}
                                    />

                                    <FormHelperText>
                                        The name of the item to search for.
                                    </FormHelperText>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Category</FormLabel>

                                    <Input
                                        type="text"
                                        name="category"
                                        value={filter.category}
                                        onChange={handleChangeFilter}
                                    />

                                    <FormHelperText>
                                        The item category(s).
                                    </FormHelperText>
                                </FormControl>
                            </Stack>

                            <Stack direction="row" spacing={4}>
                                <Button type="submit">Filter</Button>

                                <Button onClick={handleDownload}>
                                    Download File
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                    {filteredData && <EditorContainer data={filteredData} />}
                </Stack>
            )}

            {xmlFile && (!filteredData || !json) && (
                <Skeleton height="200px" borderRadius="8px" />
            )}
        </Stack>
    );
}
