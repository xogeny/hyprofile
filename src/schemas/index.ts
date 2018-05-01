import { Generator } from "../generator";
import { ElaboratedProfile } from "../elaborate";
import { JSONSchema4 } from "json-schema";

interface ResourceData {
    propSchema: JSONSchema4;
    actionSchemas: { [name: string]: JSONSchema4 };
}

interface SchemaData {
    resources: { [id: string]: ResourceData };
}

export async function generateSchemas(profile: ElaboratedProfile, generator: Generator): Promise<void> {
    let data: SchemaData = { resources: {} };
    profile.resources.forEach(resource => {
        data.resources[resource.resource] = {
            propSchema: resource.schema,
            actionSchemas: {},
        };
    });
    await generator.writeFile("schemas.json", JSON.stringify(data, null, 4));

    return undefined;
}
