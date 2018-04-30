import { ISchema } from "@xogeny/ts-schema";

export type SchemaReference = { $ref: string };

export type Schema = ISchema | SchemaReference;

export interface Profile {
    resources?: { [className: string]: ClassProfile };
    relations?: { [rel: string]: Array<RelationProfile> };
    schemas?: { [schema: string]: Schema };
}

export interface ClassProfile {
    properties?: Schema;
    actions?: { [actionName: string]: ActionProfile };
}

export interface ActionProfile {
    title?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "OPTIONS" | "DELETE";
    type?: string;
    fields?: Schema;
}

export interface RelationProfile {
    from: string;
    to: string[];
}
