const args = process.argv;
import * as fs from "fs";
import * as path from "path";
import { elaborate } from "../elaborate";
import { FileWriter } from "../generator";
import { generateDocumentation } from "../documentation";
import { generateCode } from "../code";
import { generateSchemas } from "../schemas";

if (args.length != 4) {
    console.error("Usage: hyprofile PROFILE OUTPUT_DIRECTORY");
    process.exit(1);
}

const profile = path.resolve(args[2]);
const workdir = path.dirname(profile);
const outdir = path.resolve(args[3]);

const profileData = fs.readFileSync(profile);
const profileObject = JSON.parse(profileData.toString());

async function run() {
    // process.chdir(workdir);
    let generator = new FileWriter(outdir);
    let eprofile = await elaborate(profileObject, workdir);
    await generator.writeFile("profile.json", JSON.stringify(profile, null, 4));
    await generateDocumentation(eprofile, generator);
    await generateCode(eprofile, generator);
    await generateSchemas(eprofile, generator);
}

run()
    .then(v => console.log("Profile processed"))
    .catch(e => console.error(e));
