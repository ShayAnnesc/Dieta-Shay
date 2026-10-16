// Lógica do site Dieta Shay
(function () {
  'use strict';

  const { PLANOS, DIAS_PLANO, INGREDIENTES, CATEGORIAS } = window.DIETA;

  const DIAS = [
    { k: 'seg', curto: 'Seg', nome: 'Segunda-feira' },
    { k: 'ter', curto: 'Ter', nome: 'Terça-feira' },
    { k: 'qua', curto: 'Qua', nome: 'Quarta-feira' },
    { k: 'qui', curto: 'Qui', nome: 'Quinta-feira' },
    { k: 'sex', curto: 'Sex', nome: 'Sexta-feira' },
    { k: 'sab', curto: 'Sáb', nome: 'Sábado' },
    { k: 'dom', curto: 'Dom', nome: 'Domingo' },
  ];
  const DIA_JS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

  const MEDIDAS = [
    { k: 'peso', nome: 'Peso', un: 'kg', menorMelhor: true },
    { k: 'cintura', nome: 'Cintura', un: 'cm', menorMelhor: true },
    { k: 'abdomen', nome: 'Abdômen', un: 'cm', menorMelhor: true },
    { k: 'quadril', nome: 'Quadril', un: 'cm', menorMelhor: true },
    { k: 'busto', nome: 'Busto', un: 'cm' },
    { k: 'braco', nome: 'Braço', un: 'cm' },
    { k: 'coxa', nome: 'Coxa', un: 'cm' },
    { k: 'panturrilha', nome: 'Panturrilha', un: 'cm' },
  ];

  const SEMANAS_POR_MES = 30 / 7;

  // ---------- Armazenamento local ----------
  const PREFIXO = 'dietaShay.';
  const store = {
    get(chave, padrao) {
      try {
        const v = localStorage.getItem(PREFIXO + chave);
        return v ? JSON.parse(v) : padrao;
      } catch (e) {
        return padrao;
      }
    },
    set(chave, valor) {
      try {
        localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
      } catch (e) {
        aviso('Não foi possível salvar neste navegador.');
      }
    },
  };

  const estado = {
    aba: store.get('aba', 'dias'),
    dia: DIA_JS[new Date().getDay()],
    escolhas: store.get('escolhas', {}),
    medidas: store.get('medidas', []),
    precos: store.get('precos', {}),
    tenho: store.get('tenho', {}),
    periodo: 'semana',
    metrica: 'peso',
    editando: null,
  };

  // ---------- Utilidades ----------
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (n, casas = 1) => n.toLocaleString('pt-BR', { maximumFractionDigits: casas });
  const reais = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const hojeISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const dataBR = (iso) => {
    const [a, m, d] = iso.split('-');
    return `${d}/${m}/${a}`;
  };
  const dataCurta = (iso) => iso.split('-').reverse().slice(0, 2).join('/');
  const somaDias = (iso, n) => {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  let timerAviso;
  function aviso(msg) {
    const el = $('#aviso');
    // Com o painel aberto, o aviso precisa ficar dentro dele para aparecer por cima
    const painel = $('#painel-planejar');
    const destino = painel.open ? painel : document.body;
    if (el.parentElement !== destino) destino.appendChild(el);
    el.textContent = msg;
    el.classList.add('visivel');
    clearTimeout(timerAviso);
    timerAviso = setTimeout(() => el.classList.remove('visivel'), 2200);
  }

  // ---------- Abas ----------
  const ABAS = ['dias', 'mercado', 'corpo'];

  function renderAbaAtual() {
    if (estado.aba === 'mercado') renderMercado();
    if (estado.aba === 'corpo') renderCorpo();
    if (estado.aba === 'dias') renderCardapio();
  }

  function mostrarAba(aba) {
    estado.aba = ABAS.includes(aba) ? aba : 'dias';
    store.set('aba', estado.aba);
    document.querySelectorAll('.abas button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.aba === estado.aba)));
    document.querySelectorAll('.aba').forEach((s) => (s.hidden = s.id !== 'aba-' + estado.aba));
    renderAbaAtual();
    window.scrollTo(0, 0);
  }

  function abrirPlanejar() {
    renderPlanejar();
    const painel = $('#painel-planejar');
    painel.showModal();
    painel.scrollTop = 0;
  }

  // ---------- Escolhas das refeições ----------
  function escolha(dia, refId) {
    return (estado.escolhas[dia] && estado.escolhas[dia][refId]) || { op: 0, alt: {} };
  }

  function salvarEscolha(dia, refId, valor) {
    estado.escolhas[dia] = estado.escolhas[dia] || {};
    estado.escolhas[dia][refId] = valor;
    store.set('escolhas', estado.escolhas);
  }

  function nomeOpcao(opcao, i) {
    const base = i === 0 ? 'Principal' : `Substituição ${i}`;
    return opcao.titulo ? `${base} · ${opcao.titulo}` : base;
  }

  // ---------- Cardápio ----------
  function inicioDaSemana() {
    const d = new Date();
    const desloc = (d.getDay() + 6) % 7; // segunda = 0
    d.setDate(d.getDate() - desloc);
    return d;
  }

  function renderDias() {
    const hoje = DIA_JS[new Date().getDay()];
    const seg = inicioDaSemana();
    $('#lista-dias').innerHTML = DIAS.map((d, i) => {
      const data = new Date(seg);
      data.setDate(seg.getDate() + i);
      return `<button class="dia${d.k === hoje ? ' hoje' : ''}" data-dia="${d.k}" aria-pressed="${d.k === estado.dia}">
        <span class="dia-nome">${d.curto}</span>
        <span class="dia-num">${data.getDate()}</span>
        <span class="dia-tipo ${DIAS_PLANO[d.k]}" title="${PLANOS[DIAS_PLANO[d.k]].nome}"></span>
      </button>`;
    }).join('');
  }

  function refeicaoAtual(plano) {
    const agora = new Date();
    const min = agora.getHours() * 60 + agora.getMinutes();
    let atual = null;
    plano.refeicoes.forEach((r) => {
      const [h, m] = r.hora.split(':').map(Number);
      if (h * 60 + m <= min) atual = r.id;
    });
    return atual;
  }

  function renderCardapio() {
    renderDias();
    const ehDomingo = new Date().getDay() === 0;
    $('#lembrete').innerHTML = ehDomingo && store.get('planejadoEm', null) !== hojeISO()
      ? '<div class="lembrete"><span>Hoje é domingo: hora de planejar a semana.</span><button class="btn btn-primario" data-ir="planejar">Planejar</button></div>'
      : '';
    const dia = DIAS.find((d) => d.k === estado.dia);
    const tipo = DIAS_PLANO[estado.dia];
    const plano = PLANOS[tipo];
    const ehHoje = estado.dia === DIA_JS[new Date().getDay()];

    $('#dia-cabecalho').innerHTML = `
      <h1>${dia.nome}${ehHoje ? ' · hoje' : ''}</h1>
      <div class="plano">
        <span class="selo selo-${tipo}">${plano.nome} · ${plano.kcal} kcal</span>
        <span>${plano.descricao}</span>
      </div>`;

    const atual = ehHoje ? refeicaoAtual(plano) : null;

    $('#refeicoes').innerHTML = plano.refeicoes.map((r) => {
      const esc0 = escolha(estado.dia, r.id);
      const op = Math.min(esc0.op, r.opcoes.length - 1);
      const opcao = r.opcoes[op];

      const seletor = r.opcoes.length > 1
        ? `<div class="chips opcoes" role="group" aria-label="Opções de ${esc(r.nome)}">
            ${r.opcoes.map((o, i) => `<button class="chip" data-ref="${r.id}" data-op="${i}" aria-pressed="${i === op}">${esc(nomeOpcao(o, i))}</button>`).join('')}
          </div>`
        : '';

      const itens = opcao.itens.map((alts, i) => {
        const escolhida = esc0.alt[`${op}-${i}`] || 0;
        if (alts.length === 1) return `<li class="item"><span>${esc(alts[0].t)}</span></li>`;
        const botoes = alts.map((alt, j) =>
          `${j > 0 ? '<span class="ou">OU</span>' : ''}<button class="alt" data-ref="${r.id}" data-item="${op}-${i}" data-alt="${j}" aria-pressed="${j === escolhida}">${esc(alt.t)}</button>`
        ).join('');
        return `<li class="item"><div class="alts">${botoes}</div></li>`;
      }).join('');

      return `<article class="refeicao${r.id === atual ? ' agora' : ''}">
        <div class="refeicao-topo">
          <span class="refeicao-hora">${r.hora}</span>
          <span class="refeicao-nome">${esc(r.nome)}</span>
          ${r.id === atual ? '<span class="selo selo-agora">agora</span>' : ''}
        </div>
        <div class="refeicao-corpo">
          ${seletor}
          ${r.opcoes.length > 1 ? `<p class="opcao-titulo">${esc(nomeOpcao(opcao, op))}</p>` : ''}
          <ul class="itens">${itens}</ul>
          ${opcao.obs ? `<p class="obs"><strong>Obs:</strong> ${esc(opcao.obs)}</p>` : ''}
        </div>
      </article>`;
    }).join('');
  }

  // ---------- Planejar ----------
  const ORDEM_REFEICOES = PLANOS.low.refeicoes.map((r) => ({ id: r.id, nome: r.nome }));

  function refeicaoDoDia(dia, refId) {
    return PLANOS[DIAS_PLANO[dia]].refeicoes.find((r) => r.id === refId);
  }

  // No domingo planeja-se a semana que começa amanhã; nos outros dias, a semana atual.
  function rotuloSemanaPlanejada() {
    const ini = new Date();
    if (ini.getDay() === 0) ini.setDate(ini.getDate() + 1);
    else ini.setDate(ini.getDate() - ((ini.getDay() + 6) % 7));
    const fim = new Date(ini);
    fim.setDate(ini.getDate() + 6);
    const f = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    return `Semana de ${f(ini)} a ${f(fim)}`;
  }

  function selectHtml(dia, refId, campo, opcoes, selecionado, item) {
    return `<select class="sel" data-dia="${dia}" data-ref="${refId}" data-campo="${campo}"${item ? ` data-item="${item}"` : ''}>
      ${opcoes.map((texto, i) => `<option value="${i}"${i === selecionado ? ' selected' : ''}>${esc(texto)}</option>`).join('')}
    </select>`;
  }

  function cartaoPlanejar(refId, nome) {
    const linhas = DIAS.map((d) => {
      const tipo = DIAS_PLANO[d.k];
      const r = refeicaoDoDia(d.k, refId);
      const e = escolha(d.k, refId);
      const op = Math.min(e.op, r.opcoes.length - 1);
      const opcao = r.opcoes[op];

      const selOp = r.opcoes.length > 1
        ? selectHtml(d.k, refId, 'op', r.opcoes.map(nomeOpcao), op)
        : '';
      const selAlts = opcao.itens
        .map((alts, i) => (alts.length < 2 ? '' : selectHtml(d.k, refId, 'alt', alts.map((x) => x.t), e.alt[`${op}-${i}`] || 0, `${op}-${i}`)))
        .join('');

      return `<div class="plano-linha">
        <div class="plano-dia"><strong>${d.nome.split('-')[0]}</strong><span class="selo selo-${tipo}">${PLANOS[tipo].nome}</span></div>
        <div class="plano-sels">${selOp}${selAlts || (selOp ? '' : '<span class="sel-fixa">Sem opções para escolher</span>')}</div>
        <button class="link plano-copiar" data-copiar="${d.k}" data-ref="${refId}">Repetir em todos</button>
      </div>`;
    }).join('');
    return `<article class="cartao plano-cartao" id="plano-${refId}"><h2>${esc(nome)}</h2>${linhas}</article>`;
  }

  function renderBarraPlano() {
    const comprar = calcularCarrinho('semana').filter((l) => !l.tenho);
    const total = comprar.reduce((s, l) => s + l.subtotal, 0);
    const feito = store.get('planejadoEm', null);
    $('#barra-plano').innerHTML = `
      <div class="total">
        <span class="total-rotulo">Gasto estimado da semana</span>
        <strong>${reais(total)}</strong>
        <span class="total-sub">${comprar.length} ${comprar.length === 1 ? 'item' : 'itens'} para comprar${feito ? ` · último planejamento em ${dataBR(feito)}` : ''}</span>
      </div>
      <div class="acoes">
        <button class="btn btn-primario" id="concluir-plano">Concluir e ver lista</button>
      </div>`;
  }

  function renderPlanejar() {
    $('#plano-semana').textContent = rotuloSemanaPlanejada();
    $('#plano-refeicoes').innerHTML = ORDEM_REFEICOES.map((r) => cartaoPlanejar(r.id, r.nome)).join('');
    renderBarraPlano();
  }

  function atualizarCartaoPlano(refId, foco) {
    const nome = ORDEM_REFEICOES.find((r) => r.id === refId).nome;
    $(`#plano-${refId}`).outerHTML = cartaoPlanejar(refId, nome);
    renderBarraPlano();
    if (foco) {
      const alvo = document.querySelector(`#plano-${refId} select[data-dia="${foco.dia}"][data-campo="${foco.campo}"]${foco.item ? `[data-item="${foco.item}"]` : ''}`);
      if (alvo) alvo.focus();
    }
  }

  // Copia a escolha de um dia para os outros. Entre planos diferentes (low/high) a mesma
  // receita é achada pelo objeto da opção; os itens, pelo texto ou pelo ingrediente.
  function repetirEmTodos(diaOrigem, refId) {
    const rO = refeicaoDoDia(diaOrigem, refId);
    const eO = escolha(diaOrigem, refId);
    const opO = Math.min(eO.op, rO.opcoes.length - 1);
    const opcaoO = rO.opcoes[opO];
    const escolhidas = opcaoO.itens.map((alts, i) => alts[eO.alt[`${opO}-${i}`] || 0] || alts[0]);
    const textos = new Set(escolhidas.map((x) => x.t));
    const ings = new Set(escolhidas.map((x) => x.ing).filter(Boolean));

    DIAS.forEach((d) => {
      if (d.k === diaOrigem) return;
      const r = refeicaoDoDia(d.k, refId);
      const op = Math.max(0, r.opcoes.indexOf(opcaoO));
      const alt = {};
      r.opcoes[op].itens.forEach((alts, i) => {
        let j = alts.findIndex((x) => textos.has(x.t));
        if (j < 0) j = alts.findIndex((x) => x.ing && ings.has(x.ing));
        if (j > 0) alt[`${op}-${i}`] = j;
      });
      salvarEscolha(d.k, refId, { op, alt });
    });
  }

  // ---------- Supermercado ----------
  function precoDe(id) {
    return estado.precos[id] != null ? estado.precos[id] : INGREDIENTES[id].preco;
  }

  function necessidadeSemanal() {
    const total = {};
    DIAS.forEach((d) => {
      PLANOS[DIAS_PLANO[d.k]].refeicoes.forEach((r) => {
        const e = escolha(d.k, r.id);
        const op = Math.min(e.op, r.opcoes.length - 1);
        r.opcoes[op].itens.forEach((alts, i) => {
          const alt = alts[e.alt[`${op}-${i}`] || 0] || alts[0];
          if (!alt.ing) return;
          total[alt.ing] = (total[alt.ing] || 0) + alt.q;
        });
      });
    });
    return total;
  }

  function calcularCarrinho(periodo = estado.periodo) {
    const fator = periodo === 'mes' ? SEMANAS_POR_MES : 1;
    const semana = necessidadeSemanal();
    const linhas = Object.keys(semana).map((id) => {
      const info = INGREDIENTES[id];
      const qtd = semana[id] * fator;
      const embalagens = Math.max(1, Math.ceil(qtd / info.qtdEmb - 1e-9));
      const preco = precoDe(id);
      return { id, info, qtd, embalagens, preco, subtotal: embalagens * preco, tenho: !!estado.tenho[id] };
    });
    linhas.sort((x, y) => x.info.nome.localeCompare(y.info.nome, 'pt-BR'));
    return linhas;
  }

  function formatarQtd(info, q) {
    const ehPeso = /^(g|ml)/.test(info.un);
    if (ehPeso && q >= 1000) return `${num(q / 1000)} ${info.un.startsWith('ml') ? 'L' : 'kg'}${info.un.replace(/^(g|ml)/, '')}`;
    const valor = ehPeso ? (q >= 100 ? Math.round(q / 10) * 10 : Math.round(q)) : Math.round(q * 10) / 10;
    const unidade = ehPeso || valor <= 1 ? info.un : info.unP;
    return `${num(valor)} ${unidade}`;
  }

  function renderMercado() {
    const linhas = calcularCarrinho();
    const total = linhas.filter((l) => !l.tenho).reduce((s, l) => s + l.subtotal, 0);
    const itensComprar = linhas.filter((l) => !l.tenho).length;
    const ehMes = estado.periodo === 'mes';

    document.querySelectorAll('[data-periodo]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.periodo === estado.periodo)));
    $('#total-carrinho').textContent = reais(total);
    $('#total-sub').textContent = `${itensComprar} ${itensComprar === 1 ? 'item' : 'itens'} para ${ehMes ? 'o mês' : 'a semana'}`;
    $('#dica-mercado').textContent = ehMes
      ? 'Sugestão para o mês (≈ 4,3 semanas). Itens perecíveis aparecem marcados: compre esses aos poucos, toda semana, e estoque só o resto.'
      : 'Quantidades para os 7 dias, de acordo com as opções escolhidas no Cardápio. Marque o que você já tem em casa para tirar do total.';

    if (!linhas.length) {
      $('#lista-mercado').innerHTML = '<p class="vazio">Nada para comprar.</p>';
      return;
    }

    $('#lista-mercado').innerHTML = CATEGORIAS.map((cat) => {
      const doGrupo = linhas.filter((l) => l.info.cat === cat);
      if (!doGrupo.length) return '';
      const subtotal = doGrupo.filter((l) => !l.tenho).reduce((s, l) => s + l.subtotal, 0);
      return `<section class="categoria">
        <h3>${cat} <span>${reais(subtotal)}</span></h3>
        <ul class="produtos">
          ${doGrupo.map((l) => `<li class="produto${l.tenho ? ' tenho' : ''}">
            <input type="checkbox" data-tenho="${l.id}" ${l.tenho ? 'checked' : ''} aria-label="Já tenho ${esc(l.info.nome)}" title="Já tenho em casa">
            <div>
              <div class="produto-nome">${esc(l.info.nome)}</div>
              <div class="produto-det">
                Precisa de ≈ ${formatarQtd(l.info, l.qtd)} → ${l.embalagens} × ${esc(l.info.emb)}
                ${l.info.fonte === 'dieese' ? '<span class="selo selo-fonte">DIEESE</span>' : ''}
                ${ehMes && l.info.perecivel ? '<span class="selo selo-perecivel">perecível</span>' : ''}
              </div>
            </div>
            <div class="produto-preco">
              <div class="produto-subtotal">${reais(l.subtotal)}</div>
              <label class="produto-det">R$ <input class="preco-input" type="number" inputmode="decimal" min="0" step="0.01" value="${l.preco.toFixed(2)}" data-preco="${l.id}" aria-label="Preço por embalagem de ${esc(l.info.nome)}"> /emb.</label>
            </div>
          </li>`).join('')}
        </ul>
      </section>`;
    }).join('');
  }

  function textoLista() {
    const linhas = calcularCarrinho().filter((l) => !l.tenho);
    const titulo = estado.periodo === 'mes' ? 'Lista do mês' : 'Lista da semana';
    const partes = [`${titulo} · Dieta Shay`];
    CATEGORIAS.forEach((cat) => {
      const doGrupo = linhas.filter((l) => l.info.cat === cat);
      if (!doGrupo.length) return;
      partes.push('', cat.toUpperCase());
      doGrupo.forEach((l) => partes.push(`[ ] ${l.info.nome}: ${l.embalagens} × ${l.info.emb}`));
    });
    partes.push('', `Total estimado: ${reais(linhas.reduce((s, l) => s + l.subtotal, 0))}`);
    return partes.join('\n');
  }

  // ---------- Corpo ----------
  function medidasOrdenadas() {
    return [...estado.medidas].sort((x, y) => x.data.localeCompare(y.data));
  }

  function renderCampos() {
    $('#campos-medida').innerHTML = MEDIDAS.map((m) =>
      `<label class="campo">${m.nome} (${m.un})<input type="number" inputmode="decimal" step="0.1" min="0" name="${m.k}" ${m.k === 'peso' ? 'required' : ''}></label>`
    ).join('');
    $('#form-medida').data.value = hojeISO();
  }

  function deltaHtml(m, atual, anterior) {
    if (atual == null || anterior == null) return '';
    const d = Math.round((atual - anterior) * 10) / 10;
    if (d === 0) return '<span class="delta neutro">=</span>';
    const classe = m.menorMelhor ? (d < 0 ? 'desce' : 'sobe') : 'neutro';
    return `<span class="delta ${classe}">${d > 0 ? '▲ +' : '▼ '}${num(d)}</span>`;
  }

  function renderResumo(lista) {
    const ult = lista[lista.length - 1];
    const prim = lista[0];
    const ant = lista[lista.length - 2];
    const kpi = (rotulo, valor, sub) => `<div class="kpi"><div class="kpi-rotulo">${rotulo}</div><div class="kpi-valor">${valor}</div><div class="kpi-sub">${sub}</div></div>`;

    if (!ult) {
      $('#resumo-corpo').innerHTML = kpi('Comece por aqui', '—', 'Registre sua primeira medição abaixo');
      return;
    }

    const varia = (k) => (ult[k] != null && prim[k] != null ? ult[k] - prim[k] : null);
    const sinal = (v) => (v > 0 ? '+' : '') + num(v);
    const proxima = somaDias(ult.data, 7);
    const atrasada = proxima <= hojeISO();

    $('#resumo-corpo').innerHTML = [
      kpi('Peso atual', ult.peso != null ? `${num(ult.peso)} kg` : '—', `em ${dataBR(ult.data)}`),
      kpi('Desde o início', varia('peso') != null ? `${sinal(varia('peso'))} kg` : '—', `desde ${dataBR(prim.data)}`),
      kpi('Última semana', ant && ult.peso != null && ant.peso != null ? `${sinal(ult.peso - ant.peso)} kg` : '—', ant ? `vs. ${dataBR(ant.data)}` : 'precisa de 2 medições'),
      kpi('Cintura', ult.cintura != null ? `${num(ult.cintura)} cm` : '—', varia('cintura') != null ? `${sinal(varia('cintura'))} cm desde o início` : ''),
      kpi('Próxima medição', dataBR(proxima), atrasada ? 'já pode medir de novo' : 'a cada 7 dias'),
    ].join('');
  }

  let grafico = null;

  function corVar(nome) {
    return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
  }

  function renderGrafico(lista) {
    $('#metricas-grafico').innerHTML = [...MEDIDAS.map((m) => ({ k: m.k, nome: m.nome })), { k: 'todas', nome: 'Todas as medidas' }]
      .map((m) => `<button class="chip" data-metrica="${m.k}" aria-pressed="${m.k === estado.metrica}">${m.nome}</button>`).join('');

    const vazio = lista.length === 0;
    $('#grafico-vazio').hidden = !vazio;
    $('#grafico').hidden = vazio;
    if (vazio) return;
    if (typeof Chart === 'undefined') {
      $('#grafico-vazio').textContent = 'Sem internet para carregar o gráfico.';
      $('#grafico-vazio').hidden = false;
      return;
    }

    const paleta = [corVar('--primaria'), corVar('--acento'), corVar('--low'), '#9b59b6', '#16a085', '#d35454', '#7f8c8d'];
    const series = estado.metrica === 'todas' ? MEDIDAS.filter((m) => m.k !== 'peso') : MEDIDAS.filter((m) => m.k === estado.metrica);
    const datasets = series
      .map((m, i) => ({
        label: `${m.nome} (${m.un})`,
        data: lista.map((x) => (x[m.k] != null ? x[m.k] : null)),
        borderColor: paleta[i % paleta.length],
        backgroundColor: paleta[i % paleta.length],
        tension: 0.3,
        spanGaps: true,
        pointRadius: 4,
        borderWidth: 2.5,
      }))
      .filter((ds) => ds.data.some((v) => v != null));

    const texto = corVar('--suave');
    const grade = corVar('--borda');

    if (grafico) grafico.destroy();
    grafico = new Chart($('#grafico'), {
      type: 'line',
      data: { labels: lista.map((x) => dataCurta(x.data)), datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: datasets.length > 1, labels: { color: texto, boxWidth: 12 } },
          tooltip: { callbacks: { label: (c) => ` ${c.dataset.label}: ${num(c.parsed.y)}` } },
        },
        scales: {
          x: { ticks: { color: texto }, grid: { display: false } },
          y: { ticks: { color: texto }, grid: { color: grade } },
        },
      },
    });
  }

  function renderTabela(lista) {
    if (!lista.length) {
      $('#tabela-medidas').innerHTML = '<tbody><tr><td class="vazio">Nenhuma medição ainda.</td></tr></tbody>';
      return;
    }
    const cab = `<thead><tr><th>Data</th>${MEDIDAS.map((m) => `<th>${m.nome}</th>`).join('')}<th></th></tr></thead>`;
    const linhas = [...lista].reverse().map((x, i, arr) => {
      const ant = arr[i + 1];
      return `<tr>
        <td>${dataBR(x.data)}</td>
        ${MEDIDAS.map((m) => `<td>${x[m.k] != null ? num(x[m.k]) : '—'}${ant ? deltaHtml(m, x[m.k], ant[m.k]) : ''}</td>`).join('')}
        <td><div class="acoes-linha"><button class="link" data-editar="${x.id}">Editar</button><button class="link" data-excluir="${x.id}">Excluir</button></div></td>
      </tr>`;
    }).join('');
    $('#tabela-medidas').innerHTML = cab + `<tbody>${linhas}</tbody>`;
  }

  function renderCorpo() {
    const lista = medidasOrdenadas();
    renderResumo(lista);
    renderGrafico(lista);
    renderTabela(lista);
  }

  function limparForm() {
    const f = $('#form-medida');
    f.reset();
    f.data.value = hojeISO();
    estado.editando = null;
    $('#titulo-form').textContent = 'Nova medição';
    $('#cancelar-edicao').hidden = true;
  }

  function editarMedida(id) {
    const x = estado.medidas.find((m) => m.id === id);
    if (!x) return;
    const f = $('#form-medida');
    f.data.value = x.data;
    MEDIDAS.forEach((m) => (f[m.k].value = x[m.k] != null ? x[m.k] : ''));
    estado.editando = id;
    $('#titulo-form').textContent = `Editando medição de ${dataBR(x.data)}`;
    $('#cancelar-edicao').hidden = false;
    f.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function salvarMedida(ev) {
    ev.preventDefault();
    const f = ev.target;
    const registro = { id: estado.editando || String(Date.now()), data: f.data.value };
    MEDIDAS.forEach((m) => {
      const v = parseFloat(String(f[m.k].value).replace(',', '.'));
      registro[m.k] = Number.isFinite(v) ? v : null;
    });

    const mesmaData = estado.medidas.find((m) => m.data === registro.data && m.id !== registro.id);
    if (mesmaData && !confirm(`Já existe uma medição em ${dataBR(registro.data)}. Substituir?`)) return;

    estado.medidas = estado.medidas.filter((m) => m.id !== registro.id && m.data !== registro.data);
    estado.medidas.push(registro);
    store.set('medidas', estado.medidas);
    aviso(estado.editando ? 'Medição atualizada' : 'Medição salva');
    limparForm();
    renderCorpo();
  }

  // ---------- Backup ----------
  function exportar() {
    const dados = {};
    ['escolhas', 'medidas', 'precos', 'tenho', 'planejadoEm'].forEach((k) => (dados[k] = store.get(k, null)));
    const blob = new Blob([JSON.stringify({ app: 'dieta-shay', versao: 1, dados }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dieta-shay-${hojeISO()}.backup.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importar(arquivo) {
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        const json = JSON.parse(leitor.result);
        if (json.app !== 'dieta-shay') throw new Error('arquivo inválido');
        if (!confirm('Restaurar este backup? Os dados atuais serão substituídos.')) return;
        Object.entries(json.dados).forEach(([k, v]) => v != null && store.set(k, v));
        location.reload();
      } catch (e) {
        aviso('Arquivo de backup inválido');
      }
    };
    leitor.readAsText(arquivo);
  }

  // ---------- Eventos ----------
  function ligarEventos() {
    document.querySelector('.abas').addEventListener('click', (e) => {
      const b = e.target.closest('[data-aba]');
      if (b) mostrarAba(b.dataset.aba);
    });

    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-ir]');
      if (!b) return;
      if (b.dataset.ir === 'planejar') abrirPlanejar();
      else mostrarAba(b.dataset.ir);
    });

    $('#fechar-planejar').addEventListener('click', () => $('#painel-planejar').close());
    // Fechando por botão, Esc ou "Concluir", a aba de trás mostra as escolhas novas
    $('#painel-planejar').addEventListener('close', renderAbaAtual);

    $('#plano-refeicoes').addEventListener('change', (e) => {
      const s = e.target.closest('select[data-campo]');
      if (!s) return;
      const { dia, ref, campo, item } = s.dataset;
      const atual = escolha(dia, ref);
      if (campo === 'op') salvarEscolha(dia, ref, { ...atual, op: Number(s.value) });
      else salvarEscolha(dia, ref, { ...atual, alt: { ...atual.alt, [item]: Number(s.value) } });
      // Ao trocar a opção os itens mudam, então o foco volta para o seletor de opção
      atualizarCartaoPlano(ref, { dia, campo, item: campo === 'alt' ? item : null });
    });

    $('#plano-refeicoes').addEventListener('click', (e) => {
      const b = e.target.closest('[data-copiar]');
      if (!b) return;
      repetirEmTodos(b.dataset.copiar, b.dataset.ref);
      atualizarCartaoPlano(b.dataset.ref);
      aviso('Escolha repetida em todos os dias');
    });

    $('#barra-plano').addEventListener('click', (e) => {
      if (!e.target.closest('#concluir-plano')) return;
      store.set('planejadoEm', hojeISO());
      estado.periodo = 'semana';
      $('#painel-planejar').close();
      mostrarAba('mercado');
      aviso('Semana planejada!');
    });

    $('#lista-dias').addEventListener('click', (e) => {
      const b = e.target.closest('[data-dia]');
      if (!b) return;
      estado.dia = b.dataset.dia;
      renderCardapio();
    });

    $('#refeicoes').addEventListener('click', (e) => {
      const chip = e.target.closest('[data-op]');
      if (chip) {
        const atual = escolha(estado.dia, chip.dataset.ref);
        salvarEscolha(estado.dia, chip.dataset.ref, { ...atual, op: Number(chip.dataset.op) });
        renderCardapio();
        return;
      }
      const alt = e.target.closest('[data-alt]');
      if (alt) {
        const atual = escolha(estado.dia, alt.dataset.ref);
        salvarEscolha(estado.dia, alt.dataset.ref, { ...atual, alt: { ...atual.alt, [alt.dataset.item]: Number(alt.dataset.alt) } });
        renderCardapio();
      }
    });

    document.querySelector('.segmento').addEventListener('click', (e) => {
      const b = e.target.closest('[data-periodo]');
      if (!b) return;
      estado.periodo = b.dataset.periodo;
      renderMercado();
    });

    $('#lista-mercado').addEventListener('change', (e) => {
      const t = e.target;
      if (t.dataset.tenho) {
        if (t.checked) estado.tenho[t.dataset.tenho] = true;
        else delete estado.tenho[t.dataset.tenho];
        store.set('tenho', estado.tenho);
        renderMercado();
      } else if (t.dataset.preco) {
        const v = parseFloat(String(t.value).replace(',', '.'));
        if (Number.isFinite(v) && v >= 0) {
          estado.precos[t.dataset.preco] = v;
          store.set('precos', estado.precos);
          aviso('Preço atualizado');
        }
        renderMercado();
      }
    });

    $('#limpar-tenho').addEventListener('click', () => {
      estado.tenho = {};
      store.set('tenho', estado.tenho);
      renderMercado();
    });

    $('#restaurar-precos').addEventListener('click', () => {
      if (!confirm('Voltar todos os preços para os valores de referência?')) return;
      estado.precos = {};
      store.set('precos', estado.precos);
      renderMercado();
      aviso('Preços restaurados');
    });

    $('#copiar-lista').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(textoLista());
        aviso('Lista copiada');
      } catch (e) {
        aviso('Não foi possível copiar');
      }
    });

    $('#form-medida').addEventListener('submit', salvarMedida);
    $('#cancelar-edicao').addEventListener('click', limparForm);

    $('#tabela-medidas').addEventListener('click', (e) => {
      const ed = e.target.closest('[data-editar]');
      if (ed) return editarMedida(ed.dataset.editar);
      const ex = e.target.closest('[data-excluir]');
      if (ex && confirm('Excluir esta medição?')) {
        estado.medidas = estado.medidas.filter((m) => m.id !== ex.dataset.excluir);
        store.set('medidas', estado.medidas);
        renderCorpo();
      }
    });

    $('#metricas-grafico').addEventListener('click', (e) => {
      const b = e.target.closest('[data-metrica]');
      if (!b) return;
      estado.metrica = b.dataset.metrica;
      renderGrafico(medidasOrdenadas());
    });

    $('#exportar').addEventListener('click', exportar);
    $('#importar').addEventListener('change', (e) => e.target.files[0] && importar(e.target.files[0]));

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => estado.aba === 'corpo' && renderCorpo());
  }

  // ---------- Início ----------
  renderCampos();
  renderCardapio();
  ligarEventos();
  mostrarAba(estado.aba);

  // Atualiza o destaque da refeição atual a cada minuto
  setInterval(() => estado.aba === 'dias' && renderCardapio(), 60000);
})();
