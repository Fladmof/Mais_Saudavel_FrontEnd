// Mais_Saudavel_FrontEnd/admin/src/components/StatCard.jsx
export default function StatCard({ titulo, valor }) {
  return (
    <div className="card" style={{ minWidth: 160 }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--verde)' }}>{valor}</div>
      <div style={{ color: 'var(--cinza-claro)' }}>{titulo}</div>
    </div>
  );
}
