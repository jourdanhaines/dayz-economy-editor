// ----------------------------------------------------------------------

import { Stack } from '@chakra-ui/react';
import { TypesXMLRoot } from 'src/@types/xml';
import DBItem from './DBItem';

type Props = {
    data: TypesXMLRoot;
};

export default function EditorTable({ data }: Props) {
    return (
        <Stack spacing={6}>
            {data.elements.map((type, index) =>
                type.elements.map((el, elIndex) => (
                    <DBItem key={`${index}_${elIndex}`} data={el} />
                ))
            )}
        </Stack>
    );
}
