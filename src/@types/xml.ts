export interface TypesXMLRoot {
    declaration: Declaration;
    elements: Element[];
}

export interface Declaration {
    attributes: Attributes;
}

export interface Attributes {
    version: string;
    encoding: string;
    standalone: string;
}

export interface Element {
    type: string;
    name: string;
    elements: Element2[];
}

export interface Element2 {
    type: string;
    name: string;
    attributes: Attributes2;
    elements: Element3[];
}

export interface Attributes2 {
    name: string;
}

export interface Element3 {
    type: string;
    name: string;
    elements?: Element4[];
    attributes?: Attributes3;
}

export interface Element4 {
    type: string;
    text: string;
}

export interface Attributes3 {
    name?: string;
    count_in_cargo?: string;
    count_in_hoarder?: string;
    count_in_map?: string;
    count_in_player?: string;
    crafted?: string;
    deloot?: string;
}
