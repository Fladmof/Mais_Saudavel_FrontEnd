import fs from 'fs';
import path from 'path';

const PASTA = __dirname;

function ficheirosDeComponente(): string[] {
  return fs
    .readdirSync(PASTA)
    .filter((f) => /\.tsx$/.test(f) && !/\.test\.tsx$/.test(f))
    .map((f) => path.join(PASTA, f));
}

test('nenhum componente declara cores hex — só tokens', () => {
  const infratores: string[] = [];
  ficheirosDeComponente().forEach((ficheiro) => {
    fs.readFileSync(ficheiro, 'utf8')
      .split('\n')
      .forEach((linha, i) => {
        // Ignora comentários (as tabelas de rácio vivem lá).
        if (/^\s*(\/\/|\*|\/\*)/.test(linha)) return;
        if (/#[0-9a-fA-F]{3,8}\b/.test(linha)) {
          infratores.push(`${path.basename(ficheiro)}:${i + 1} → ${linha.trim()}`);
        }
      });
  });
  expect(infratores).toEqual([]);
});

test('nenhum componente usa espaçamento fora da grelha de 4', () => {
  const infratores: string[] = [];
  const propriedade = /(margin|padding|gap|borderRadius)[A-Za-z]*:\s*(\d+)/g;
  ficheirosDeComponente().forEach((ficheiro) => {
    fs.readFileSync(ficheiro, 'utf8')
      .split('\n')
      .forEach((linha, i) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(linha)) return;
        for (const m of linha.matchAll(propriedade)) {
          const valor = Number(m[2]);
          if (valor > 0 && valor % 4 !== 0) {
            infratores.push(`${path.basename(ficheiro)}:${i + 1} → ${m[0]}`);
          }
        }
      });
  });
  expect(infratores).toEqual([]);
});

test('nenhum componente usa emoji como ícone', () => {
  const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u;
  const infratores: string[] = [];
  ficheirosDeComponente().forEach((ficheiro) => {
    fs.readFileSync(ficheiro, 'utf8')
      .split('\n')
      .forEach((linha, i) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(linha)) return;
        if (emoji.test(linha)) infratores.push(`${path.basename(ficheiro)}:${i + 1} → ${linha.trim()}`);
      });
  });
  expect(infratores).toEqual([]);
});

test('nenhum componente usa TouchableOpacity diretamente', () => {
  const infratores: string[] = [];
  ficheirosDeComponente()
    .filter((f) => !/Touchable\.tsx$/.test(f))
    .forEach((ficheiro) => {
      if (/TouchableOpacity/.test(fs.readFileSync(ficheiro, 'utf8'))) {
        infratores.push(path.basename(ficheiro));
      }
    });
  expect(infratores).toEqual([]);
});
