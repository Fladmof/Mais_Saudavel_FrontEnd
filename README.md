# Como Contribuir — +Saudável FrontEnd

## Setup
1. `git clone <repo>`
2. `npm install`
3. `npx expo start`

## Branches
- `main` → produção, nunca commitar diretamente
- `develop` → branch de integração
- `feature/nome-da-feature` → nova funcionalidade
- `fix/nome-do-bug` → correção de bug

## Como criar uma feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-feature
# ... faz o teu trabalho ...
git push origin feature/nome-da-feature
# Abre Pull Request para develop no GitHub
```

## Commits
Usa sempre este formato:
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `refactor:` reorganização de código
- `chore:` configurações, dependências
- `style:` apenas formatação/estilo

Exemplos:
- `feat: add QuestionCard component`
- `fix: correct XP calculation on streak`

## Regras
- Ninguém faz merge do próprio Pull Request (PR)
- PRs pequenos e focados (1 feature por PR)
- Descreve sempre o PR com o template
