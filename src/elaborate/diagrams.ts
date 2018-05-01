import { ElaboratedProfile } from "./eprofile";
const stb = require("stream-to-buffer");
const plantuml = require("node-plantuml");
import camelCase from "camelcase";

async function streamToBuffer(stream: NodeJS.ReadStream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        stb(stream, (err: Error, buffer: Buffer) => {
            console.log("Done");
            if (err) reject(err);
            else resolve(buffer);
        });
    });
}

function generatePlantUML(profile: ElaboratedProfile, resname: RegExp): string {
    let relations = profile.relations.filter(rel => resname.test(rel.to) || resname.test(rel.from));
    let resources = profile.resources.filter(res => resname.test(res.resource));

    let classes = resources.map(res => {
        let header = `interface ${camelCase(res.resource)}`;
        let props = res.properties.map(prop => {
            let qual = prop.required ? "" : "?";
            return `${camelCase(res.resource)} : ${prop.id}${qual} : ${prop.type}`;
        });
        return [header, ...props].join("\n");
    });
    let rels = relations.map(rel => {
        return `${camelCase(rel.from)} --> ${camelCase(rel.to)} : ${rel.rel}`;
    });
    let ret = [...classes, ...rels].join("\n");
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
    let puml = plantuml.generate(generatePlantUML(profile, resname), { format: "svg" });
    let svg = await streamToBuffer(puml.out);
    return svg.toString();
}
