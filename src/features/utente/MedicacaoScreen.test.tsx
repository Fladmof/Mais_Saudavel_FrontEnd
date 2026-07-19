import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { MedicacaoScreen } from './MedicacaoScreen';
import { clinicoService } from '../../services/clinicoService';
import { consultaService } from '../../services/consultaService';
import { utenteService } from '../../services/utenteService';

jest.mock('../../services/clinicoService');
jest.mock('../../services/consultaService');
jest.mock('../../services/utenteService');
jest.mock('expo-router', () => ({
  useFocusEffect: (cb: () => void) => cb(),
  useRouter: () => ({ push: jest.fn() }),
}));

// O ecrã chama utenteService.fetchMeuPerfil e, com o utente devolvido,
// mais 4 serviços em paralelo; qualquer um por mockar rebenta o render.
// fetchMeuPerfil devolve `{ utente }` (ver utenteService.ts), não `{ perfil }`.
beforeEach(() => {
  (utenteService.fetchMeuPerfil as jest.Mock).mockResolvedValue({ ok: true, data: { utente: { id: 1, nome: 'Ana' } } });
  (clinicoService.listarMedicacoes as jest.Mock).mockResolvedValue({ ok: true, data: { medicacoes: [] } });
  (clinicoService.listarRegistos as jest.Mock).mockResolvedValue({ ok: true, data: { registos: [] } });
  (clinicoService.listarAlergias as jest.Mock).mockResolvedValue({ ok: true, data: { alergias: [] } });
  (clinicoService.listarCondicoes as jest.Mock).mockResolvedValue({ ok: true, data: { condicoes: [] } });
  (consultaService.minhasConsultas as jest.Mock).mockResolvedValue({ ok: true, data: { consultas: [] } });
});

test('sem medicação, o vazio oferece a saída', async () => {
  const { getByText } = render(<MedicacaoScreen />);
  await waitFor(() => expect(getByText('Sem medicação registada')).toBeTruthy());
  expect(getByText('Adicionar medicação')).toBeTruthy();
});

test('sem condições, o vazio oferece a saída para a Ficha', async () => {
  const { getByText } = render(<MedicacaoScreen />);
  await waitFor(() => expect(getByText('Sem condições registadas')).toBeTruthy());
  expect(getByText('Editar na Ficha')).toBeTruthy();
});

test('sem médico assistente, o vazio é só informativo', async () => {
  const { getByText, queryByText } = render(<MedicacaoScreen />);
  await waitFor(() => expect(getByText('Sem médico assistente')).toBeTruthy());
  // Este vazio não leva ação: o utente ainda não tem consulta marcada.
  expect(queryByText('Será associado quando tiver uma consulta marcada.')).toBeTruthy();
});
