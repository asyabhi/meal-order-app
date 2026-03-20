import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MenuDisplay from "./MenuDisplay";

export const dynamic = 'force-dynamic';

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Get today's local date string (for a simple check)
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  
  // Find user's orders for today
  const existingOrders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      date: today
    },
    include: {
      menuItem: true
    }
  });

  const menuItems = await prisma.menuItem.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });

  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>Menu & Ordering</h1>
      
      {existingOrders.length > 0 && (
        <div className="card" style={{ backgroundColor: "#dcfce7", borderColor: "#86efac", textAlign: "center", padding: "1.5rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#166534", marginBottom: "1rem" }}>✅ Confirmed Orders</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
            {existingOrders.map((order: { id: string, orderTime: Date | string, menuItem: { name: string, category: string } }) => (
              <div key={order.id} style={{ display: "flex", flexDirection: "column", padding: "0.5rem 1rem", backgroundColor: "#bbf7d0", borderRadius: "0.5rem", width: "100%", maxWidth: "400px" }}>
                <span style={{ color: "#166534", fontSize: "1.1rem" }}><strong>{order.menuItem.name}</strong> <span style={{fontSize: "0.8rem", opacity: 0.8}}>({order.menuItem.category || "Food"})</span></span>
                <span style={{ fontSize: "0.875rem", color: "#15803d" }}>Ordered at {new Date(order.orderTime).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Today&apos;s Menu</h2>
      <MenuDisplay 
        items={menuItems} 
        today={today} 
        orderedCategories={existingOrders.map((o: { menuItem: { category: string } }) => o.menuItem.category || "Food")} 
        orderedItemIds={existingOrders.map((o: { menuItemId: string }) => o.menuItemId)} 
      />
    </main>
  );
}
