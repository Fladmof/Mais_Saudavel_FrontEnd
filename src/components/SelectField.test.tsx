import React from 'react';
import { render } from '@testing-library/react-native';
import { SelectField } from './SelectField';
import { colors, spacing, racioContraste } from '../theme';

// A borda do campo não vive no mesmo nó que o accessibilityLabel: o rótulo
// está no Picker, a borda está na View que o envolve (ver SelectField.tsx).
// Por isso, ao contrário do TextField.test.tsx (onde um único nó carrega
// tudo), aqui procuramos na árvore a View com `borderWidth` definido — é
// robusto a diferenças de nesting interno do Picker entre plataformas.
function limiteDoCampo(root: { findAll: (predicado: (no: unknown) => boolean) => { props: { style: unknown } }[] }) {
  const [limite] = root.findAll(
    (no) => (no as { type: unknown }).type === 'View' && (no as { props: { style?: { borderWidth?: number } } }).props.style?.borderWidth !== undefined,
  );
  return limite.props.style as Record<string, unknown>;
}

test('o campo é rotulado para leitores de ecrã', () => {
  const { getByLabelText } = render(
    <SelectField label="Especialidade" value="" onValueChange={() => {}} options={['Cardiologia']} />,
  );
  expect(getByLabelText('Especialidade')).toBeTruthy();
});

test('o limite em repouso cumpre 3:1', () => {
  const { UNSAFE_root } = render(
    <SelectField label="Especialidade" value="" onValueChange={() => {}} options={['Cardiologia']} />,
  );
  const cor = limiteDoCampo(UNSAFE_root).borderColor as string;
  expect(racioContraste(cor, colors.surface)).toBeGreaterThanOrEqual(3);
});

test('o erro é comunicado por texto, e não apenas por cor', () => {
  const { getByText } = render(
    <SelectField
      label="Especialidade"
      value=""
      onValueChange={() => {}}
      options={['Cardiologia']}
      error="Selecione uma especialidade"
    />,
  );
  expect(getByText('Selecione uma especialidade')).toBeTruthy();
});

test('respeita o alvo de toque mínimo', () => {
  const { UNSAFE_root } = render(
    <SelectField label="Especialidade" value="" onValueChange={() => {}} options={['Cardiologia']} />,
  );
  expect(limiteDoCampo(UNSAFE_root).minHeight).toBe(spacing.touchMin);
});

// Sobre o teste de foco condicional por plataforma (achado 2 da revisão):
// tentei mutar `Platform.OS` (react-native) à volta do render para exercitar
// os dois ramos do SelectField (Android com `borderFocus`, iOS em repouso).
// A mutação em si é inofensiva, mas o *render* do Picker com
// `Platform.OS === 'android'` neste ambiente jest-expo lança uma exceção
// (`thrown: null`) de forma não determinística — o mock do native view
// config do RNCPicker é resolvido para iOS no arranque do worker e não
// acompanha a mutação em runtime. Não é um teste fiável, pelo que, seguindo
// a instrução do brief, fica de fora em vez de simulado com um mock a fingir
// fiabilidade que não existe. O comportamento condicional (Platform.OS ===
// 'android') está coberto por leitura de código em SelectField.tsx.
