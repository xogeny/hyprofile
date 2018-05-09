import { JSONSchema4 } from "json-schema";

export class HyProfile {
    constructor(title?: string) {}
    resource(name: string): ResourceBuilder {
        return new ResourceBuilder(this);
    }
    action(name: string): ActionBuilder {
        return new ActionBuilder(this);
    }
    relation(name: string, ...details: Array<RelationDetails>): RelationBuilder {
        return new RelationBuilder(this);
    }
    schema(name: string, schema: JSONSchema4) {
        return new SchemaBuilder(this);
    }
}

export interface RelationDetails {
    from: string;
    to: string;
    min?: number;
    max?: number;
}

export class ResourceBuilder {
    constructor(protected profiler: HyProfile) {}
    resource(name: string): ResourceBuilder {
        return this.profiler.resource(name);
    }
    action(name: string): ActionBuilder {
        return this.profiler.action(name);
    }
    relation(name: string, ...details: Array<RelationDetails>): RelationBuilder {
        return this.profiler.relation(name);
    }
    schema(name: string, schema: JSONSchema4): SchemaBuilder {
        return this.profiler.schema(name, schema);
    }

    title(title: string): ResourceBuilder {
        return this;
    }
    description(title: string): ResourceBuilder {
        return this;
    }
    propertiesSchema(schema: JSONSchema4 | string): ResourceBuilder {
        return this;
    }
}

export class ActionBuilder {
    constructor(protected profiler: HyProfile) {}
    title(title: string): ActionBuilder {
        return this;
    }
    description(title: string): ActionBuilder {
        return this;
    }
    fields(schema: JSONSchema4 | string): ActionBuilder {
        return this;
    }
    method(method: "GET" | "PUT" | "POST" | "PATCH" | "OPTIONS" | "DELETE") {
        return this;
    }
    type(type: string) {
        return this;
    }
    action(name: string) {
        return this.profiler.action(name);
    }
    resource(name: string) {
        return this.profiler.resource(name);
    }
    relation(name: string, ...details: Array<RelationDetails>) {
        return this.profiler.relation(name);
    }
    schema(name: string, schema: JSONSchema4): SchemaBuilder {
        return this.profiler.schema(name, schema);
    }
}

export class RelationBuilder {
    constructor(protected profiler: HyProfile) {}
    relation(name: string, ...details: Array<RelationDetails>) {
        return this.profiler.relation(name);
    }
    schema(name: string, schema: JSONSchema4): SchemaBuilder {
        return this.profiler.schema(name, schema);
    }
}

export class SchemaBuilder {
    constructor(protected profiler: HyProfile) {}
    schema(name: string, schema: JSONSchema4): SchemaBuilder {
        return this.profiler.schema(name, schema);
    }
}

export const sample1 = new HyProfile("Order API")
    .resource("order")
    .title("Online Order")
    .description("An order submitted via the e-commerce API")
    .propertiesSchema({
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
    })
    .action("add-item")
    .title("Add Item")
    .method("POST")
    .type("application/x-www-form-urlencode")
    .fields("add-item")
    .resource("order-items")
    .resource("customer")
    .propertiesSchema("customer-properties")
    .relation("collection", { from: "order", to: "order-items" })
    .relation("items", { from: "order", to: "order-items" })
    .relation("customer", { from: "order", to: "customer" })
    .relation("info", { from: "order", to: "customer" })
    .relation("next", { from: "order", to: "order", max: 1 })
    .relation("prev", { from: "order", to: "order", max: 1 })
    .schema("add-item", {
        type: "object",
        properties: {
            orderNumber: { type: "number" },
            productCode: { type: "string" },
            quantity: { type: "number" },
        },
        additionalProperties: false,
    })
    .schema("customer-properties", {
        type: "object",
        properties: {
            customerId: { type: "string" },
            name: { type: "string" },
        },
        required: ["customerId", "name"],
        additionalProperties: false,
    });
