import { renderToStaticMarkup } from "react-dom/server";
import { rootElement } from "./root";
import { ElaboratedProfile } from "../elaborate";
import { renderSVG } from "../elaborate/diagrams";
import { Generator } from "../generator";

export async function generateDocumentation(eprofile: ElaboratedProfile, generator: Generator) {
    let svg = await renderSVG(eprofile, new RegExp(".*"));
    let root = rootElement(eprofile, svg.toString());
    let result = renderToStaticMarkup(root);
    await generator.writeFile("documentation.html", result);
}
