import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusBadge, ESTADOS_CONSULTA } from './StatusBadge';
import { racioContraste } from '../theme';

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
