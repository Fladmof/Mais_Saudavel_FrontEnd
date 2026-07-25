import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { ConsultasScreen } from './ConsultasScreen';
import { consultaService } from '../../services/consultaService';
import { documentoService } from '../../services/documentoService';

const mockPush = jest.fn();
jest.mock('../../services/consultaService');
jest.mock('../../services/documentoService');
jest.mock('expo-router', () => ({
  useFocusEffect: (cb: () => void) => cb(),
  useRouter: () => ({ push: mockPush }),
}));

const mockListar = consultaService.minhasConsultas as jest.Mock;
const mockValidacao = documentoService.estadoValidacao as jest.Mock;

beforeEach(() => {
  mockPush.mockClear();
  // Conta validada por omissão; cada teste sobrepõe se precisar do gate.
  mockValidacao.mockResolvedValue({ ok: true, data: { validacaoCompleta: true } });
});

test('sem consultas, o vazio oferece a saída certa', async () => {
  mockListar.mockResolvedValue({ ok: true, data: { consultas: [] } });
  const { getByText, queryByText } = render(<ConsultasScreen />);
  await waitFor(() => expect(getByText('Ainda não tem consultas marcadas')).toBeTruthy());
  // Um vazio acionável leva botão; o de "Alertas" não leva, porque não ter
  // alertas é boa notícia.
  expect(getByText('Marcar consulta')).toBeTruthy();
  // Uma só ação primária: o botão de topo "Marcar nova consulta" desaparece no
  // vazio para não empilhar dois CTA verdes iguais com o do EmptyState.
  expect(queryByText('Marcar nova consulta')).toBeNull();
});

test('o estado da consulta é anunciado por texto, não só por cor', async () => {
  mockListar.mockResolvedValue({
    ok: true,
    data: {
      consultas: [
        { id: 7, estado: 'em_curso', data_hora: '2026-07-20T10:00:00Z', medico: { user: { nome: 'Ana Dias' } } },
      ],
    },
  });
  const { getByText, queryByText } = render(<ConsultasScreen />);
  // Vem do StatusBadge, não de um mapa de cores local.
  await waitFor(() => expect(getByText('Em curso')).toBeTruthy());
  // Com consultas, o CTA é o botão de topo; o EmptyState não aparece — mantém-se
  // uma só ação primária (a outra direção do invariante).
  expect(getByText('Marcar nova consulta')).toBeTruthy();
  expect(queryByText('Ainda não tem consultas marcadas')).toBeNull();
});

test('bloqueia a marcação e leva à validação quando a conta não está validada', async () => {
  mockListar.mockResolvedValue({
    ok: true,
    data: {
      consultas: [
        { id: 7, estado: 'em_curso', data_hora: '2026-07-20T10:00:00Z', medico: { user: { nome: 'Ana Dias' } } },
      ],
    },
  });
  mockValidacao.mockResolvedValue({ ok: true, data: { validacaoCompleta: false } });
  const { findByText } = render(<ConsultasScreen />);
  fireEvent.press(await findByText('Marcar nova consulta'));
  // Conta por validar: em vez de /agendar, encaminha para a validação.
  await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/validacao-conta'));
});

test('conta validada: a marcação segue para /agendar', async () => {
  mockListar.mockResolvedValue({
    ok: true,
    data: {
      consultas: [
        { id: 7, estado: 'em_curso', data_hora: '2026-07-20T10:00:00Z', medico: { user: { nome: 'Ana Dias' } } },
      ],
    },
  });
  mockValidacao.mockResolvedValue({ ok: true, data: { validacaoCompleta: true } });
  const { findByText } = render(<ConsultasScreen />);
  fireEvent.press(await findByText('Marcar nova consulta'));
  await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/agendar'));
});
