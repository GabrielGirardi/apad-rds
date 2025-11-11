import { ReactNode } from "react";
import { canAccess, Role, Action } from "@/lib/permissions";

interface CanViewProps {
  role: Role;
  action: Action;
  children: ReactNode;
}

export function CanView({ role, action, children }: CanViewProps) {
  if (!canAccess(role, action)) return null;
  return <>{children}</>;
}
