import { get, post, del } from '../api/http';
import { endpoints } from '../api/endpoints';
import { RegistoCalorias, TipoRefeicao } from '../api/types';

/**
 * Regista uma refeição. A estimativa segue a ordem do backend:
 * calorias manuais > IA sobre a foto (se configurada) > tabela local por descrição.
 */
function registarRefeicao(campos: {
  tipo_refeicao: TipoRefeicao;
  descricao?: string;
  fotoUri?: string;
  calorias_total?: number;
  alimentos?: string[];
}) {
  const form = new FormData();
  form.append('tipo_refeicao', campos.tipo_refeicao);
  if (campos.descricao) form.append('descricao', campos.descricao);
  if (campos.calorias_total) form.append('calorias_total', String(campos.calorias_total));
  if (campos.alimentos?.length) form.append('alimentos', JSON.stringify(campos.alimentos));
  if (campos.fotoUri) {
    form.append('foto', { uri: campos.fotoUri, name: `refeicao-${Date.now()}.jpg`, type: 'image/jpeg' } as any);
  }
  return post<{ registo: RegistoCalorias }>(endpoints.calorias, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

function historico(periodo: 'hoje' | 'semana' | 'mes' | 'tudo') {
  return get<{ registos: RegistoCalorias[]; totalCalorias: number; periodo: string }>(
    endpoints.caloriasHistorico(periodo)
  );
}

function apagar(id: number | string) {
  return del(endpoints.caloriaRegisto(id));
}

export const caloriasService = { registarRefeicao, historico, apagar };
