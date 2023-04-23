export interface EventsXMLRoot {
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

// Events
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
    elements: Element3[];
}

export interface Attributes2 {
    name: string;
}

// Nominal, min, max, lifetime, etc
export interface Element3 {
    type: string;
    name: string;
    elements?: Element4[];
    attributes?: Attributes4;
}

// Children
export interface Element4 {
    type: string;
    text?: string;
    name?: string;
    attributes?: Attributes3;
}

// Child
export interface Attributes3 {
    lootmax: string;
    lootmin: string;
    max: string;
    min: string;
    type: string;
}

// Flags
export interface Attributes4 {
    deletable: string;
    init_random: string;
    remove_damaged: string;
}
