import { JSONSchema4 } from "json-schema";
import { dereference } from "json-schema-to-typescript/dist/src/resolver";
import { Schema, Profile } from "./profile";

export function resolveSchema(schema: Schema, profile: Profile, cwd: string): Promise<JSONSchema4> {
    if (!cwd.endsWith("/")) {
        cwd = cwd + "/";
    }
    if (typeof schema === "string") {
        let id = schema;
        if (profile.schemas) {
            schema = profile.schemas[id];
            return dereference(schema, cwd);
        } else {
            throw new Error("No local schema for " + id);
        }
    }
    return dereference(schema, cwd);
}
