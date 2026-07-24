import { imcDe, idadeDe, factorRhDe } from './saude';

describe('saude', () => {
  it('calcula IMC = peso/altura²', () => {
    expect(imcDe(70, 1.75)).toBe('22.9');
    expect(imcDe(0, 1.75)).toBe('—');
    expect(imcDe(70, 0)).toBe('—');
  });
  it('deriva o factor RH do grupo sanguíneo', () => {
    expect(factorRhDe('A+')).toBe('Positivo');
    expect(factorRhDe('O-')).toBe('Negativo');
    expect(factorRhDe('')).toBe('');
  });
  it('idadeDe devolve — para datas inválidas', () => {
    expect(idadeDe(undefined)).toBe('—');
    expect(idadeDe('not-a-date')).toBe('—');
  });
});
