import { Profile, ClassProfile, resolveSchema } from "../profile";
import { compile } from "json-schema-to-typescript";
import { dereference } from "json-schema-to-typescript/dist/src/resolver";
import { renderSVG } from "./diagrams";

export interface ElaboratedPropertyProfile {
    id: string;
    type: string;
    description: string | undefined;
    required: boolean;
}

export interface ElaboratedClassProfile {
    resource: string;
    typedef: string;
    diagram: string;
    title: string | undefined;
    description: string | undefined;
    properties: ElaboratedPropertyProfile[];
}

export interface ElaboratedRelationProfile {
    rel: string;
    to: string;
    from: string;
    min: number;
    max: number;
}

export interface ElaboratedProfile {
    resources: Array<ElaboratedClassProfile>;
    relations: Array<ElaboratedRelationProfile>;
}

function resourceName(resname: string): string {
    return resname;
}

export async function elaborate(profile: Profile): Promise<ElaboratedProfile> {
    let ret: ElaboratedProfile = {
        resources: [],
        relations: [],
    };
    let resources = Object.keys(profile.resources || {});
    let relations = Object.keys(profile.relations || {});
    if (profile.resources) {
        for (let key of resources) {
            let resname = resourceName(key);
            let cp: ClassProfile = profile.resources[key];
            let schema = resolveSchema(cp.properties || {}, resname, profile);
            let rschema = await dereference(schema, process.cwd());
            let type = await compile(schema, resname, {
                bannerComment: "",
            });
            let props = Object.keys(rschema.properties || {}).map((pkey): ElaboratedPropertyProfile => {
                if (rschema.properties) {
                    let props = rschema.properties[pkey];
                    let type = typeof props.type === "string" ? props.type : "array";
                    return {
                        id: pkey,
                        type: type,
                        description: props.description,
                        required: props.required ? props.required.indexOf(pkey) >= 0 : false,
                    };
                } else {
                    throw new Error("This shouldn't happen");
                }
            });
            ret.resources.push({
                resource: resname,
                typedef: type,
                diagram: "",
                title: cp.title,
                description: cp.description,
                properties: props,
            });
        }
    }
    if (profile.relations) {
        for (let rel of relations) {
            let rp = profile.relations[rel];
            rp.forEach(edge => {
                ret.relations.push({
                    rel: rel,
                    to: edge.to,
                    from: edge.from,
                    min: edge.min || 0,
                    max: edge.max || Infinity,
                });
            });
        }
    }

    ret.resources = await Promise.all(
        ret.resources.map(async res => {
            let diagram = await renderSVG(ret, new RegExp(res.resource));
            return { ...res, diagram: diagram };
        }),
    );

    return ret;
}
