// Página reservada para secções sem backend (Pagamentos, Relatórios, etc.).
export default function Placeholder({ titulo, descricao }) {
  return (
    <div>
      <h1 className="page-titulo">{titulo}</h1>
      <div className="placeholder">
        <h2>Em breve</h2>
        <p>{descricao || 'Esta secção ainda não está disponível.'}</p>
      </div>
    </div>
  );
}
