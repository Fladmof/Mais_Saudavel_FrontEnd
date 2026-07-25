import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PacienteDetalheScreen } from './PacienteDetalheScreen';
import { utenteService } from '../../services/utenteService';
import { clinicoService } from '../../services/clinicoService';

jest.mock('../../services/utenteService');
jest.mock('../../services/clinicoService');
jest.mock('expo-router', () => ({
  useFocusEffect: (cb: () => void) => cb(),
  useLocalSearchParams: () => ({ id: '1' }),
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

beforeEach(() => {
  (utenteService.obterUtente as jest.Mock).mockResolvedValue({
    ok: true,
    data: { utente: { id: 1, user: { nome: 'João' }, datanascimento: '1990-01-01', genero: 'Masculino' } },
  });
  (clinicoService.listarMedicacoes as jest.Mock).mockResolvedValue({ ok: true, data: { medicacoes: [] } });
  (clinicoService.listarRegistos as jest.Mock).mockResolvedValue({ ok: true, data: { registos: [] } });
  (clinicoService.listarAlergias as jest.Mock).mockResolvedValue({ ok: true, data: { alergias: [] } });
  (clinicoService.listarCondicoes as jest.Mock).mockResolvedValue({ ok: true, data: { condicoes: [] } });
});

test('usa a grafia PT-PT "Alergia registada" (não "registrada")', async () => {
  const { getByText, queryByText } = render(<PacienteDetalheScreen />);
  await waitFor(() => expect(getByText('Alergia registada')).toBeTruthy());
  expect(queryByText('Alergia registrada')).toBeNull();
});
