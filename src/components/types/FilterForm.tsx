// ----------------------------------------------------------------------

import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FormFilterType } from "src/@types/filter";

type Props = {
    onFilter: (filter: FormFilterType) => void;
    onDownload: VoidFunction;
};

export default function FilterForm({ onFilter, onDownload }: Props) {
    const [filter, setFilter] = useState<FormFilterType>({
        name: "",
        category: "",
        usage: "",
    });

    const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFilter((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
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

                    <FormHelperText>The item category(s).</FormHelperText>
                </FormControl>
            </Stack>

            <Stack direction="row" spacing={4}>
                <Button onClick={() => onFilter(filter)}>Filter</Button>

                <Button onClick={onDownload}>Download File</Button>
            </Stack>
        </Stack>
    );
}
