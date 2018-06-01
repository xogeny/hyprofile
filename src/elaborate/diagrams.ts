import { ElaboratedProfile } from "./eprofile";
const stb = require("stream-to-buffer");
const plantuml = require("node-plantuml");

import debug from "debug";
const debugSVG = debug("hyprofile:svg");

async function streamToBuffer(stream: NodeJS.ReadStream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        stb(stream, (err: Error, buffer: Buffer) => {
            if (err) reject(err);
            else resolve(buffer);
        });
    });
}

function generatePlantUML(profile: ElaboratedProfile, resname: RegExp): string {
    debugSVG("Generating UML diagram for resources that match: %s", resname);
    let relations = profile.relations.filter(rel => resname.test(rel.to) || resname.test(rel.from));
    let resources = profile.resources.filter(res => resname.test(res.resource));
    debugSVG("  Matching relations: %o", relations);
    debugSVG("  Matching resources: %o", resources);

    let processName = (name: string) => `"${name}"`;

    let classes = resources.map(res => {
        let header = `interface ${processName(res.resource)}`;
        let props = res.properties.map(prop => {
            let qual = prop.required ? "" : "?";
            return `${processName(res.resource)} : ${prop.id}${qual} : ${prop.type}`;
        });
        let actions = res.actions.map(action => {
            return `${processName(res.resource)} : ${action.id}()`;
        });
        return [header, ...props, ...actions].join("\n");
    });
    let rels = relations.map(rel => {
        return `${processName(rel.from)} --> ${processName(rel.to)} : ${rel.rel}`;
    });
    let ret = [...classes, ...rels].join("\n");
    debugSVG("  Generated UML: %s", ret);
    return ret;
}

export function generateDummyPlantUML(profile: ElaboratedProfile, resname: RegExp) {
    let ret: string = "";
    let classes = ["interface Order", "interface Customer", "interface OrderItems"];
    let properties = [
        "Order : orderNumber : number",
        "Order : itemCount? : number",
        `Order : status : "submitted" | "pending" | "completed"`,
    ];
    let rels = [
        "Order --> OrderItems : collection",
        "Order --> Customer : customer",
        `Customer --> "0..*" Order : orders`,
        `Order --> "0..1" Order : next`,
        `Order --> "0..1" Order : prev`,
    ];
    ret = classes.join("\n") + "\n" + properties.join("\n") + "\n" + rels.join("\n");
    return ret;
}

export async function renderSVG(profile: ElaboratedProfile, resname: RegExp): Promise<string> {
    const uml = generatePlantUML(profile, resname);
    debugSVG("UML: %s", uml);
    let puml = plantuml.generate(uml, { format: "svg" });
    let svg = await streamToBuffer(puml.out);
    let ret = svg.toString();
    debugSVG("  Generated SVG: %s", ret);
    return ret;
}
