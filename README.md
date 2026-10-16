# Dieta Shay

Site pessoal para acompanhar a dieta e as medidas corporais.

## Abas

- **Cardápio**: os 7 dias da semana, abrindo no dia de hoje. Seg/Qua/Sex usam o plano
  Low Carb (1200 kcal) e Ter/Qui/Sáb/Dom o High Carb (1400 kcal). Cada refeição mostra a
  opção principal e as substituições; a refeição do horário atual fica destacada.
- **Planejar**: no domingo, escolha o que vai comer em cada dia da semana (uma refeição por
  vez, com os 7 dias lado a lado). Mostra o gasto estimado da semana na hora e leva para a lista.
- **Supermercado**: lista de compras calculada a partir das escolhas da semana, para a
  semana ou o mês, com o valor estimado do carrinho.
- **Corpo**: registro semanal de peso e medidas (cintura, abdômen, quadril, busto, braço,
  coxa, panturrilha), com gráfico de evolução e histórico editável.

## Estrutura

```
Dieta-Shay/
├── index.html          # página e abas
├── css/style.css       # estilos (tema claro e escuro)
├── js/dados-dieta.js   # plano alimentar e catálogo de ingredientes/preços
├── js/app.js           # lógica do site
└── assets/
```

## Como abrir

Basta abrir o `index.html` no navegador. O gráfico usa o Chart.js pela internet.

## Preços

Os itens da cesta básica (carne, leite, feijão, arroz, banana, tomate, pão francês, café)
usam o preço médio de Fortaleza da Pesquisa Nacional da Cesta Básica do DIEESE (set/2026).
Os demais são estimativas e podem ser editados direto no site. Para mudar os valores
padrão, edite `js/dados-dieta.js`.

## Privacidade

Medidas, escolhas e preços editados ficam salvos apenas no navegador (localStorage) e
não vão para o repositório. Use "Fazer backup" no rodapé para guardar uma cópia.
