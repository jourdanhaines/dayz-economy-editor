import { useContext } from 'react';
import {
    TypesXMLContext,
    TypesXMLContextType,
} from 'src/contexts/TypesXMLContext';

const useTypesXML = () => {
    const context = useContext(TypesXMLContext);

    if (!context) throw new Error('Types XML context is null');

    return context as TypesXMLContextType;
};

export default useTypesXML;
