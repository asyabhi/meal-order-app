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

export default function MenuManager({ initialItems }: { initialItems: MenuItem[] }) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isVegan, setIsVegan] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, isVegan, isGlutenFree })
    });
    
    if (res.ok) {
      const newItem = await res.json();
      setItems([...items, newItem]);
      setName("");
      setDescription("");
      setIsVegan(false);
      setIsGlutenFree(false);
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter(item => item.id !== id));
      router.refresh();
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Manage Menu</h2>
      
      <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#f8fafc", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <div>
           <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>Meal Name</label>
           <input value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: "0.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius)" }} />
        </div>
        <div>
           <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>Description</label>
           <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{ width: "100%", padding: "0.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", minHeight: "80px" }} />
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}><input type="checkbox" checked={isVegan} onChange={e => setIsVegan(e.target.checked)} /> Vegan</label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}><input type="checkbox" checked={isGlutenFree} onChange={e => setIsGlutenFree(e.target.checked)} /> Gluten-Free</label>
        </div>
        <button type="submit" className="button" style={{ marginTop: "0.5rem" }}>Add Item</button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {items.map(item => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1rem", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
            <div>
              <h3 style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>{item.name}</h3>
              <p style={{ fontSize: "0.875rem", color: "#64748b" }}>{item.description}</p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                {item.isVegan && <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "1rem", fontWeight: "500" }}>Vegan</span>}
                {item.isGlutenFree && <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", backgroundColor: "#fef08a", color: "#854d0e", borderRadius: "1rem", fontWeight: "500" }}>Gluten-Free</span>}
              </div>
            </div>
            <button onClick={() => handleDelete(item.id)} className="button" style={{ backgroundColor: "var(--danger)", padding: "0.5rem" }}>Delete</button>
          </div>
        ))}
        {items.length === 0 && <p style={{ color: "#64748b", fontStyle: "italic" }}>No menu items found. Add some above!</p>}
      </div>
    </div>
  );
}
