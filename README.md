# Dieta Shay

Site pessoal para acompanhar a dieta e as medidas corporais.

## Abas

- **CardÃ¡pio**: os 7 dias da semana, abrindo no dia de hoje. Seg/Qua/Sex usam o plano
  Low Carb (1200 kcal) e Ter/Qui/SÃ¡b/Dom o High Carb (1400 kcal). Cada refeiÃ§Ã£o mostra a
  opÃ§Ã£o principal e as substituiÃ§Ãµes; a refeiÃ§Ã£o do horÃ¡rio atual fica destacada.
- **Planejar**: no domingo, escolha o que vai comer em cada dia da semana (uma refeição por vez,
  com os 7 dias lado a lado). Mostra o gasto estimado da semana na hora e leva para a lista.
- **Corpo**: registro semanal de peso e medidas (cintura, abdÃ´men, quadril, busto, braÃ§o,
  coxa, panturrilha), com grÃ¡fico de evoluÃ§Ã£o e histÃ³rico editÃ¡vel.
- **Supermercado**: lista de compras calculada a partir das opÃ§Ãµes escolhidas no CardÃ¡pio,
  para a semana ou o mÃªs, com o valor estimado do carrinho.

## Estrutura

```
Dieta-Shay/
â”œâ”€â”€ index.html          # pÃ¡gina e abas
â”œâ”€â”€ css/style.css       # estilos (tema claro e escuro)
â”œâ”€â”€ js/dados-dieta.js   # plano alimentar e catÃ¡logo de ingredientes/preÃ§os
â”œâ”€â”€ js/app.js           # lÃ³gica do site
â””â”€â”€ assets/
```

## Como abrir

Basta abrir o `index.html` no navegador. O grÃ¡fico usa o Chart.js pela internet.

## PreÃ§os

Os itens da cesta bÃ¡sica (carne, leite, feijÃ£o, arroz, banana, tomate, pÃ£o francÃªs, cafÃ©)
usam o preÃ§o mÃ©dio de Fortaleza da Pesquisa Nacional da Cesta BÃ¡sica do DIEESE (set/2026).
Os demais sÃ£o estimativas e podem ser editados direto no site. Para mudar os valores
padrÃ£o, edite `js/dados-dieta.js`.

## Privacidade

Medidas, escolhas e preÃ§os editados ficam salvos apenas no navegador (localStorage) e
nÃ£o vÃ£o para o repositÃ³rio. Use "Fazer backup" no rodapÃ© para guardar uma cÃ³pia.
