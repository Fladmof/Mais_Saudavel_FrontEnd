import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusBadge, ESTADOS_CONSULTA } from './StatusBadge';
import { colors, racioContraste } from '../theme';

test('cada estado tem rótulo em PT-PT, ícone e par de cores AA', () => {
  Object.entries(ESTADOS_CONSULTA).forEach(([nome, def]) => {
    expect(def.rotulo.length).toBeGreaterThan(0);
    expect(def.icone.length).toBeGreaterThan(0);
    expect(`${nome}:${racioContraste(def.tinta, def.fundo) >= 4.5}`).toBe(`${nome}:true`);
  });
});

test('mostra o rótulo em texto — nunca só a cor', () => {
  const { getByText } = render(<StatusBadge estado="em_curso" />);
  expect(getByText('Em curso')).toBeTruthy();
});

// O teste de contraste acima garante legibilidade (o par tinta/fundo cumpre
// 4.5:1), mas não garante semântica: se alguém trocasse, por exemplo, as
// tintas de "concluida" e "cancelada", os pares continuariam válidos a
// título individual e aquele teste continuaria a passar — apesar de "verde"
// passar a significar cancelado. Este teste amarra cada estado ao seu
// próprio token para apanhar esse tipo de troca.
test('cada estado está amarrado ao token semântico correto', () => {
  expect(ESTADOS_CONSULTA.agendada.tinta).toBe(colors.info);
  expect(ESTADOS_CONSULTA.agendada.fundo).toBe(colors.infoSurface);
  expect(ESTADOS_CONSULTA.em_curso.tinta).toBe(colors.warning);
  expect(ESTADOS_CONSULTA.em_curso.fundo).toBe(colors.warningSurface);
  expect(ESTADOS_CONSULTA.concluida.tinta).toBe(colors.success);
  expect(ESTADOS_CONSULTA.concluida.fundo).toBe(colors.successSurface);
  expect(ESTADOS_CONSULTA.cancelada.tinta).toBe(colors.danger);
  expect(ESTADOS_CONSULTA.cancelada.fundo).toBe(colors.dangerSurface);
});
