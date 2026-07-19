import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
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

test('no iOS, o foco NÃO altera o limite (sem foco falso)', () => {
  const { UNSAFE_root, getByLabelText } = render(
    <SelectField label="Especialidade" value="" onValueChange={() => {}} options={['Cardiologia']} />,
  );
  fireEvent(getByLabelText('Especialidade'), 'focus');
  const estilo = limiteDoCampo(UNSAFE_root);
  // No iOS (plataforma por omissão do Jest neste projeto), o foco não
  // influencia o limite: borderColor fica sempre em borderStrong, e
  // borderWidth permanece 1px (nunca muda para 2px que seria o ramo Android).
  // Este teste garante que não há "foco falso" — comportamento que desviaria
  // à garantia de repouso visual permanente no iOS.
  expect(estilo.borderColor).toBe(colors.borderStrong);
  expect(estilo.borderWidth).toBe(1);
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
// Nota: o ramo iOS é testável diretamente (o teste acima) porque a plataforma
// por omissão do Jest é já iOS neste projeto. O ramo Android exigiria uma
// configuração do Jest com `haste.defaultPlatform: 'android'`, fora do âmbito
// de um teste de componente único.

// Ver a nota em TextField.test.tsx: sem isto, a correção de anúncio de erro
// pode ser revertida sem que nenhum teste acuse.
test('o erro entra no nome acessível do campo', () => {
  const { getByLabelText } = render(
    <SelectField
      label="Especialidade"
      value=""
      onValueChange={() => {}}
      options={['Cardiologia']}
      error="Selecione uma especialidade"
    />,
  );
  expect(getByLabelText('Especialidade. Erro: Selecione uma especialidade')).toBeTruthy();
});
