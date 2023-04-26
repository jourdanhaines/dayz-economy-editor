export interface EventSpawnsXMLRoot {
    declaration: Declaration;
    elements: Element[];
}

export interface Declaration {
    attributes: Attributes;
}

export interface Attributes {
    version: string;
    encoding: string;
}

// EventPosDef
export interface Element {
    type: string;
    name: string;
    elements: Element2[];
}

// Event
export interface Element2 {
    type: string;
    name: string;
    attributes: Attributes2;
    elements?: Element3[];
}

// Event -> name
export interface Attributes2 {
    name: string;
}

// Pos or Zone
export interface Element3 {
    type: string;
    name?: string;
    attributes?: Attributes3;
    comment?: string;
}

// x, y, z, a = Pos
// smin, smax, dmin, dmax, r = Zone
export interface Attributes3 {
    x?: string;
    y?: string;
    z?: string;
    a?: string;
    smin?: string;
    smax?: string;
    dmin?: string;
    dmax?: string;
    r?: string;
}
