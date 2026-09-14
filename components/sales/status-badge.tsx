import React from "react";
import { Badge } from "../ui/badge";

interface StatusBadgeProps {
  status: "Completed" | "Refunded" | "Pending" | "Failed" | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "Completed":
      return <Badge variant="emerald" className="px-3 py-1 text-xs">Completed</Badge>;
    case "Refunded":
      return <Badge variant="red" className="px-3 py-1 text-xs">Refunded</Badge>;
    case "Pending":
      return <Badge variant="gold" className="px-3 py-1 text-xs">Pending</Badge>;
    case "Failed":
      return <Badge variant="gray" className="px-3 py-1 text-xs">Failed</Badge>;
    default:
      return <Badge variant="outline" className="px-3 py-1 text-xs">{status}</Badge>;
  }
}
