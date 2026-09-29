import React from "react";
import { EmptyState } from "../ui/EmptyState";
import { ShoppingBag } from "lucide-react";

export function EmptyCart() {
  return (
    <EmptyState
      icon={<ShoppingBag className="w-8 h-8" />}
      title="Your shopping cart is empty"
      description="Explore high-performance laptops, flagships, and gadgets curated by our intelligent agents."
      actionText="Start Shopping"
      actionHref="/shop"
    />
  );
}

export default EmptyCart;
