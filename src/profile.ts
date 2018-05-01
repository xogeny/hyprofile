import { ISchema } from "@xogeny/ts-schema";
import { JSONSchema4 } from "json-schema";

export type SchemaReference = { $ref: string };

export type Schema = ISchema | SchemaReference;

export interface Profile {
    resources?: { [className: string]: ClassProfile };
    relations?: { [rel: string]: Array<RelationProfile> };
    schemas?: { [schema: string]: Schema };
}

export interface ClassProfile {
    title?: string;
    description?: string;
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
    to: string;
    min?: number;
    max?: number;
}

export function resolveSchema(schema: Schema, resource: string, profile: Profile): JSONSchema4 {
    if (schema.hasOwnProperty("$ref")) {
        let url = (schema as any)["$ref"] as string;
        if (url.startsWith("#/schemas/")) {
            let id = url.slice(10);
            if (profile.schemas) {
                schema = profile.schemas[id];
                return schema as JSONSchema4;
            } else {
                throw new Error("No local schema for " + id);
            }
        }
    }
    return schema as JSONSchema4;
}
