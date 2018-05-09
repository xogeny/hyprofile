import { Generator } from "../generator";
import { ElaboratedProfile } from "../elaborate";
import { JSONSchema4 } from "json-schema";

interface SchemaData {
    resources: { [id: string]: ResourceData };
}

interface ResourceData {
    propSchema: JSONSchema4;
    actionSchemas: { [name: string]: JSONSchema4 };
}

export async function generateSchemas(profile: ElaboratedProfile, generator: Generator): Promise<void> {
    let data: SchemaData = { resources: {} };
    profile.resources.forEach(resource => {
        let actions: { [name: string]: JSONSchema4 } = {};
        resource.actions.forEach(action => (actions[action.id] = action.fields));
        data.resources[resource.resource] = {
            propSchema: resource.schema,
            actionSchemas: actions,
        };
    });
    await generator.writeFile("schemas.json", JSON.stringify(data, null, 4));

    return undefined;
}
