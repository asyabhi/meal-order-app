"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  isVegan: boolean;
  isGlutenFree: boolean;
};

export default function MenuDisplay({ items, today, hasOrdered = false, orderedItemId }: { items: MenuItem[], today: string, hasOrdered?: boolean, orderedItemId?: string }) {
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleOrder = async (menuItemId: string) => {
    if (!confirm("Are you sure you want to order this meal for today?")) return;
    setLoading(true);
    setLoadingId(menuItemId);
    
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId, date: today })
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to place order.");
      setLoading(false);
      setLoadingId(null);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
      {items.map(item => (
        <div key={item.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{item.name}</h3>
            <p style={{ color: "#64748b", marginBottom: "1rem", minHeight: "3rem" }}>{item.description}</p>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {item.isVegan && <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "1rem", fontWeight: "600" }}>Vegan</span>}
              {item.isGlutenFree && <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", backgroundColor: "#fef08a", color: "#854d0e", borderRadius: "1rem", fontWeight: "600" }}>Gluten-Free</span>}
            </div>
          </div>
          <button 
            onClick={() => handleOrder(item.id)} 
            disabled={loading || hasOrdered}
            className="button" 
            style={{ width: "100%", padding: "0.75rem", opacity: (loading && loadingId !== item.id) || hasOrdered ? 0.5 : 1, cursor: hasOrdered ? "not-allowed" : "pointer" }}
          >
            {hasOrdered ? (orderedItemId === item.id ? "Already Ordered" : "Limit Reached") : (loading && loadingId === item.id ? "Ordering..." : "Order This Meal")}
          </button>
        </div>
      ))}
      {items.length === 0 && <p style={{ color: "#64748b", fontStyle: "italic", gridColumn: "1 / -1", textAlign: "center" }}>No menu items available for today.</p>}
    </div>
  );
}
