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
  
  // Find if user already ordered today
  const existingOrder = await prisma.order.findFirst({
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
      
      {existingOrder && (
        <div className="card" style={{ backgroundColor: "#dcfce7", borderColor: "#86efac", textAlign: "center", padding: "1.5rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#166534", marginBottom: "0.5rem" }}>✅ Order Confirmed!</h2>
          <p style={{ color: "#166534", fontSize: "1.1rem" }}>You ordered: <strong>{existingOrder.menuItem.name}</strong></p>
          <p style={{ fontSize: "0.875rem", color: "#15803d", marginTop: "0.5rem" }}>Your order was placed at {new Date(existingOrder.orderTime).toLocaleTimeString()}.</p>
        </div>
      )}
      
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Today&apos;s Menu</h2>
      <MenuDisplay items={menuItems} today={today} hasOrdered={!!existingOrder} />
    </main>
  );
}
