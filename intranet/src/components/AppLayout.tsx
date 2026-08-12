import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-icc-mist">
      <Sidebar />
      <div className="flex-1">
        <Header titre={titre} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
