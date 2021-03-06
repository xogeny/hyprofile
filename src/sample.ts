import { Profile } from "./profile";

export namespace Samples {
    export const sample1: Profile = {
        resources: {
            order: {
                title: "Online Order",
                description: "An order submitted via the e-commerce API",
                properties: {
                    type: "object",
                    properties: {
                        orderNumber: {
                            type: "number",
                            description: "Order number used to cross reference with database and accounting",
                        },
                        itemCount: { type: "number" },
                        status: { type: "string", enum: ["submitted", "pending", "completed"] },
                    },
                    required: ["orderNumber", "itemCount", "status"],
                    additionalProperties: false,
                },
                actions: {
                    "add-item": {
                        title: "Add Item",
                        method: "POST",
                        type: "application/x-www-form-urlencoded",
                        fields: { $ref: "./sampleProfile/add-item-schema.json" },
                    },
                },
            },
            "order-items": {},
            customer: {
                properties: "customer-properties",
            },
        },
        relations: {
            collection: [{ from: "order", to: "order-items" }],
            items: [{ from: "order", to: "order-items" }],
            customer: [{ from: "order", to: "customer" }],
            info: [{ from: "order", to: "customer" }],
            next: [{ from: "order", to: "order", max: 1 }],
            prev: [{ from: "order", to: "order", max: 1 }],
            // canonical: [{ from: "_", to: "_", max: 1 }],
            // self: [{ from: "_", to: "_", min: 1, max: 1 }],
        },
        schemas: {
            "add-item": {
                type: "object",
                properties: {
                    orderNumber: { type: "number" },
                    productCode: { type: "string" },
                    quantity: { type: "number" },
                },
                additionalProperties: false,
            },
            "customer-properties": {
                type: "object",
                properties: {
                    customerId: { type: "string" },
                    name: { type: "string" },
                },
                required: ["customerId", "name"],
                additionalProperties: false,
            },
        },
        // import: {
        //     "other": "./other.json",
        // }
    };
}
