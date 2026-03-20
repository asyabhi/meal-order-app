import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '32rem', width: '100%', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2rem', fontWeight: 'bold' }}>Meal Order App</h1>
        <p style={{ marginBottom: '2rem', color: '#64748b' }}>
          Welcome to the company meal ordering portal. Please log in to view the menu and place your order.
        </p>
        <Link href="/login" className="button" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
          Log In
        </Link>
      </div>
    </main>
  );
}
