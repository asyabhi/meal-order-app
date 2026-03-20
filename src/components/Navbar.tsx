"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "1rem 2rem", 
      backgroundColor: "var(--card)", 
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 10
    }}>
      <div style={{ fontWeight: "bold", fontSize: "1.25rem", color: "var(--primary)" }}>
        <Link href="/">MealOrderApp</Link>
      </div>
      
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {status === "authenticated" ? (
          <>
            <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
              Welcome, {session.user?.name}
            </span>
            
            {session.user?.role === "ADMIN" ? (
              <Link href="/admin" className="button" style={{ backgroundColor: "#1e293b" }}>Admin</Link>
            ) : (
              <Link href="/dashboard" className="button" style={{ backgroundColor: "#1e293b" }}>Menu</Link>
            )}
            
            <button 
              onClick={() => signOut({ callbackUrl: "/" })} 
              className="button"
              style={{ backgroundColor: "var(--danger)" }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="button" style={{ backgroundColor: "transparent", color: "var(--foreground)", border: "1px solid var(--border)" }}>Login</Link>
            <Link href="/register" className="button">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
