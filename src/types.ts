import { Profile, Schema } from "./profile";
import { compile } from "json-schema-to-typescript";
import { JSONSchema4 } from "json-schema";

export interface ProfileTypes {
    resources: { [className: string]: string };
}

export async function generateTypes(profile: Profile): Promise<ProfileTypes> {
    let ret: ProfileTypes = { resources: {} };
    if (profile.resources) {
        for (let key in profile.resources) {
            let resource = profile.resources[key];
            if (resource.properties) {
                let properties = resource.properties;
                let typeString = resolveSchema(properties, key, profile);
                ret.resources[key] = await typeString;
            }
        }
    }
    return ret;
}

export async function resolveSchema(schema: Schema, resource: string, profile: Profile) {
    let typename = resource;
    if (schema.hasOwnProperty("$ref")) {
        let url = (schema as any)["$ref"] as string;
        if (url.startsWith("#/schemas/")) {
            let id = url.slice(10);
            if (profile.schemas) {
                schema = profile.schemas[id];
                return compile(schema as JSONSchema4, typename);
            } else {
                throw new Error("No local schema for " + id);
            }
        }
    }
    console.log("Original schema: ", schema);
    return compile(schema as JSONSchema4, typename);
}
