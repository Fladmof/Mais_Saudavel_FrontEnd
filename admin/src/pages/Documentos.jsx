// Validacao de documentos de conta (BI frente/verso + foto pessoal).
// GET /documentos/pendentes?estado=  |  PATCH /documentos/:id/validar
import { useCallback, useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const TIPO = {
  bi_frente: 'BI — frente',
  bi_verso: 'BI — verso',
  foto_pessoal: 'Foto pessoal',
};

const ESTADO_BADGE = {
  pendente: 'badge-cinza',
  aprovado: 'badge-verde',
  rejeitado: 'badge-vermelho',
};

const FILTROS = ['pendente', 'aprovado', 'rejeitado'];

export default function Documentos() {
  const [lista, setLista] = useState([]);
  const [filtro, setFiltro] = useState('pendente');
  const [erro, setErro] = useState('');
  const [aValidar, setAValidar] = useState(null); // id em processamento
  const [preview, setPreview] = useState(null); // url em preview

  const carregar = useCallback(() => {
    apiClient.get(`/documentos/pendentes?estado=${filtro}`)
      .then((r) => { setLista(r.data.data.documentos); setErro(''); })
      .catch((e) => setErro(e.response?.data?.message || e.message));
  }, [filtro]);

  useEffect(() => { carregar(); }, [carregar]);

  const urlFicheiro = (doc) => {
    const base = apiClient.defaults.baseURL || '';
    return doc.ficheiro_url.startsWith('http') ? doc.ficheiro_url : `${base}${doc.ficheiro_url}`;
  };

  const validar = async (doc, estado) => {
    let motivo_rejeicao;
    if (estado === 'rejeitado') {
      motivo_rejeicao = window.prompt('Motivo da rejeição (obrigatório):');
      if (!motivo_rejeicao) return;
    }
    setAValidar(doc.id);
    try {
      await apiClient.patch(`/documentos/${doc.id}/validar`, { estado, motivo_rejeicao });
      carregar();
    } catch (e) {
      setErro(e.response?.data?.message || e.message);
    } finally {
      setAValidar(null);
    }
  };

  return (
    <div>
      <h1 className="page-titulo">Validação de documentos</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {FILTROS.map((f) => (
          <button
            key={f}
            className={filtro === f ? 'btn-verde' : 'btn-neutro'}
            onClick={() => setFiltro(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}s
          </button>
        ))}
      </div>

      {erro && <div className="card" style={{ marginBottom: 16, color: 'var(--vermelho)' }}>Erro: {erro}</div>}

      <div className="tabela-wrap">
        <table>
          <thead>
            <tr><th>Utilizador</th><th>Tipo</th><th>Documento</th><th>Estado</th><th>Enviado</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {lista.map((doc) => (
              <tr key={doc.id}>
                <td>
                  {doc.user?.nome || '—'}
                  <div style={{ color: 'var(--cinza-claro)', fontSize: 12 }}>{doc.user?.email}</div>
                </td>
                <td>{TIPO[doc.tipo] || doc.tipo}</td>
                <td>
                  <a href={urlFicheiro(doc)} target="_blank" rel="noreferrer" onClick={(e) => { e.preventDefault(); setPreview(urlFicheiro(doc)); }}>
                    Ver ficheiro
                  </a>
                </td>
                <td>
                  <span className={`badge ${ESTADO_BADGE[doc.estado] || 'badge-cinza'}`}>{doc.estado}</span>
                  {doc.estado === 'rejeitado' && doc.motivo_rejeicao ? (
                    <div style={{ color: 'var(--cinza-claro)', fontSize: 12 }}>{doc.motivo_rejeicao}</div>
                  ) : null}
                </td>
                <td>{doc.createdAt ? new Date(doc.createdAt).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</td>
                <td>
                  {doc.estado === 'pendente' ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-verde" style={{ padding: '8px 14px', borderRadius: 8 }} disabled={aValidar === doc.id} onClick={() => validar(doc, 'aprovado')}>
                        Aprovar
                      </button>
                      <button className="btn-perigo" disabled={aValidar === doc.id} onClick={() => validar(doc, 'rejeitado')}>
                        Rejeitar
                      </button>
                    </div>
                  ) : '—'}
                </td>
              </tr>
            ))}
            {lista.length === 0 && !erro && (
              <tr><td colSpan="6" style={{ color: 'var(--cinza-claro)' }}>Sem documentos {filtro}s.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 50, cursor: 'zoom-out',
          }}
        >
          <img src={preview} alt="Documento" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}
