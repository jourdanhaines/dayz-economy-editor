export interface AreaFlagsXMLRoot {
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

// Global/Areas/Brush/Layers/Territory Type List
export interface Element {
    type: string;
    comment?: string;
    name?: string;
    elements?: Element2[];
}

export interface Element2 {
    type: string;
    comment?: string;
    name?: string;
    elements?: Element3[];
    attributes?: Attributes5;
}

export interface Element3 {
    type: string;
    name: string;
    attributes?: Attributes2;
    elements?: Element4[];
}

export interface Attributes2 {
    name?: string;
    usage_flags?: string;
    value_flags?: string;
    color?: string;
    visible?: string;
    file?: string;
    rgba?: string;
    size?: string;
}

export interface Element4 {
    type: string;
    name: string;
    attributes: Attributes3;
    elements?: Element5[];
}

export interface Attributes3 {
    name: string;
    visible?: string;
    color?: string;
}

export interface Element5 {
    type: string;
    name: string;
    attributes: Attributes4;
}

export interface Attributes4 {
    name: string;
    smin: string;
    smax: string;
    dmin: string;
    dmax: string;
    x: string;
    z: string;
    r: string;
    d: string;
}

export interface Attributes5 {
    color: string;
    outline: string;
    outline_color: string;
    outline_width: string;
    size: string;
}
