import { ReactNode, createContext, useState } from "react";
import { TypesXMLRoot } from "src/@types/xml";

export type TypesXMLContextType = {
    json: TypesXMLRoot | null;
    setJson: (json: TypesXMLRoot) => void;
};

const TypesXMLContext = createContext<TypesXMLContextType | null>(null);

type Props = {
    children: ReactNode;
};

function TypesXMLProvider({ children }: Props) {
    const [json, setJson] = useState<TypesXMLRoot | null>(null);

    return (
        <TypesXMLContext.Provider value={{ json, setJson }}>
            {children}
        </TypesXMLContext.Provider>
    );
}

export { TypesXMLProvider, TypesXMLContext };
