import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TabSwitch } from './TabSwitch';

describe('TabSwitch', () => {
  it('mostra as duas opcoes e comuta ao tocar', async () => {
    const onChange = jest.fn();
    const r = await render(<TabSwitch options={['Entrar', 'Criar conta']} value={0} onChange={onChange} />);
    expect(r.getByText('Entrar')).toBeTruthy();
    fireEvent.press(r.getByText('Criar conta'));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
