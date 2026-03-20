import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import MenuManager from "./MenuManager";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const menuItems = await prisma.menuItem.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>Admin Dashboard</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        <section className="card">
          <MenuManager initialItems={menuItems} />
        </section>
        
        <section className="card">
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Orders & Export</h2>
          <p style={{ marginBottom: "1rem", color: "#64748b" }}>Export all orders to Excel. Ensure you have reviewed the orders before exporting.</p>
          <a href="/api/admin/export" target="_blank" className="button" style={{ backgroundColor: "var(--success)" }}>
            Export Orders to Excel
          </a>
        </section>
      </div>
    </main>
  );
}
