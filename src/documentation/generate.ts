import { renderToStaticMarkup } from "react-dom/server";
import { rootElement } from "./root";
import { generateTypes } from "../types";
import { Profile } from "../profile";

export async function generateDocumentation(profile: Profile) {
    let types = await generateTypes(profile);
    let root = rootElement(profile, types);
    let result = renderToStaticMarkup(root);
    return result;
}
