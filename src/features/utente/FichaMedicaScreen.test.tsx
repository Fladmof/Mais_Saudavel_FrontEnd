import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { FichaMedicaScreen } from './FichaMedicaScreen';
import { utenteService } from '../../services/utenteService';
import { consultaService } from '../../services/consultaService';
import { clinicoService } from '../../services/clinicoService';
import { documentoService } from '../../services/documentoService';

jest.mock('../../services/utenteService');
jest.mock('../../services/consultaService');
jest.mock('../../services/clinicoService');
jest.mock('../../services/documentoService');
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ signOut: jest.fn() }),
}));
jest.mock('expo-router', () => ({
  useFocusEffect: (cb: () => void) => cb(),
  useRouter: () => ({ push: jest.fn() }),
}));

// O ecrã chama 4 serviços no arranque; qualquer um por mockar rebenta o render.
// fetchMeuPerfil devolve `{ utente }` (ver utenteService.ts), não `{ perfil }`.
// estadoValidacao devolve `{ validacaoCompleta }` (ver documentoService.ts), não `{ validado }`.
beforeEach(() => {
  (utenteService.fetchMeuPerfil as jest.Mock).mockResolvedValue({
    ok: true,
    data: { utente: { id: 1, user: { nome: 'Ana' } } },
  });
  (consultaService.minhasConsultas as jest.Mock).mockResolvedValue({ ok: true, data: { consultas: [] } });
  (clinicoService.listarAlergias as jest.Mock).mockResolvedValue({ ok: true, data: { alergias: [] } });
  (clinicoService.listarCondicoes as jest.Mock).mockResolvedValue({ ok: true, data: { condicoes: [] } });
  (documentoService.estadoValidacao as jest.Mock).mockResolvedValue({
    ok: true,
    data: { documentos: [], validacaoCompleta: true, tiposEmFalta: [] },
  });
});

test('o atalho para o histórico de calorias descreve a ação', async () => {
  const { getByLabelText } = render(<FichaMedicaScreen />);
  // Era um `→` de texto: um glifo não é anunciado como ação por leitores de ecrã.
  await waitFor(() => expect(getByLabelText(/histórico de calorias/i)).toBeTruthy());
});

test('mostra o banner "Validar conta" no topo quando a conta está pendente', async () => {
  (documentoService.estadoValidacao as jest.Mock).mockResolvedValue({
    ok: true,
    data: { documentos: [], validacaoCompleta: false, tiposEmFalta: ['bi_frente'] },
  });
  const { findByText } = render(<FichaMedicaScreen />);
  expect(await findByText('Validar conta')).toBeTruthy();
});

test('a conta validada anuncia-se por texto, não só pelo ícone', async () => {
  const { getByText } = render(<FichaMedicaScreen />);
  // Era o glifo `✓ Validada`; passa a Icon + Text, dois portadores.
  await waitFor(() => expect(getByText('Validada')).toBeTruthy());
});

test('tocar numa consulta agendada explica porque ainda não se pode entrar', async () => {
  // Ao trocar a pílula por StatusBadge perdeu-se o alerta "Ainda não começou".
  // O StatusBadge é envolvido num Touchable que o restitui — informação útil
  // para quem aguarda a teleconsulta.
  (consultaService.minhasConsultas as jest.Mock).mockResolvedValue({
    ok: true,
    data: {
      consultas: [
        { id: 3, estado: 'agendada', data_hora: '2026-07-25T09:00:00Z', medico: { user: { nome: 'Rui Sá' } } },
      ],
    },
  });
  const alertSpy = jest.spyOn(Alert, 'alert');
  const { getByLabelText } = render(<FichaMedicaScreen />);
  const alvo = await waitFor(() => getByLabelText(/A teleconsulta abre quando o médico a iniciar/i));
  // Não basta o Touchable existir: premi-lo tem de disparar o alerta —
  // se o onPress for removido, este teste falha.
  fireEvent.press(alvo);
  expect(alertSpy).toHaveBeenCalledWith('Ainda não começou', expect.stringMatching(/quando o médico a iniciar/i));
  alertSpy.mockRestore();
});
