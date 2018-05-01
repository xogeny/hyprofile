import { ElaboratedProfile } from "../elaborate";
import { Generator } from "../generator";

export async function generateCode(profile: ElaboratedProfile, generator: Generator) {
    let contents = "";
    profile.resources.forEach(resource => {
        contents = `${contents}\n${resource.typedef}`;
    });
    await generator.writeFile("types.ts", contents);
}
