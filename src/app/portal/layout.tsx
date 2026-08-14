import { PortalAuthProvider } from "@/lib/portal/auth";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalAuthProvider>{children}</PortalAuthProvider>;
}
