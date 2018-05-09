import { Profile, ClassProfile, resolveSchema } from "../profile";
import { compile } from "json-schema-to-typescript";
import { renderSVG } from "./diagrams";
import { JSONSchema4 } from "json-schema";

export interface ElaboratedPropertyProfile {
    id: string;
    type: string;
    description: string | undefined;
    required: boolean;
}

export interface ElaboratedActionProfile {
    id: string;
    title: string | undefined;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
    fields: JSONSchema4;
    payloadDef: string;
}

export interface ElaboratedClassProfile {
    resource: string;
    typedef: string;
    diagram: string;
    schema: JSONSchema4;
    title: string | undefined;
    description: string | undefined;
    properties: ElaboratedPropertyProfile[];
    actions: ElaboratedActionProfile[];
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
            let schema = await resolveSchema(cp.properties || {}, profile);
            let type = await compile(schema, `${resname}-props`, {
                bannerComment: "",
            });
            let props = Object.keys(schema.properties || {}).map((pkey): ElaboratedPropertyProfile => {
                if (schema.properties) {
                    let props = schema.properties[pkey];
                    let type = typeof props.type === "string" ? props.type : "array";
                    return {
                        id: pkey,
                        type: type,
                        description: props.description,
                        required: schema.required ? schema.required.indexOf(pkey) >= 0 : false,
                    };
                } else {
                    throw new Error("This shouldn't happen");
                }
            });
            let actions: ElaboratedActionProfile[] = [];
            if (cp.actions) {
                let cacts = cp.actions;
                let actionIds = Object.keys(cp.actions || {});
                actions = await Promise.all(
                    actionIds.map(async action => {
                        let act = cacts[action];
                        let fields: JSONSchema4 = act.fields
                            ? await resolveSchema(act.fields, profile)
                            : { type: "object", additionalProperties: true };
                        return {
                            id: action,
                            title: act.title,
                            method: act.method || "GET",
                            fields: fields,
                            payloadDef: await compile(fields, action + "-payload", {
                                bannerComment: "",
                            }),
                        };
                    }),
                );
            }

            ret.resources.push({
                resource: resname,
                typedef: type,
                diagram: "",
                title: cp.title,
                schema: schema,
                description: cp.description,
                properties: props,
                actions: actions,
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
