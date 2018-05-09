import { JSONSchema4 } from "json-schema";
import { dereference } from "json-schema-to-typescript/dist/src/resolver";

export type Schema = JSONSchema4 | string;

export interface Profile {
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

export function resolveSchema(schema: Schema, profile: Profile): Promise<JSONSchema4> {
    if (typeof schema === "string") {
        let id = schema;
        if (profile.schemas) {
            schema = profile.schemas[id];
            return dereference(schema, process.cwd());
        } else {
            throw new Error("No local schema for " + id);
        }
    }
    return dereference(schema, process.cwd());
}
