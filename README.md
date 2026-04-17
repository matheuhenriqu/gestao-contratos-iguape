# Gestão de Contratos | Prefeitura de Iguape/SP

Aplicação estática para consulta, filtragem, acompanhamento de vencimentos e leitura institucional dos contratos consolidados na planilha `CONTRATOS.xlsx`.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Recharts
- xlsx

## Scripts

- `npm run dev`: sobe o ambiente local
- `npm run build`: valida TypeScript e gera a build de produção
- `npm run preview`: abre a build localmente
- `npm run extract:data`: lê a planilha `CONTRATOS.xlsx` e atualiza o arquivo `src/data/contracts.json`

## Fonte de dados

O projeto utiliza a aba `CONTRATOS` da planilha original e gera um JSON estático normalizado para publicação sem backend.

O script de extração procura a planilha em:

1. `CONTRACTS_SOURCE` no ambiente
2. `./CONTRATOS.xlsx`
3. `../CONTRATOS.xlsx`
4. `../Downloads/CONTRATOS.xlsx`
5. `C:/Users/user/Downloads/CONTRATOS.xlsx`

## Publicação

O `base` do Vite já está configurado para o repositório `gestao-contratos-iguape`, deixando a aplicação pronta para GitHub Pages na etapa seguinte.
