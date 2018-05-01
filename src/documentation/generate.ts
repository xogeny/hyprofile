import { renderToStaticMarkup } from "react-dom/server";
import { rootElement } from "./root";
import { Profile } from "../profile";
import { elaborate } from "../elaborate";
import * as fs from "fs";
import { renderSVG } from "../elaborate/diagrams";

export async function generateDocumentation(profile: Profile) {
    let eprofile = await elaborate(profile);
    let svg = await renderSVG(eprofile, new RegExp(".*"));
    let root = rootElement(eprofile, svg.toString());
    let result = renderToStaticMarkup(root);
    fs.writeFileSync("documentation.html", result);
    return result;
}
