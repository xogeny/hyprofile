import { ElaboratedProfile } from "../elaborate";
import { Generator } from "../generator";
import camelCase from "camelcase";

function pad(str: string, padding: string): string {
    let lines = str.split("\n");
    return lines.map(line => `${padding}${line}`).join("\n");
}

export async function generateCode(profile: ElaboratedProfile, generator: Generator) {
    let contents = "";
    profile.resources.forEach(resource => {
        let payloads = `${resource.typedef}`;
        resource.actions.forEach(action => {
            payloads = `${payloads}\n${action.payloadDef}`;
        });
        contents = `${contents}\nexport namespace ${camelCase(resource.resource)} {\n${pad(payloads, "  ")}\n}\n`;
    });
    await generator.writeFile("types.ts", contents);
}
