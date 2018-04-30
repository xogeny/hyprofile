import * as React from "react";
import { Profile } from "../profile";
import { ProfileTypes } from "../types";

export function rootElement(profile: Profile, types: ProfileTypes) {
    return (
        <div>
            <h1>Documentation</h1>
            <h2>Resources</h2>
            {Object.keys(types.resources).map(key => (
                <div>
                    <h3>
                        <code>{key}</code>
                    </h3>
                    <pre>{types.resources[key]}</pre>
                </div>
            ))}
        </div>
    );
}
