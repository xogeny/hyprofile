import * as React from "react";
import { ElaboratedProfile } from "../elaborate";

export function rootElement(profile: ElaboratedProfile, svg: string) {
    return (
        <div>
            <h1>Documentation</h1>
            <h2>Resources</h2>
            {profile.resources.map((res, i) => (
                <div key={i}>
                    <h3>
                        Resource:{" "}
                        <code>
                            {res.resource} {res.title && <span>({res.title})</span>}{" "}
                        </code>
                    </h3>
                    {res.description && <p>{res.description}</p>}
                    <div style={{ display: "flex" }}>
                        <div>
                            <h5>Type Definitions</h5>
                            <h6>Properties</h6>
                            <pre>{res.typedef}</pre>
                            <h6>Payloads</h6>
                            <pre>{res.actions.map(act => act.payloadDef).join("\n")}</pre>
                        </div>
                        <div>
                            <h5>Diagram</h5>
                            <div dangerouslySetInnerHTML={{ __html: res.diagram }} />
                        </div>
                    </div>
                </div>
            ))}
            <h3>Complete Resource-Relation Diagram</h3>
            <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
    );
}
