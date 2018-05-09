
export namespace order {
  export interface OrderProps {
    /**
     * Order number used to cross reference with database and accounting
     */
    orderNumber: number;
    itemCount: number;
    status: "submitted" | "pending" | "completed";
  }
  
  export interface AddItemPayload {
    orderNumber?: number;
    productCode?: string;
    quantity?: number;
  }
  
}

export namespace orderItems {
  export interface OrderItemsProps {
    [k: string]: any;
  }
  
}

export namespace customer {
  export interface CustomerProps {
    customerId: string;
    name: string;
  }
  
}
