import fs from 'fs';
import path from 'path';

const RAIZ = path.resolve(__dirname, '..');

// Pastas varridas por inteiro, recursivamente.
const PASTAS_COBERTAS = ['src/components', 'app'];

// Ficheiros avulsos cobertos. Cada vaga de propagação acrescenta os seus à
// medida que os migra, para o lint nunca ficar vermelho à espera de trabalho.
const FICHEIROS_COBERTOS: string[] = [
  // Fase 2, vaga 1 — tabs do utente
  'src/features/utente/AlertasScreen.tsx',
  'src/features/utente/ConsultasScreen.tsx',
  'src/features/utente/HistoricoScreen.tsx',
];

// O primitivo Touchable é o único sítio onde TouchableOpacity é legítimo.
const ISENTOS_TOUCHABLE = ['src/components/Touchable.tsx'];

function tsxRecursivo(dir: string): string[] {
  const absoluto = path.join(RAIZ, dir);
  if (!fs.existsSync(absoluto)) return [];
  return fs.readdirSync(absoluto, { withFileTypes: true }).flatMap((entrada) => {
    const relativo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) return tsxRecursivo(relativo);
    return /\.tsx$/.test(entrada.name) && !/\.test\.tsx$/.test(entrada.name) ? [relativo] : [];
  });
}

function ficheirosCobertos(): string[] {
  return [...PASTAS_COBERTAS.flatMap(tsxRecursivo), ...FICHEIROS_COBERTOS];
}

// Comentários ficam de fora: as tabelas de rácio e as notas de decisão vivem lá.
function linhasDe(relativo: string): { n: number; texto: string }[] {
  return fs
    .readFileSync(path.join(RAIZ, relativo), 'utf8')
    .split('\n')
    .map((texto, i) => ({ n: i + 1, texto }))
    .filter(({ texto }) => !/^\s*(\/\/|\*|\/\*)/.test(texto));
}

test('a lista de ficheiros cobertos não está vazia', () => {
  // Guarda contra um erro de caminho silencioso: se `RAIZ` ficar errado, os
  // outros quatro testes passariam por não terem nada para verificar.
  expect(ficheirosCobertos().length).toBeGreaterThan(10);
});

test('nenhum ficheiro coberto declara cores hex — só tokens', () => {
  const infratores: string[] = [];
  ficheirosCobertos().forEach((f) => {
    linhasDe(f).forEach(({ n, texto }) => {
      if (/#[0-9a-fA-F]{3,8}\b/.test(texto)) infratores.push(`${f}:${n} → ${texto.trim()}`);
    });
  });
  expect(infratores).toEqual([]);
});

test('nenhum ficheiro coberto usa espaçamento fora da grelha de 4', () => {
  const propriedade = /(margin|padding|gap|borderRadius)[A-Za-z]*:\s*(\d+)/g;
  const infratores: string[] = [];
  ficheirosCobertos().forEach((f) => {
    linhasDe(f).forEach(({ n, texto }) => {
      for (const m of texto.matchAll(propriedade)) {
        const valor = Number(m[2]);
        if (valor > 0 && valor % 4 !== 0) infratores.push(`${f}:${n} → ${m[0]}`);
      }
    });
  });
  expect(infratores).toEqual([]);
});

test('nenhum ficheiro coberto usa emoji ou glifos como ícone', () => {
  const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u;
  const infratores: string[] = [];
  ficheirosCobertos().forEach((f) => {
    linhasDe(f).forEach(({ n, texto }) => {
      if (emoji.test(texto)) infratores.push(`${f}:${n} → ${texto.trim()}`);
    });
  });
  expect(infratores).toEqual([]);
});

test('nenhum ficheiro coberto usa TouchableOpacity diretamente', () => {
  const infratores = ficheirosCobertos()
    .filter((f) => !ISENTOS_TOUCHABLE.includes(f))
    .filter((f) => /TouchableOpacity/.test(fs.readFileSync(path.join(RAIZ, f), 'utf8')));
  expect(infratores).toEqual([]);
});

test('nenhum ficheiro coberto usa action ou primary como cor de texto', () => {
  // `color:` é minúsculo; `backgroundColor:`, `borderColor:` e `tintColor:`
  // têm C maiúsculo e por isso não são apanhados — são usos legítimos
  // (preenchimento, borda, ícone), onde o limiar aplicável é 3:1.
  // Captura o VALOR da propriedade, para apanhar também as formas ternárias:
  //   color: ativo ? colors.white : colors.primary
  const propCor = /(?:^|[^a-zA-Z])color:\s*([^,;}\n]+)/g;
  const infratores: string[] = [];
  ficheirosCobertos().forEach((f) => {
    linhasDe(f).forEach(({ n, texto }) => {
      for (const m of texto.matchAll(propCor)) {
        if (/colors\.(action|primary)\b/.test(m[1])) {
          infratores.push(`${f}:${n} → ${texto.trim()}`);
        }
      }
    });
  });
  expect(infratores).toEqual([]);
});
