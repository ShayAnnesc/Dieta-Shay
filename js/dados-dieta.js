// Plano alimentar (nutricionista Vitória Andrade, 16/10/2026) e catálogo de ingredientes.
// Cada item de refeição é uma lista de alternativas ("OU"). Cada alternativa tem:
//   t   = texto exibido
//   ing = id do ingrediente usado na lista de compras (sem ing = não entra na lista)
//   q   = quantidade na unidade base do ingrediente
(function () {
  'use strict';

  const a = (t, ing, q) => ({ t, ing, q });
  const so = (t) => ({ t });

  // ---------- Blocos que se repetem nos dois planos ----------

  const SEMENTE = [
    a('Semente de chia (1 colher de sopa)', 'chia', 1),
    a('Semente de linhaça (1 colher de sopa)', 'linhaca', 1),
    a('Semente de girassol (1 colher de sopa)', 'girassol', 1),
  ];

  const FRUTA_CAFE = [
    a('Melão (100 g)', 'melao', 100),
    a('Mamão (100 g)', 'mamao', 100),
    a('Morango (6 unidades)', 'morango', 6),
    a('Ameixa (1 unidade)', 'ameixa', 1),
    a('Kiwi (1 unidade média)', 'kiwi', 1),
    a('Goiaba (1 unidade média)', 'goiaba', 1),
  ];

  const PROTEINA_CAFE = [
    a('Queijo tipo muçarela (1 fatia)', 'mussarela', 1),
    a('Frango desfiado (2 colheres de sopa)', 'frango', 40),
    a('Ovo de galinha (2 unidades)', 'ovo', 2),
    a('Carne moída refogada (2 colheres de sopa)', 'carne_moida', 40),
  ];

  const PASTINHA = [
    a('Creme de ricota (1 colher de sopa)', 'ricota', 1),
    a('Requeijão light (1 colher de sopa)', 'requeijao', 1),
    a('Queijo cottage (1 e 1/2 colher de sopa)', 'cottage', 1.5),
  ];

  const IOGURTE_NATURAL = (comTorrada) => ({
    itens: [
      [a('Iogurte natural desnatado (1 pote)', 'iogurte_natural', 1)],
      SEMENTE,
      [
        a('Morango (5 unidades)', 'morango', 5),
        a('Uva itália (12 unidades)', 'uva', 12),
        a('Banana (1 unidade média)', 'banana', 1),
      ],
      comTorrada
        ? [
            a('Aveia em flocos (1 colher de sopa)', 'aveia', 1),
            a('Torrada Magic Toast Cacau (1 pacote)', 'magic_cacau', 1),
          ]
        : [a('Aveia em flocos (1 colher de sopa)', 'aveia', 1)],
    ],
  });

  const IOGURTE_ZERO_FRUTA = {
    itens: [
      [a('Iogurte 0 lactose/açúcar/gordura (1 copo americano)', 'iogurte_zero', 1)],
      [
        a('Banana (1 unidade média)', 'banana', 1),
        a('Manga (100 g)', 'manga', 100),
        a('Uva itália (12 unidades)', 'uva', 12),
        a('Maçã (1 unidade)', 'maca', 1),
      ],
    ],
  };

  const PAO_COM_PASTINHA = {
    itens: [
      [
        a('Pão integral (2 fatias)', 'pao_integral', 2),
        a('Pão francês (1 unidade)', 'pao_frances', 1),
        a('Torrada Magic Toast (1 pacote)', 'magic_integral', 1),
      ],
      PASTINHA,
    ],
  };

  const OVERNIGHT_OATS = {
    titulo: 'Overnight oats',
    obs: 'Misturar a aveia, o leite, a chia e o cacau/canela, colocar em pote com tampa da noite para o dia. Consumir com fruta.',
    itens: [
      [a('Leite de vaca desnatado (100 ml)', 'leite', 100)],
      [a('Aveia em flocos (2 colheres de sopa)', 'aveia', 2)],
      [a('Cacau em pó (1 colher de chá) — opcional', 'cacau', 1)],
      [a('Semente de chia (1 colher de sobremesa)', 'chia', 0.7)],
      [
        a('Banana (1 unidade média)', 'banana', 1),
        a('Manga (100 g)', 'manga', 100),
        a('Uva itália (12 unidades)', 'uva', 12),
        a('Morango (5 unidades)', 'morango', 5),
      ],
    ],
  };

  const OMELETE_CAPRESE = {
    titulo: 'Omelete caprese',
    obs: 'Misturar todos os ingredientes e assar em frigideira antiaderente levemente untada com azeite.',
    itens: [
      [a('Ovo de galinha (2 unidades)', 'ovo', 2)],
      [a('Tomate (2 colheres de sopa cheias em cubos — 15 g)', 'tomate', 15)],
      [a('Orégano seco (1 colher de café)', 'oregano', 1)],
      [a('Manjericão fresco (5 folhas)', 'manjericao', 5)],
      [a('Queijo muçarela light (1 fatia)', 'mussarela_light', 1)],
    ],
  };

  const PANQUECA_GELEIA = {
    titulo: 'Panqueca de banana com geleia',
    itens: [
      [a('Ovo de galinha (1 unidade)', 'ovo', 1)],
      [a('Farelo de aveia Oat Bran Quaker (1 colher de sopa — 11 g)', 'farelo', 1)],
      [a('Geleia de frutas light (15 g)', 'geleia', 15)],
      [a('Banana (1 unidade média — 75 g)', 'banana', 1)],
    ],
  };

  const PAO_DE_QUEIJO_FRIGIDEIRA = {
    titulo: 'Pão de queijo de frigideira',
    obs: 'Misturar todos os ingredientes, adicionar sal e assar em frigideira antiaderente levemente untada com azeite.',
    itens: [
      [a('Ovo de galinha (1 unidade)', 'ovo', 1)],
      [a('Tapioca de goma (1 colher de sopa — 15 g)', 'tapioca', 15)],
      [a('Queijo muçarela light (1 fatia)', 'mussarela_light', 1)],
    ],
  };

  const LANCHE_RAPIDO = {
    titulo: 'Lanche rápido',
    itens: [
      [
        a('Iogurte 0 gordura/lactose/açúcar (1 copo americano)', 'iogurte_zero', 1),
        a('Iogurte de garrafinha (1 embalagem)', 'iogurte_garrafa', 1),
      ],
      [
        a('Banana (1 unidade média)', 'banana', 1),
        a('Tangerina (1 unidade pequena)', 'tangerina', 1),
        a('Maçã (1 unidade)', 'maca', 1),
        a('Pera (1 unidade)', 'pera', 1),
      ],
    ],
  };

  const PANQUECA_BANANA = {
    titulo: 'Panqueca de banana',
    obs: 'Amasse a banana, adicione o ovo e a aveia e misture até ficar homogêneo. Para saborizar, adicione cacau/canela/whey a gosto. Aqueça bem uma frigideira untada com um fio de azeite ou manteiga, adicione a massa e tampe; deixe assar até dar para virar.',
    itens: [
      [a('Banana (1 unidade média — 75 g)', 'banana', 1)],
      [a('Ovo de galinha (1 unidade)', 'ovo', 1)],
      [a('Farelo de aveia (2 colheres de sopa — ~24 g)', 'farelo', 2)],
    ],
  };

  const PAO_COM_OVO = {
    titulo: 'Pão com ovo',
    itens: [
      [
        a('Pão de forma zero (2 fatias)', 'pao_forma_zero', 2),
        a('Pão francês (1 unidade)', 'pao_frances', 1),
      ],
      [a('Ovo de galinha (1 unidade)', 'ovo', 1)],
      [a('Azeite de oliva (1 colher de chá)', 'azeite', 1)],
    ],
  };

  const ACAI = {
    titulo: 'Açaí caseiro',
    obs: 'Bater a polpa com a banana adicionando um pouco de água até atingir a consistência cremosa. Adicionar o morango ou o leite em pó por cima como topping.',
    itens: [
      [a('Polpa de açaí congelada (1 unidade)', 'acai', 1)],
      [a('Banana (1 unidade média)', 'banana', 1)],
      [
        a('Leite em pó desnatado (1 colher de sopa)', 'leite_po', 1),
        a('Morango (4 unidades)', 'morango', 4),
      ],
    ],
  };

  const PAO_DE_QUEIJO_FAKE = {
    titulo: 'Pão de queijo fake',
    obs: 'Misturar tudo e assar em forminhas na air fryer ou na frigideira.',
    itens: [
      [a('Tapioca de goma (1 colher de sopa — 15 g)', 'tapioca', 15)],
      [a('Ovo de galinha (1 unidade)', 'ovo', 1)],
      [a('Requeijão light (1 colher de sobremesa)', 'requeijao', 0.7)],
      [a('Queijo parmesão ralado (1 colher de sopa rasa)', 'parmesao', 1)],
    ],
  };

  const PRATO = (carbo) => ({
    itens: [
      carbo === 'low'
        ? [
            a('Arroz branco cozido (2 colheres de sopa cheias)', 'arroz', 2),
            a('Batata-doce cozida sem sal (60 g)', 'batata_doce', 60),
            a('Macarrão cozido (50 g)', 'macarrao', 50),
            a('Batata-inglesa cozida (75 g)', 'batata', 75),
          ]
        : [
            a('Arroz branco cozido (3 colheres de sopa cheias)', 'arroz', 3),
            a('Batata-doce cozida (90 g)', 'batata_doce', 90),
            a('Macarrão cozido (70 g)', 'macarrao', 70),
            a('Batata-inglesa cozida (110 g)', 'batata', 110),
          ],
      ...(carbo === 'high' ? [[a('Feijão cozido, 50% grão/caldo (1 colher de servir)', 'feijao', 1)]] : []),
      [a('Salada crua (folhas à vontade)', 'folhas', 1)],
      [
        a('Carne bovina grelhada/cozida (1 pedaço médio — 100 g)', 'carne', 100),
        a('Filé de frango (1 pedaço médio — 110 g)', 'frango', 110),
        a('Filé mignon suíno grelhado (1 pedaço médio — 100 g)', 'suino', 100),
        a('Filé de tilápia grelhado (2 pedaços médios — 100 g)', 'tilapia', 100),
      ],
      [a('Legumes cozidos ou crus ralados (pelo menos 1 opção sempre)', 'legumes', 100)],
    ],
  });

  const SOBREMESA = {
    id: 'sobremesa',
    hora: '12:30',
    nome: 'Sobremesa',
    opcoes: [
      {
        titulo: 'Morango com leite condensado',
        obs: 'Comer de colher.',
        itens: [
          [a('Leite condensado (1 colher de sopa)', 'leite_condensado', 1)],
          [a('Morango picado (2 unidades)', 'morango', 2)],
        ],
      },
      { itens: [[a('Doce de leite cremoso (1 colher de sopa)', 'doce_leite', 1)]] },
      {
        itens: [
          [
            a('Bananinha zero açúcar (1 unidade — 30 g)', 'bananinha', 1),
            a('Goiabinha zero açúcar (1 unidade — 30 g)', 'goiabinha', 1),
          ],
        ],
      },
      {
        itens: [
          [
            a('Bombom Ouro Branco (1 unidade)', 'bombom', 1),
            a('Batom Garoto (1 unidade)', 'bombom', 1),
            a('Sonho de Valsa (1 unidade)', 'bombom', 1),
          ],
        ],
      },
      {
        itens: [
          [
            a('Picolé Chicabon Zero (1 unidade)', 'picole', 1),
            a('Sorvete Chicabon Zero (1 bola — 60 g)', 'sorvete', 1),
          ],
        ],
      },
    ],
  };

  const JANTAR_SUBS = [
    {
      titulo: 'Cuscuz recheado',
      obs: 'Para maior saciedade, adicionar verduras e sementes à vontade.',
      itens: [
        [a('Cuscuz (6 colheres de sopa — 70 g)', 'flocao', 35)],
        [
          a('Queijo de coalho (1 fatia — 15 g)', 'coalho', 1),
          a('Requeijão light (1 colher de sopa)', 'requeijao', 1),
        ],
        [
          a('Frango desfiado (5 colheres de sopa — 110 g)', 'frango', 110),
          a('Carne moída (5 colheres de sopa — 100 g)', 'carne_moida', 100),
        ],
      ],
    },
    {
      titulo: 'Hambúrguer',
      obs: 'Fazer uma bolinha com a carne moída, colocar em frigideira aquecida e untada com azeite, amassar com uma espátula, assar bem os dois lados, adicionar o queijo e tampar para derreter. Servir no pão, com alface e tomate a gosto. (Evite molhos, principalmente maionese.)',
      itens: [
        [a('Ketchup (1 colher de sopa)', 'ketchup', 1)],
        [
          a('Queijo de coalho (1 fatia — 15 g)', 'coalho', 1),
          a('Queijo muçarela (1 fatia — 15 g)', 'mussarela', 1),
        ],
        [a('Carne moída (90 g — pesar crua)', 'carne_moida', 90)],
        [
          a('Pão integral (2 fatias)', 'pao_integral', 2),
          a('Pão francês (1 unidade)', 'pao_frances', 1),
        ],
      ],
    },
    {
      titulo: 'Pizza fake',
      obs: 'Na air fryer pré-aquecida, coloque o Rap10 por 5 minutos (ou até ficar crocante). Adicione o molho de tomate, espalhe, e coloque o frango e a muçarela por cima (se quiser, temperos a gosto: orégano, tomate, manjericão, pimentão). Volte à air fryer por 3 minutos ou até o queijo derreter ou dourar.',
      itens: [
        [
          a('Frango desfiado (3 colheres de sopa — 80 g)', 'frango', 80),
          a('Carne desfiada (3 colheres de sopa — 75 g)', 'carne', 75),
        ],
        [a('Queijo muçarela (1 fatia)', 'mussarela', 1)],
        [a('Extrato de tomate (1 colher de sopa — 15 g)', 'extrato', 1)],
        [a('Rap10 integral (1 unidade)', 'rap10', 1)],
      ],
    },
    {
      titulo: 'Sopa individual de carne',
      obs: 'Adicionar temperos à vontade (cuidado com a quantidade de gordura para preparar essa refeição).',
      itens: [
        [a('Carne moída (100 g)', 'carne_moida', 100)],
        [
          a('Chuchu (3 colheres de sopa — 60 g)', 'chuchu', 60),
          a('Batata-inglesa (meia unidade — 30 g)', 'batata', 30),
        ],
        [a('Macarrão (1 colher de servir)', 'macarrao', 40)],
        [a('Cenoura (meia unidade)', 'cenoura', 0.5)],
      ],
    },
    {
      titulo: 'Macarronada',
      obs: 'Pode adicionar temperos a gosto: ervilha, tomate, pimentão, orégano, cebola roxa.',
      itens: [
        [a('Macarrão cozido (120 g)', 'macarrao', 120)],
        [
          a('Frango desfiado (100 g)', 'frango', 100),
          a('Salmão grelhado (80 g)', 'salmao', 80),
          a('Camarão (120 g)', 'camarao', 120),
          a('Carne moída refogada (120 g)', 'carne_moida', 120),
        ],
        [a('Extrato de tomate ou passata de tomate (2 colheres de sopa)', 'extrato', 2)],
        [a('Milho verde (1 colher de sopa)', 'milho', 1)],
      ],
    },
    {
      titulo: 'Refeição livre',
      obs: 'Escolha a pizza com a menor quantidade de ingredientes; prefira hambúrguer artesanal; no sushi, evite os fritos e o excesso de cream cheese, com o mínimo possível de molho.',
      itens: [
        [
          so('2 a 3 fatias de pizza'),
          so('Hambúrguer (prefira artesanal)'),
          so('Massa'),
          so('Sushi (até 15 peças)'),
        ],
      ],
    },
  ];

  const CEIA = {
    id: 'ceia',
    hora: '21:00',
    nome: 'Ceia',
    opcoes: [
      {
        itens: [
          [
            a('Tangerina (1 unidade pequena)', 'tangerina', 1),
            a('Maçã (1 unidade pequena)', 'maca', 1),
            a('Kiwi (1 unidade)', 'kiwi', 1),
            a('Pera (1 unidade pequena)', 'pera', 1),
            a('Manga (100 g)', 'manga', 100),
            a('Mamão (135 g)', 'mamao', 135),
            a('Uva itália (10 unidades)', 'uva', 10),
          ],
        ],
      },
    ],
  };

  // ---------- Planos ----------

  const PLANOS = {
    low: {
      nome: 'Low Carb',
      kcal: 1200,
      descricao: 'Dia de superiores ou descanso',
      refeicoes: [
        {
          id: 'cafe',
          hora: '06:00',
          nome: 'Café da manhã',
          opcoes: [
            {
              itens: [
                [
                  a('Pão integral (1 fatia)', 'pao_integral', 1),
                  a('Cuscuz cozido (55 g)', 'flocao', 28),
                  a('Banana (1 unidade média)', 'banana', 1),
                ],
                PROTEINA_CAFE,
                [a('Café sem açúcar (100 ml)', 'cafe', 100)],
                [a('Leite de vaca desnatado (100 ml)', 'leite', 100)],
                FRUTA_CAFE,
              ],
            },
            {
              titulo: 'Omelete',
              itens: [
                [a('Ovo de galinha (1 unidade)', 'ovo', 1)],
                [
                  a('Queijo de coalho (1 fatia fina)', 'coalho', 1),
                  a('Queijo muçarela tradicional (1 fatia)', 'mussarela', 1),
                  a('Requeijão light (1 colher de sopa)', 'requeijao', 1),
                  a('Creme de ricota (1 colher de sopa)', 'ricota', 1),
                ],
                [a('Tomate (à vontade) + manjericão/orégano', 'tomate', 50)],
                [a('Leite de vaca desnatado (50 ml)', 'leite', 50)],
                [a('Café sem açúcar (50 ml)', 'cafe', 50)],
              ],
            },
          ],
        },
        {
          id: 'colacao',
          hora: '09:00',
          nome: 'Colação',
          opcoes: [IOGURTE_NATURAL(true), OVERNIGHT_OATS, OMELETE_CAPRESE, PANQUECA_GELEIA, PAO_DE_QUEIJO_FRIGIDEIRA, LANCHE_RAPIDO],
        },
        { id: 'almoco', hora: '12:00', nome: 'Almoço', opcoes: [PRATO('low')] },
        SOBREMESA,
        {
          id: 'lanche',
          hora: '15:00',
          nome: 'Lanche da tarde',
          opcoes: [IOGURTE_ZERO_FRUTA, PAO_COM_PASTINHA, IOGURTE_NATURAL(true), PANQUECA_BANANA, PAO_COM_OVO, ACAI, PAO_DE_QUEIJO_FAKE],
        },
        { id: 'jantar', hora: '18:00', nome: 'Jantar', opcoes: [PRATO('low'), ...JANTAR_SUBS] },
        CEIA,
      ],
    },
    high: {
      nome: 'High Carb',
      kcal: 1400,
      descricao: 'Dia de inferiores',
      refeicoes: [
        {
          id: 'cafe',
          hora: '06:00',
          nome: 'Café da manhã',
          opcoes: [
            {
              itens: [
                [
                  a('Pão integral (2 fatias)', 'pao_integral', 2),
                  a('Cuscuz cozido (90 g)', 'flocao', 45),
                  a('Tapioca de goma (3 colheres de sopa — 45 g)', 'tapioca', 45),
                  a('Pão francês (1 unidade)', 'pao_frances', 1),
                  a('Torrada Magic Toast integral Marilan (1 pacote)', 'magic_integral', 1),
                ],
                PROTEINA_CAFE,
                [a('Café sem açúcar (100 ml)', 'cafe', 100)],
                [a('Leite de vaca desnatado (100 ml)', 'leite', 100)],
                FRUTA_CAFE,
              ],
            },
          ],
        },
        {
          id: 'colacao',
          hora: '09:00',
          nome: 'Colação',
          opcoes: [IOGURTE_NATURAL(false), OVERNIGHT_OATS, OMELETE_CAPRESE, PANQUECA_GELEIA, PAO_DE_QUEIJO_FRIGIDEIRA, LANCHE_RAPIDO],
        },
        { id: 'almoco', hora: '12:00', nome: 'Almoço', opcoes: [PRATO('high')] },
        SOBREMESA,
        {
          id: 'lanche',
          hora: '17:00',
          nome: 'Lanche da tarde',
          opcoes: [PAO_COM_PASTINHA, IOGURTE_NATURAL(true), PANQUECA_BANANA, IOGURTE_ZERO_FRUTA, PAO_COM_OVO, ACAI, PAO_DE_QUEIJO_FAKE],
        },
        { id: 'jantar', hora: '18:00', nome: 'Jantar', opcoes: [PRATO('high'), ...JANTAR_SUBS] },
        CEIA,
      ],
    },
  };

  const DIAS_PLANO = { seg: 'low', ter: 'high', qua: 'low', qui: 'high', sex: 'low', sab: 'high', dom: 'high' };

  // ---------- Ingredientes ----------
  // un/unP = unidade base (singular/plural) usada nas quantidades das refeições
  // emb = embalagem de compra, qtdEmb = quanto da unidade base cabe em uma embalagem
  // preco = preço de referência da embalagem (R$), fonte 'dieese' = DIEESE Fortaleza set/2026

  const ing = (nome, un, unP, cat, emb, qtdEmb, preco, perecivel, fonte = 'estimativa') => ({
    nome, un, unP, cat, emb, qtdEmb, preco, perecivel, fonte,
  });

  const G = ['g', 'g'];
  const ML = ['ml', 'ml'];
  const UN = ['unidade', 'unidades'];
  const CS = ['colher de sopa', 'colheres de sopa'];
  const FATIA = ['fatia', 'fatias'];

  const INGREDIENTES = {
    // Hortifrúti
    banana: ing('Banana', ...UN, 'Hortifrúti', 'Dúzia', 12, 8.67, true, 'dieese'),
    tomate: ing('Tomate', ...G, 'Hortifrúti', '1 kg', 1000, 9.58, true, 'dieese'),
    folhas: ing('Folhas para salada (alface, rúcula…)', 'porção', 'porções', 'Hortifrúti', 'Pé ou maço (≈ 4 porções)', 4, 3.5, true),
    legumes: ing('Legumes variados (cenoura, abobrinha, brócolis…)', ...G, 'Hortifrúti', '1 kg', 1000, 7.0, true),
    batata_doce: ing('Batata-doce', ...G, 'Hortifrúti', '1 kg', 1000, 6.5, true),
    batata: ing('Batata-inglesa', ...G, 'Hortifrúti', '1 kg', 1000, 6.9, true),
    chuchu: ing('Chuchu', ...G, 'Hortifrúti', '1 kg', 1000, 4.9, true),
    cenoura: ing('Cenoura', ...UN, 'Hortifrúti', '1 kg (≈ 7 unidades)', 7, 5.9, true),
    manjericao: ing('Manjericão fresco', 'folha', 'folhas', 'Hortifrúti', 'Maço (≈ 40 folhas)', 40, 3.5, true),
    melao: ing('Melão', ...G, 'Hortifrúti', 'Unidade (≈ 1,2 kg de polpa)', 1200, 12.0, true),
    mamao: ing('Mamão', ...G, 'Hortifrúti', 'Unidade formosa (≈ 1 kg de polpa)', 1000, 7.5, true),
    morango: ing('Morango', ...UN, 'Hortifrúti', 'Bandeja 250 g (≈ 15 unidades)', 15, 9.9, true),
    ameixa: ing('Ameixa', ...UN, 'Hortifrúti', 'Bandeja 500 g (≈ 8 unidades)', 8, 12.9, true),
    kiwi: ing('Kiwi', ...UN, 'Hortifrúti', 'Unidade', 1, 2.5, true),
    goiaba: ing('Goiaba', ...UN, 'Hortifrúti', '1 kg (≈ 5 unidades)', 5, 8.9, true),
    uva: ing('Uva itália', 'uva', 'uvas', 'Hortifrúti', 'Bandeja 500 g (≈ 60 uvas)', 60, 9.9, true),
    manga: ing('Manga', ...G, 'Hortifrúti', 'Unidade (≈ 300 g de polpa)', 300, 3.5, true),
    tangerina: ing('Tangerina', ...UN, 'Hortifrúti', '1 kg (≈ 6 unidades)', 6, 6.9, true),
    maca: ing('Maçã', ...UN, 'Hortifrúti', '1 kg (≈ 6 unidades)', 6, 10.9, true),
    pera: ing('Pera', ...UN, 'Hortifrúti', 'Unidade', 1, 2.9, true),

    // Carnes e ovos
    ovo: ing('Ovos', ...UN, 'Carnes e ovos', 'Bandeja com 12', 12, 11.5, true),
    frango: ing('Peito de frango', 'g pronto', 'g pronto', 'Carnes e ovos', 'Bandeja 1 kg (≈ 700 g pronto)', 700, 21.9, true),
    carne_moida: ing('Carne moída (patinho)', ...G, 'Carnes e ovos', 'Bandeja 500 g', 500, 26.9, true),
    carne: ing('Carne bovina (bife/patinho)', 'g pronto', 'g pronto', 'Carnes e ovos', 'Bandeja 500 g (≈ 350 g pronto)', 350, 28.16, true, 'dieese'),
    suino: ing('Filé mignon suíno', 'g pronto', 'g pronto', 'Carnes e ovos', 'Peça 500 g (≈ 350 g pronto)', 350, 17.9, true),
    tilapia: ing('Filé de tilápia', 'g pronto', 'g pronto', 'Carnes e ovos', 'Bandeja 500 g (≈ 400 g pronto)', 400, 27.9, true),
    salmao: ing('Salmão', 'g pronto', 'g pronto', 'Carnes e ovos', 'Posta 250 g (≈ 200 g pronto)', 200, 27.9, true),
    camarao: ing('Camarão limpo', ...G, 'Carnes e ovos', 'Pacote 400 g', 400, 32.9, true),

    // Laticínios
    leite: ing('Leite desnatado', ...ML, 'Laticínios', 'Caixa 1 L', 1000, 7.79, true, 'dieese'),
    iogurte_natural: ing('Iogurte natural desnatado', 'pote', 'potes', 'Laticínios', 'Pote 160 g', 1, 3.49, true),
    iogurte_zero: ing('Iogurte 0% gordura/lactose/açúcar', 'copo', 'copos', 'Laticínios', 'Pote 170 g', 1, 4.29, true),
    iogurte_garrafa: ing('Iogurte de garrafinha', ...UN, 'Laticínios', 'Garrafinha 170 g', 1, 2.99, true),
    mussarela: ing('Queijo muçarela', ...FATIA, 'Laticínios', 'Fatiado 150 g (≈ 8 fatias)', 8, 8.5, true),
    mussarela_light: ing('Queijo muçarela light', ...FATIA, 'Laticínios', 'Fatiado 150 g (≈ 8 fatias)', 8, 11.9, true),
    coalho: ing('Queijo coalho', ...FATIA, 'Laticínios', 'Peça 500 g (≈ 30 fatias)', 30, 27.5, true),
    requeijao: ing('Requeijão light', ...CS, 'Laticínios', 'Copo 200 g (≈ 13 colheres)', 13, 8.9, true),
    ricota: ing('Creme de ricota', ...CS, 'Laticínios', 'Pote 200 g (≈ 13 colheres)', 13, 9.9, true),
    cottage: ing('Queijo cottage', ...CS, 'Laticínios', 'Pote 200 g (≈ 13 colheres)', 13, 11.5, true),
    parmesao: ing('Parmesão ralado', ...CS, 'Laticínios', 'Pacote 50 g (≈ 8 colheres)', 8, 6.9, false),

    // Padaria
    pao_integral: ing('Pão integral', ...FATIA, 'Padaria', 'Pacote 500 g (≈ 20 fatias)', 20, 11.9, true),
    pao_forma_zero: ing('Pão de forma zero', ...FATIA, 'Padaria', 'Pacote 400 g (≈ 18 fatias)', 18, 10.9, true),
    pao_frances: ing('Pão francês', ...UN, 'Padaria', 'Unidade (≈ 50 g)', 1, 1.11, true, 'dieese'),
    rap10: ing('Rap10 integral', ...UN, 'Padaria', 'Pacote com 6', 6, 12.9, false),

    // Mercearia
    arroz: ing('Arroz branco', 'colher cheia (cozido)', 'colheres cheias (cozido)', 'Mercearia', 'Pacote 1 kg (≈ 100 colheres cozido)', 100, 5.29, false, 'dieese'),
    feijao: ing('Feijão', 'colher de servir (cozido)', 'colheres de servir (cozido)', 'Mercearia', 'Pacote 1 kg (≈ 25 colheres de servir cozido)', 25, 8.99, false, 'dieese'),
    macarrao: ing('Macarrão', 'g cozido', 'g cozido', 'Mercearia', 'Pacote 500 g (≈ 1,2 kg cozido)', 1200, 5.5, false),
    flocao: ing('Flocão de milho (cuscuz)', 'g seco', 'g seco', 'Mercearia', 'Pacote 500 g', 500, 4.2, false),
    tapioca: ing('Goma de tapioca', ...G, 'Mercearia', 'Pacote 500 g', 500, 8.5, false),
    aveia: ing('Aveia em flocos', ...CS, 'Mercearia', 'Pacote 450 g (≈ 35 colheres)', 35, 10.9, false),
    farelo: ing('Farelo de aveia', ...CS, 'Mercearia', 'Pacote 200 g (≈ 17 colheres)', 17, 8.9, false),
    magic_integral: ing('Torrada Magic Toast integral', 'pacotinho', 'pacotinhos', 'Mercearia', 'Caixa 150 g (≈ 6 pacotinhos)', 6, 9.5, false),
    magic_cacau: ing('Torrada Magic Toast cacau', 'pacotinho', 'pacotinhos', 'Mercearia', 'Caixa 150 g (≈ 6 pacotinhos)', 6, 9.5, false),
    chia: ing('Semente de chia', ...CS, 'Mercearia', 'Pacote 200 g (≈ 20 colheres)', 20, 11.9, false),
    linhaca: ing('Linhaça', ...CS, 'Mercearia', 'Pacote 200 g (≈ 20 colheres)', 20, 7.5, false),
    girassol: ing('Semente de girassol', ...CS, 'Mercearia', 'Pacote 150 g (≈ 15 colheres)', 15, 9.9, false),
    cacau: ing('Cacau em pó', 'colher de chá', 'colheres de chá', 'Mercearia', 'Pacote 200 g (≈ 80 colheres de chá)', 80, 14.9, false),
    cafe: ing('Café em pó', 'ml de café', 'ml de café', 'Mercearia', 'Pacote 250 g (≈ 3 L de café)', 3000, 15.13, false, 'dieese'),
    leite_po: ing('Leite em pó desnatado', ...CS, 'Mercearia', 'Lata 280 g (≈ 28 colheres)', 28, 19.9, false),
    geleia: ing('Geleia de frutas light', ...G, 'Mercearia', 'Pote 230 g', 230, 15.9, false),
    milho: ing('Milho verde em conserva', ...CS, 'Mercearia', 'Lata 170 g (≈ 10 colheres)', 10, 5.2, false),
    extrato: ing('Extrato ou passata de tomate', ...CS, 'Mercearia', 'Sachê 300 g (≈ 20 colheres)', 20, 4.5, false),
    ketchup: ing('Ketchup', ...CS, 'Mercearia', 'Frasco 380 g (≈ 25 colheres)', 25, 9.5, false),
    azeite: ing('Azeite de oliva', 'colher de chá', 'colheres de chá', 'Mercearia', 'Garrafa 500 ml (≈ 100 colheres de chá)', 100, 34.9, false),
    oregano: ing('Orégano seco', 'colher de café', 'colheres de café', 'Mercearia', 'Pacote 10 g (≈ 25 colheres de café)', 25, 3.5, false),

    // Congelados e doces
    acai: ing('Polpa de açaí', ...UN, 'Congelados', 'Pacote com 4 polpas', 4, 14.9, false),
    picole: ing('Picolé Chicabon Zero', ...UN, 'Congelados', 'Unidade', 1, 4.99, false),
    sorvete: ing('Sorvete Chicabon Zero', 'bola', 'bolas', 'Congelados', 'Pote 800 ml (≈ 10 bolas)', 10, 24.9, false),
    leite_condensado: ing('Leite condensado', ...CS, 'Doces', 'Caixa 395 g (≈ 20 colheres)', 20, 7.49, false),
    doce_leite: ing('Doce de leite cremoso', ...CS, 'Doces', 'Pote 400 g (≈ 20 colheres)', 20, 12.9, false),
    bananinha: ing('Bananinha zero açúcar', ...UN, 'Doces', 'Unidade 30 g', 1, 1.99, false),
    goiabinha: ing('Goiabinha zero açúcar', ...UN, 'Doces', 'Unidade 30 g', 1, 1.99, false),
    bombom: ing('Bombom (Ouro Branco, Batom, Sonho de Valsa)', ...UN, 'Doces', 'Unidade', 1, 1.89, false),
  };

  const CATEGORIAS = ['Hortifrúti', 'Carnes e ovos', 'Laticínios', 'Padaria', 'Mercearia', 'Congelados', 'Doces'];

  window.DIETA = { PLANOS, DIAS_PLANO, INGREDIENTES, CATEGORIAS };
})();
