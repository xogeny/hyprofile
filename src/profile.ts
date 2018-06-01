import { JSONSchema4 } from "json-schema";

export type Schema = JSONSchema4 | string;
// export type Schema = {};
// export type JSONSchema4 = {};

export interface Profile {
    $schema?: string; // Should point to proschema.json in root of this repo for intellisense
    resources?: { [className: string]: ClassProfile };
    relations?: { [rel: string]: Array<RelationProfile> };
    schemas?: { [schema: string]: JSONSchema4 };
}

export interface ClassProfile {
    title?: string;
    description?: string;
    properties?: Schema;
    deprecated?: boolean;
    actions?: { [actionName: string]: ActionProfile };
}

export interface ActionProfile {
    title?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "OPTIONS" | "DELETE";
    type?: string;
    deprecated?: boolean;
    fields?: Schema;
}

export interface RelationProfile {
    from: string;
    to: string;
    deprecated?: boolean;
    min?: number;
    max?: number;
}
