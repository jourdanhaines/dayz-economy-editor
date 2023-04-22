// ----------------------------------------------------------------------

import { Button, Text } from "@chakra-ui/react";

type Props = {
    onDrop?: (file: File) => void;
};

export default function DragDrop({ onDrop }: Props) {
    return (
        <Button
            as="label"
            fontWeight="light"
            borderStyle="solid"
            borderWidth="2px"
            borderColor="grey.600"
            bgColor="transparent"
            _hover={{
                // bgColor: 'grey.600',
                borderWidth: "2px",
                borderColor: "grey.600",
            }}
            cursor="pointer"
        >
            <input
                accept=".xml"
                type="file"
                hidden
                onChange={
                    onDrop
                        ? (e) => e.target.files && onDrop(e.target.files[0])
                        : undefined
                }
            />

            <Text>
                Drag &amp; drop your file here, or click to select a file.
            </Text>
        </Button>
    );
}
