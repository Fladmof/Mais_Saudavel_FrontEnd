import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Touchable } from './Touchable';

test('expõe a etiqueta e o papel de acessibilidade', () => {
  const { getByLabelText } = render(
    <Touchable accessibilityLabel="Marcar consulta" onPress={() => {}}>
      <Text>Marcar</Text>
    </Touchable>,
  );
  const alvo = getByLabelText('Marcar consulta');
  expect(alvo.props.accessibilityRole).toBe('button');
});

test('garante alvo de toque de 48 dp', () => {
  const { getByLabelText } = render(
    <Touchable accessibilityLabel="Fechar" onPress={() => {}}>
      <Text>x</Text>
    </Touchable>,
  );
  const estilo = getByLabelText('Fechar').props.style;
  const achatado = Array.isArray(estilo) ? Object.assign({}, ...estilo.flat()) : estilo;
  expect(achatado.minHeight).toBe(48);
  expect(achatado.minWidth).toBe(48);
});

test('dispara onPress', () => {
  const onPress = jest.fn();
  const { getByLabelText } = render(
    <Touchable accessibilityLabel="Guardar" onPress={onPress}>
      <Text>Guardar</Text>
    </Touchable>,
  );
  fireEvent.press(getByLabelText('Guardar'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('não dispara onPress quando desativado ou ocupado', () => {
  const onPress = jest.fn();
  const { getByLabelText, rerender } = render(
    <Touchable accessibilityLabel="Guardar" onPress={onPress} disabled>
      <Text>Guardar</Text>
    </Touchable>,
  );
  fireEvent.press(getByLabelText('Guardar'));
  expect(onPress).not.toHaveBeenCalled();

  rerender(
    <Touchable accessibilityLabel="Guardar" onPress={onPress} busy>
      <Text>Guardar</Text>
    </Touchable>,
  );
  fireEvent.press(getByLabelText('Guardar'));
  expect(onPress).not.toHaveBeenCalled();
});

test('comunica o estado a leitores de ecrã', () => {
  const { getByLabelText } = render(
    <Touchable
      accessibilityLabel="Separador Ficha"
      accessibilityRole="tab"
      selected
      onPress={() => {}}
    >
      <Text>Ficha</Text>
    </Touchable>,
  );
  const alvo = getByLabelText('Separador Ficha');
  expect(alvo.props.accessibilityState).toMatchObject({ selected: true, disabled: false });
});

test('alvoMinimo=false dispensa o tamanho mínimo mas mantém hitSlop', () => {
  const { getByLabelText } = render(
    <Touchable accessibilityLabel="Remover" alvoMinimo={false} onPress={() => {}}>
      <Text>–</Text>
    </Touchable>,
  );
  const alvo = getByLabelText('Remover');
  const estilo = alvo.props.style;
  const achatado = Array.isArray(estilo) ? Object.assign({}, ...estilo.flat()) : estilo;
  expect(achatado.minHeight).toBeUndefined();
  expect(alvo.props.hitSlop).toBeDefined();
});
