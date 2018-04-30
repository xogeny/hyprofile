import { Profile } from "./profile";

export namespace Samples {
    export const sample1: Profile = {
        resources: {
            order: {
                properties: {
                    type: "object",
                    properties: {
                        orderNumber: { type: "number" },
                        itemCount: { type: "number" },
                        status: { type: "string", enum: ["submitted", "pending", "completed"] },
                    },
                    required: ["orderNumber", "itemCount", "status"],
                },
                actions: {
                    "add-item": {
                        title: "Add Item",
                        method: "POST",
                        type: "application/x-www-form-urlencoded",
                        fields: { $ref: "#/schemas/add-item" },
                    },
                },
            },
            "order-items": {},
            customer: {
                properties: { $ref: "#/schemas/customer-properties" },
            },
        },
        relations: {
            collection: [{ from: "order", to: ["order-items"] }],
            items: [{ from: "order", to: ["order-items"] }],
            customer: [{ from: "order", to: ["customer"] }],
            info: [{ from: "order", to: ["customer"] }],
            next: [{ from: "order", to: ["order"] }],
            prev: [{ from: "order", to: ["order"] }],
        },
        schemas: {
            "add-item": {
                type: "object",
                properties: {
                    orderNumber: { type: "number" },
                    productCode: { type: "text" },
                    quantity: { type: "number" },
                },
            },
            "customer-properties": {
                type: "object",
                properties: {
                    customerId: { type: "string" },
                    name: { type: "string" },
                },
                required: ["customerId", "name"],
            },
        },
    };
}
