/**
 * AutoElite — script.js
 * Veículos Premium | Simulação de Compras
 * ================================================
 * Funcionalidades:
 *  - Tema Claro / Escuro (persiste via localStorage)
 *  - Simulador de compra com validação
 *  - Preview em tempo real do pedido
 *  - Modal de resultado
 *  - Formulário de contato com validação
 *  - Toast notifications
 *  - Scroll reveal animation
 *  - Navbar responsiva (hamburger)
 */

/* ========================================================
   1. CONFIGURAÇÃO DOS PRODUTOS
   ======================================================== */

const PRODUTOS = {
  ferrari: {
    nome: 'Ferrari F8 Tributo',
    preco: 2800000,
    imagem: 'assets/img/ferrari-f8-tributo.jpg',
  },
  porsche: {
    nome: 'Porsche Panamera',
    preco: 1950000,
    imagem: 'assets/img/porsche-panamera.jpg',
  },
  lamborghini: {
    nome: 'Lamborghini Urus',
    preco: 2350000,
    imagem: 'assets/img/lamborghini-urus.webp',
  },
  bentley: {
    nome: 'Bentley Bentayga',
    preco: 3200000,
    imagem: 'assets/img/bentley-bentayga.webp',
  },
  mclaren: {
    nome: 'McLaren 720S',
    preco: 2100000,
    imagem: 'assets/img/mclaren-720s.jpg',
  },
  tesla: {
    nome: 'Tesla Model S Plaid',
    preco: 890000,
    imagem: 'assets/img/tesla-model-s-plaid.jpg',
  },
};

const DESCONTO_MIN_UNIDADES = 3;
const DESCONTO_PERCENTUAL = 0.05;
const QTD_MAX = 10;

/* ========================================================
   2. CARRINHO / SELEÇÃO DE VEÍCULOS
   ======================================================== */

const carrinho = {
  itens: Object.create(null), // { id: { qtd, preco, nome } }
  
  adicionar(id, qtd) {
    if (!Object.prototype.hasOwnProperty.call(PRODUTOS, id)) return false;
    const produto = PRODUTOS[id];

    const qtdInformada = Math.floor(Number(qtd));
    if (!Number.isFinite(qtdInformada) || qtdInformada < 1) return false;

    const qtdNumerica = Math.min(QTD_MAX, qtdInformada);
    
    if (this.itens[id]) {
      this.itens[id].qtd += qtdNumerica;
      if (this.itens[id].qtd > QTD_MAX) {
        this.itens[id].qtd = QTD_MAX;
      }
    } else {
      this.itens[id] = {
        nome: produto.nome,
        preco: produto.preco,
        qtd: qtdNumerica
      };
    }
    
    this.atualizarUI();
    return true;
  },
  
  remover(id) {
    delete this.itens[id];
    this.atualizarUI();
  },
  
  limpar() {
    this.itens = Object.create(null);
    this.atualizarUI();
  },
  
  getTotalQtd() {
    return Object.values(this.itens).reduce((sum, item) => sum + item.qtd, 0);
  },
  
  getSubtotal() {
    return Object.values(this.itens).reduce((sum, item) => sum + (item.qtd * item.preco), 0);
  },
  
  getDesconto() {
    const totalQtd = this.getTotalQtd();
    if (totalQtd >= DESCONTO_MIN_UNIDADES) {
      return this.getSubtotal() * DESCONTO_PERCENTUAL;
    }
    return 0;
  },
  
  getTotal() {
    return this.getSubtotal() - this.getDesconto();
  },
  
  temItens() {
    return Object.keys(this.itens).length > 0;
  },
  
  atualizarUI() {
    // Atualiza contador no botão flutuante
    const countEl = document.getElementById('cart-count');
    const cartBtn = document.getElementById('floating-cart');
    const totalQtd = this.getTotalQtd();
    
    if (countEl) {
      countEl.textContent = totalQtd;
    }
    
    if (cartBtn) {
      cartBtn.setAttribute('title', `Resumo do pedido (${totalQtd} ${totalQtd === 1 ? 'item' : 'itens'})`);
      cartBtn.setAttribute('aria-label', `Ver resumo do pedido (${totalQtd} ${totalQtd === 1 ? 'item' : 'itens'})`);
    }
    
    // Atualiza modal se estiver aberto
    const cartModal = document.getElementById('cart-modal-overlay');
    if (cartModal && cartModal.style.display === 'flex') {
      this.renderCartModal();
    }
  },
  
  renderCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartDiscount = document.getElementById('cart-discount');
    const cartDiscountRow = document.getElementById('cart-discount-row');
    const cartTotal = document.getElementById('cart-total');
    const btnFinalize = document.getElementById('btn-cart-finalize');
    
    if (!cartItems) return;
    
    if (!this.temItens()) {
      cartItems.style.display = 'none';
      cartSummary.style.display = 'none';
      cartEmpty.style.display = 'flex';
      if (btnFinalize) btnFinalize.disabled = true;
      return;
    }
    
    cartEmpty.style.display = 'none';
    cartItems.style.display = 'flex';
    cartSummary.style.display = 'block';
    if (btnFinalize) btnFinalize.disabled = false;
    
    // Render items
    cartItems.innerHTML = '';
    Object.entries(this.itens).forEach(([id, item]) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-icon" style="overflow: hidden; padding: 0;">
          ${PRODUTOS[id]?.imagem 
            ? `<img src="${escaparHTML(PRODUTOS[id].imagem)}" alt="${escaparHTML(item.nome)}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md);" />`
            : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>`}
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${escaparHTML(item.nome)}</div>
          <div class="cart-item-qty-price">
            <span class="cart-item-qty">${escaparHTML(item.qtd)} unid.</span>
            <span class="cart-item-divider">×</span>
            <span class="cart-item-unit-price">${formatarMoeda(item.preco)}</span>
          </div>
        </div>
        <div class="cart-item-total">${formatarMoeda(item.qtd * item.preco)}</div>
      `;
      cartItems.appendChild(div);
    });
    
    // Update summary
    const subtotal = this.getSubtotal();
    const desconto = this.getDesconto();
    const total = this.getTotal();
    
    if (cartSubtotal) cartSubtotal.textContent = formatarMoeda(subtotal);
    if (cartDiscount) cartDiscount.textContent = formatarMoeda(desconto);
    if (cartDiscountRow) cartDiscountRow.style.display = desconto > 0 ? 'flex' : 'none';
    if (cartTotal) cartTotal.textContent = formatarMoeda(total);
  }
};

/* ========================================================
   3. UTILITÁRIOS
   ======================================================== */

/**
 * Escapa caracteres especiais para inserção segura em HTML.
 * @param {*} valor
 * @returns {string}
 */
function escaparHTML(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Remove caracteres de controle e normaliza espaços de entradas de texto.
 * @param {*} valor
 * @param {boolean} permitirQuebraLinha
 * @returns {string}
 */
function sanitizarTexto(valor, permitirQuebraLinha = false) {
  const caracteresControle = permitirQuebraLinha
    ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
    : /[\u0000-\u001F\u007F]/g;
  return String(valor ?? '').replace(caracteresControle, '').trim();
}

/**
 * Formata um número como moeda BRL.
 * @param {number} valor
 * @returns {string}
 */
function formatarMoeda(valor) {
  const numero = Number.isFinite(Number(valor)) ? Number(valor) : 0;
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Exibe uma notificação toast temporária.
 * @param {string} mensagem
 * @param {'success'|'error'|'info'|'warning'} tipo
 * @param {number} duracao - ms antes de sumir
 */
function exibirToast(mensagem, tipo = 'info', duracao = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const iconesSvg = {
    success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <span class="toast__icon">${iconesSvg[tipo] || iconesSvg.info}</span>
    <span class="toast__msg">${escaparHTML(mensagem)}</span>
  `;

  container.appendChild(toast);

  const timer = setTimeout(() => {
    toast.classList.add('exit');
    toast.addEventListener('animationend', () => toast.remove());
  }, duracao);

  // Clique para fechar antecipadamente
  toast.addEventListener('click', () => {
    clearTimeout(timer);
    toast.classList.add('exit');
    toast.addEventListener('animationend', () => toast.remove());
  });
}

/* ========================================================
   3. TEMA CLARO / ESCURO
   ======================================================== */

(function inicializarTema() {
  const temaSalvo = localStorage.getItem('autoelite-tema');
  const temaPreferido = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const tema = (temaSalvo === 'light' || temaSalvo === 'dark') ? temaSalvo : temaPreferido;
  document.documentElement.setAttribute('data-theme', tema);
  atualizarIconeTema(tema);
})();

function alternarTema() {
  const html = document.documentElement;
  const temaAtual = html.getAttribute('data-theme');
  const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', novoTema);
  localStorage.setItem('autoelite-tema', novoTema);
  atualizarIconeTema(novoTema);
  exibirToast(
    novoTema === 'dark' ? 'Tema escuro ativado' : 'Tema claro ativado',
    'info',
    2000
  );
}

function atualizarIconeTema(tema) {
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    const sunIcon = btn.querySelector('.sun');
    const moonIcon = btn.querySelector('.moon');
    if (tema === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
      btn.setAttribute('aria-label', 'Ativar tema claro');
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
      btn.setAttribute('aria-label', 'Ativar tema escuro');
    }
  }
}

/* ========================================================
   4. NAVBAR — SCROLL & HAMBURGER
   ======================================================== */

function inicializarNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navbar-links');
  const themeToggle = document.getElementById('theme-toggle');

  // Scroll: adiciona classe 'scrolled'
  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const aberto = navLinks.classList.toggle('mobile-open');
      hamburger.classList.toggle('active', aberto);
      hamburger.setAttribute('aria-expanded', String(aberto));
    });

    // Fechar ao clicar em um link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Fechar menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks && navLinks.classList.remove('mobile-open');
      hamburger && hamburger.classList.remove('active');
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Tema toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', alternarTema);
  }
}

/* ========================================================
   5. SIMULADOR — VALIDAÇÃO E CÁLCULO
   ======================================================== */

/**
 * Altera a quantidade de um produto via botões + / −
 * @param {string} id - chave do produto em PRODUTOS
 * @param {number} delta - +1 ou -1
 */
function alterarQtd(id, delta) {
  const input = document.getElementById(`qty-${id}`);
  if (!input) return;

  let val = parseInt(input.value, 10);
  if (isNaN(val)) val = 0;

  const novoVal = Math.min(Math.max(val + delta, 0), QTD_MAX);
  input.value = novoVal;

  validarInput(input);
  atualizarPreview();
}

/**
 * Valida um input de quantidade do simulador.
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function validarInput(input) {
  const id = input.id.replace('qty-', '');
  const errorEl = document.getElementById(`error-${id}`);
  let val = sanitizarTexto(input.value);
  let erro = '';

  // Campo obrigatório (pode ser 0)
  if (val === '') {
    erro = 'Informe uma quantidade (0 para nenhum).';
  } else if (!/^\d+$/.test(val)) {
    erro = 'Apenas números inteiros positivos.';
  } else {
    const num = parseInt(val, 10);
    if (num < 0) {
      erro = 'A quantidade não pode ser negativa.';
    } else if (num > QTD_MAX) {
      erro = `Máximo ${QTD_MAX} unidades por modelo.`;
      input.value = QTD_MAX;
    }
  }

  if (errorEl) errorEl.textContent = erro;
  input.classList.toggle('error', erro !== '');

  return erro === '';
}

/**
 * Lê os inputs do simulador e retorna dados estruturados.
 * @returns {{ itens: Array, subtotal: number, totalQtd: number, valido: boolean }}
 */
function lerSimulador() {
  let subtotal = 0;
  let totalQtd = 0;
  let valido = true;
  const itens = [];

  for (const [id, produto] of Object.entries(PRODUTOS)) {
    const input = document.getElementById(`qty-${id}`);
    if (!input) continue;

    const ok = validarInput(input);
    if (!ok) { valido = false; continue; }

    const qtd = parseInt(input.value, 10) || 0;
    const valor = qtd * produto.preco;
    subtotal += valor;
    totalQtd += qtd;

    if (qtd > 0) {
      itens.push({ id, ...produto, qtd, valor });
    }
  }

  return { itens, subtotal, totalQtd, valido };
}

/**
 * Atualiza o painel de preview em tempo real.
 */
function atualizarPreview() {
  const previewEmpty = document.getElementById('preview-empty');
  const previewList = document.getElementById('preview-list');
  const previewTotal = document.getElementById('preview-total');
  const previewSubtotal = document.getElementById('preview-subtotal');
  const previewDiscount = document.getElementById('preview-discount');
  const previewDiscountRow = document.getElementById('preview-discount-row');
  const previewGrandTotal = document.getElementById('preview-grand-total');

  if (!previewList) return;

  const { itens, subtotal, totalQtd } = lerSimulador();

  // Atualiza lista
  previewList.innerHTML = '';

  if (itens.length === 0) {
    previewEmpty && (previewEmpty.style.display = '');
    previewTotal && (previewTotal.style.display = 'none');
    return;
  }

  previewEmpty && (previewEmpty.style.display = 'none');
  previewTotal && (previewTotal.style.display = 'flex');

  itens.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="item-name">${escaparHTML(item.nome)}</span>
      <span class="item-qty">× ${escaparHTML(item.qtd)}</span>
      <span class="item-value">${formatarMoeda(item.valor)}</span>
    `;
    previewList.appendChild(li);
  });

  // Desconto
  const temDesconto = totalQtd >= DESCONTO_MIN_UNIDADES;
  const valorDesconto = temDesconto ? subtotal * DESCONTO_PERCENTUAL : 0;
  const total = subtotal - valorDesconto;

  if (previewSubtotal) previewSubtotal.textContent = formatarMoeda(subtotal);
  if (previewDiscountRow) previewDiscountRow.style.display = temDesconto ? 'flex' : 'none';
  if (previewDiscount) previewDiscount.textContent = `- ${formatarMoeda(valorDesconto)}`;
  if (previewGrandTotal) previewGrandTotal.textContent = formatarMoeda(total);
}

/**
 * Simulação com prompt() / Number() / alert() — Requisito do Desafio
 * Pergunta quantidade de cada produto via prompt, converte com Number(),
 * calcula preço × quantidade, exibe resultado com alert().
 */
async function simularComPrompt() {
  const produtos = [
    { id: 'ferrari', nome: 'Ferrari F8 Tributo', preco: 2800000 },
    { id: 'porsche', nome: 'Porsche Panamera', preco: 1950000 },
    { id: 'lamborghini', nome: 'Lamborghini Urus', preco: 2350000 },
    { id: 'bentley', nome: 'Bentley Bentayga', preco: 3200000 },
    { id: 'mclaren', nome: 'McLaren 720S', preco: 2100000 },
    { id: 'tesla', nome: 'Tesla Model S Plaid', preco: 890000 },
  ];

  let total = 0;
  let itensSelecionados = [];
  let algumSelecionado = false;

  await mostrarCustomAlert(
    'Bem-vindo ao simulador oficial!\n\n' +
    'Vamos configurar seu pedido ideal.\n' +
    'Para cada veículo, digite a quantidade desejada.\n\n' +
    'Digite 0 para pular o modelo.',
    'info',
    'AUTOELITE — SIMULADOR'
  );

  for (const produto of produtos) {
    const precoStr = formatarMoeda(produto.preco);
    const qtd = await mostrarCustomPrompt(
      `🏎️  ${produto.nome}\n\n` +
      `💰 Preço unitário: ${precoStr}\n\n` +
      `📦 Quantas unidades deseja?`,
      '0 para não incluir',
      0,
      'Quantidade',
      `<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>`
    );

    if (qtd === null) {
      // Usuário cancelou - pular este modelo
      continue;
    }

    if (!Number.isFinite(qtd) || !Number.isInteger(qtd) || qtd < 0 || qtd > QTD_MAX) {
      await mostrarCustomAlert(
        `O valor informado para "${produto.nome}" não é válido.\n\n` +
        `Use um número inteiro entre 0 e ${QTD_MAX}.\n` +
        `Consideraremos 0 unidade(s) para este modelo.`,
        'warning',
        'Entrada Inválida'
      );
      continue;
    }

    if (qtd > 0) {
      algumSelecionado = true;
      const valor = qtd * produto.preco;
      total += valor;
      itensSelecionados.push({ nome: produto.nome, qtd, valor, preco: produto.preco });
    }
  }

  if (!algumSelecionado) {
    await mostrarCustomAlert(
      'Nenhum veículo foi selecionado.\n\n' +
      'Seu pedido não foi gerado.\n' +
      'Estamos à disposição quando quiser simular uma compra!',
      'info',
      'Pedido Vazio'
    );
    return;
  }

  // Monta resumo personalizado
  let mensagem = '';
  itensSelecionados.forEach(item => {
    mensagem += `🚗 ${item.nome}\n`;
    mensagem += `   ${item.qtd} unid. × ${formatarMoeda(item.preco)} = ${formatarMoeda(item.valor)}\n\n`;
  });

  mensagem += `────────────────────────────────────\n`;
  mensagem += `TOTAL DO PEDIDO: ${formatarMoeda(total)}\n\n`;
  mensagem += '✅ Simulação concluída com sucesso!\n\n';
  mensagem += 'Nossa equipe comercial entrará em contato\npara finalizar os detalhes e condições de pagamento.\n\n';
  mensagem += 'Obrigado por escolher a AutoElite!';

  await mostrarCustomAlert(mensagem, 'success', 'Resumo do Pedido');
}

/**
 * Adiciona veículo ao carrinho via prompt() — Para uso nos cards
 * @param {string} id - ID do produto
 */
async function simularProdutoComPrompt(id) {
  if (!Object.prototype.hasOwnProperty.call(PRODUTOS, id)) return;
  const produto = PRODUTOS[id];

  const precoStr = formatarMoeda(produto.preco);
  const qtd = await mostrarCustomPrompt(
    `🏎️  ${produto.nome}\n\n` +
    `💰 Preço unitário: ${precoStr}\n\n` +
    `📦 Quantas unidades deseja adicionar?`,
    '0 para cancelar',
    0,
    'Quantidade',
    `<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>`
  );

  if (qtd === null) {
    // Usuário cancelou
    return;
  }

  if (!Number.isFinite(qtd) || !Number.isInteger(qtd) || qtd < 0 || qtd > QTD_MAX) {
    await mostrarCustomAlert(
      `O valor informado não é válido.\n\n` +
      `Use um número inteiro entre 0 e ${QTD_MAX}.\n` +
      `Consideraremos 0 unidade(s) para ${produto.nome}.`,
      'warning',
      'Entrada Inválida'
    );
    return;
  }

  if (qtd === 0) {
    return;
  }

  const adicionado = carrinho.adicionar(id, qtd);
  
  if (adicionado) {
    exibirToast(`${qtd}× ${produto.nome} adicionado ao pedido!`, 'success');
    abrirCartModal();
  } else {
    exibirToast('Não foi possível adicionar ao pedido.', 'error');
  }
}

/**
 * Simula a compra — valida, calcula e exibe modal.
 * Correspondente ao requisito: prompt() / Number() / alert()
 * (Implementado com modal customizado para melhor UX,
 *  mantendo compatibilidade com o conceito exigido)
 */
async function simularCompra() {
  try {
    // Usa dados do carrinho em vez do simulador antigo
    if (!carrinho.temItens()) {
      exibirToast('Nenhum veículo foi selecionado. Informe ao menos 1 veículo.', 'warning');
      await mostrarCustomAlert(
        'Nenhum veículo foi selecionado no carrinho!\n\n' +
        'Adicione veículos clicando em "Simular compra" nos cards.',
        'warning',
        'Pedido Vazio'
      );
      return;
    }

    // Fecha o modal do carrinho para exibir o resumo do pedido
    fecharCartModal();

    const itens = Object.entries(carrinho.itens).map(([id, item]) => ({
      nome: item.nome,
      qtd: item.qtd,
      preco: item.preco,
      valor: item.qtd * item.preco
    }));

    const subtotal = carrinho.getSubtotal();
    const totalQtd = carrinho.getTotalQtd();
    const temDesconto = totalQtd >= DESCONTO_MIN_UNIDADES;
    const valorDesconto = temDesconto ? subtotal * DESCONTO_PERCENTUAL : 0;
    const total = subtotal - valorDesconto;

    // Monta mensagem resumida (requisito: alert com itens e total)
    let mensagemAlert = '';
    itens.forEach(item => {
      mensagemAlert += `🏎️ ${item.nome} (${item.qtd}x) — ${formatarMoeda(item.valor)}\n`;
    });

    mensagemAlert += '─────────────────────────────\n';
    if (temDesconto) {
      mensagemAlert += `Subtotal: ${formatarMoeda(subtotal)}\n`;
      mensagemAlert += `Desconto (5%): -${formatarMoeda(valorDesconto)}\n`;
      mensagemAlert += '─────────────────────────────\n';
    }
    mensagemAlert += `TOTAL: ${formatarMoeda(total)}\n\n`;
    if (temDesconto) mensagemAlert += '🎁 Desconto de 5% aplicado!\n';
    mensagemAlert += 'Nossa equipe entrará em contato em breve.';

    // Exibe alert (conforme requisito do desafio)
    await mostrarCustomAlert(mensagemAlert, 'success', 'Resumo da Compra');

    // Também abre o modal customizado
    exibirModal(itens, subtotal, total, valorDesconto, temDesconto);

  } catch (erro) {
    console.error('Erro ao simular compra:', erro);
    exibirToast('Ocorreu um erro inesperado. Por favor, tente novamente.', 'error');
  }
}

/**
 * Adiciona o produto ao simulador ao clicar em "+ Simular" no card.
 * @param {string} id
 */
function adicionarAoSimulador(id) {
  try {
    const input = document.getElementById(`qty-${id}`);
    if (!input) throw new Error(`Input qty-${id} não encontrado.`);

    let val = parseInt(input.value, 10) || 0;
    if (val < QTD_MAX) {
      val += 1;
      input.value = val;
      validarInput(input);
      atualizarPreview();
      const produto = PRODUTOS[id];
      if (produto) {
        exibirToast(`${produto.nome} adicionado ao simulador!`, 'success');
      }
    } else {
      exibirToast(`Máximo de ${QTD_MAX} unidades por modelo.`, 'warning');
    }

    // Rola até o simulador
    document.getElementById('simulacao')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (erro) {
    console.error('Erro ao adicionar ao simulador:', erro);
    exibirToast('Não foi possível adicionar o produto.', 'error');
  }
}

/**
 * Reseta todos os inputs do simulador.
 */
function resetarSimulador() {
  Object.keys(PRODUTOS).forEach(id => {
    const input = document.getElementById(`qty-${id}`);
    const errorEl = document.getElementById(`error-${id}`);
    if (input) {
      input.value = 0;
      input.classList.remove('error');
    }
    if (errorEl) errorEl.textContent = '';
  });

  atualizarPreview();
  exibirToast('Simulador limpo com sucesso.', 'info', 2000);
}

/* ========================================================
   6. MODAL DE RESULTADO
   ======================================================== */

function exibirModal(itens, subtotal, total, valorDesconto, temDesconto) {
  const overlay = document.getElementById('modal-overlay');
  const body = document.getElementById('modal-body');

  if (!overlay || !body) return;

  let html = '';

  itens.forEach(item => {
    html += `
      <div class="modal-item">
        <span class="modal-item-name">${escaparHTML(item.nome)} × ${escaparHTML(item.qtd)}</span>
        <span class="modal-item-value">${formatarMoeda(item.valor)}</span>
      </div>
    `;
  });

  html += '<div class="modal-total">';

  if (temDesconto) {
    html += `
      <div class="modal-item">
        <span class="modal-item-name">Subtotal</span>
        <span class="modal-item-value">${formatarMoeda(subtotal)}</span>
      </div>
      <div class="modal-item">
        <span class="modal-item-name modal-discount">Desconto (5%)</span>
        <span class="modal-item-value modal-discount">- ${formatarMoeda(valorDesconto)}</span>
      </div>
    `;
  }

  html += `
      <div class="modal-item">
        <span class="modal-item-name" style="font-weight:800;">Total</span>
        <span class="modal-item-value" style="font-size:1.25rem; color:var(--color-accent);">${formatarMoeda(total)}</span>
      </div>
    </div>
  `;

  if (temDesconto) {
    html += `<p style="margin-top:1rem; font-size:0.875rem; color:var(--color-accent); font-weight:600;">Você ganhou 5% de desconto por comprar ${itens.reduce((acc, i) => acc + i.qtd, 0)} ou mais veículos!</p>`;
  }

  html += `<p style="margin-top:1rem; font-size:0.875rem; color:var(--text-muted);">Nossa equipe entrará em contato em até <strong>24 horas</strong> para finalizar sua compra.</p>`;

  body.innerHTML = html;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close')?.focus();
}

function fecharModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

/* ========================================================
   CUSTOM ALERT / PROMPT MODALS
   ======================================================== */

// Custom Alert - substitui alert() nativo
function mostrarCustomAlert(mensagem, tipo = 'info', titulo = '') {
  return new Promise((resolve) => {
    const overlay = document.getElementById('custom-alert-overlay');
    const modal = document.getElementById('custom-alert-modal');
    const icon = document.getElementById('custom-alert-icon');
    const title = document.getElementById('custom-alert-title');
    const body = document.getElementById('custom-alert-body');
    const btnOk = document.getElementById('custom-alert-ok');

    if (!overlay || !modal) {
      resolve();
      return;
    }

    // Configurar ícone e título baseado no tipo
    const icons = {
      info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
      success: '<polyline points="20 6 9 17 4 12"/>',
      error: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
    };

    const titles = {
      info: 'Informação',
      success: 'Sucesso',
      error: 'Erro',
      warning: 'Atenção'
    };

    if (icon) icon.innerHTML = icons[tipo] || icons.info;
    if (title) title.textContent = titulo || titles[tipo] || 'AutoElite';
    if (body) body.innerHTML = `<p>${escaparHTML(mensagem).replace(/\n/g, '<br>')}</p>`;

    // Função para fechar
    const fechar = () => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      btnOk.removeEventListener('click', fechar);
      overlay.removeEventListener('click', overlayClick);
      document.removeEventListener('keydown', keyHandler);
      resolve();
    };

    const overlayClick = (e) => {
      if (e.target === overlay) fechar();
    };

    const keyHandler = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') fechar();
    };

    btnOk.addEventListener('click', fechar);
    overlay.addEventListener('click', overlayClick);
    document.addEventListener('keydown', keyHandler);

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    btnOk.focus();
  });
}

// Wrapper síncrono para compatibilidade com código existente
function customAlert(mensagem, tipo = 'info') {
  return mostrarCustomAlert(mensagem, tipo);
}

/**
 * Modais informativos para Termos de Uso e Políticas de Privacidade
 */
function abrirTermosDeUso(e) {
  if (e && e.preventDefault) e.preventDefault();
  mostrarCustomAlert(
    'Estes Termos de Uso regem a utilização da plataforma AutoElite:\n\n' +
    '1. Finalidade: Apresentação de veículos de alto padrão e simulação interativa de compra.\n' +
    '2. Simulação Comercial: Todos os cálculos de descontos progressivos e parcelas têm finalidade demonstrativa.\n' +
    '3. Atendimento Concierge: O envio de mensagens pelo formulário gera uma solicitação direta à nossa equipe de especialistas.\n' +
    '4. Condições Comerciais: Preços e disponibilidades sujeitos a confirmação cadastral.',
    'info',
    'Termos de Uso — AutoElite'
  );
}

function abrirPoliticaPrivacidade(e) {
  if (e && e.preventDefault) e.preventDefault();
  mostrarCustomAlert(
    'A AutoElite preza pela confidencialidade e segurança total dos seus dados pessoais:\n\n' +
    '1. Coleta Responsável: Coletamos nome, e-mail e telefone estritamente para simulação e atendimento comercial exclusivo.\n' +
    '2. Armazenamento Local Seguro: Suas preferências de tema (claro/escuro) e veículos no carrinho permanecem salvas localmente no seu dispositivo.\n' +
    '3. Sigilo Total: Nunca comercializamos nem compartilhamos seus dados com terceiros.\n' +
    '4. Conformidade LGPD: Garantimos total transparência e cumprimento das normas brasileiras de privacidade.',
    'info',
    'Política de Privacidade — AutoElite'
  );
}

function abrirPoliticaCookies(e) {
  if (e && e.preventDefault) e.preventDefault();
  mostrarCustomAlert(
    'Utilizamos apenas armazenamento local essencial (localStorage) para:\n\n' +
    '• Lembrar sua escolha de Tema (Claro ou Escuro);\n' +
    '• Preservar os veículos adicionados durante a sua simulação de compra.\n\n' +
    'Não utilizamos nenhum cookie espião ou rastreador de terceiros.',
    'info',
    'Política de Cookies — AutoElite'
  );
}

// Custom Prompt - substitui prompt() nativo
function mostrarCustomPrompt(mensagem, hint = '', valorPadrao = 0, titulo = 'Quantidade', iconSvg = '') {
  return new Promise((resolve) => {
    const overlay = document.getElementById('custom-prompt-overlay');
    const modal = document.getElementById('custom-prompt-modal');
    const icon = document.getElementById('custom-prompt-icon');
    const title = document.getElementById('custom-prompt-title');
    const msgEl = document.getElementById('custom-prompt-message');
    const hintEl = document.getElementById('custom-prompt-hint');
    const input = document.getElementById('custom-prompt-input');
    const btnCancel = document.getElementById('custom-prompt-cancel');
    const btnConfirm = document.getElementById('custom-prompt-confirm');

    if (!overlay || !modal) {
      resolve(null);
      return;
    }

    if (icon && iconSvg) icon.innerHTML = iconSvg;
    if (title) title.textContent = titulo;
    if (msgEl) msgEl.innerHTML = escaparHTML(mensagem).replace(/\n/g, '<br>');
    if (hintEl) hintEl.textContent = hint;
    if (input) {
      input.value = valorPadrao;
      input.min = 0;
      input.max = QTD_MAX;
    }

    const fechar = (valor) => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      btnCancel.removeEventListener('click', onCancel);
      btnConfirm.removeEventListener('click', onConfirm);
      overlay.removeEventListener('click', overlayClick);
      document.removeEventListener('keydown', keyHandler);
      resolve(valor);
    };

    const onCancel = () => fechar(null);
    const onConfirm = () => {
      if (!input) { fechar(null); return; }

      let val = Number(input.value);
      if (!Number.isFinite(val)) val = 0;
      val = Math.floor(val);

      const min = Number(input.min);
      const max = Number(input.max);
      if (Number.isFinite(min)) val = Math.max(min, val);
      if (Number.isFinite(max)) val = Math.min(max, val);

      fechar(val);
    };

    const overlayClick = (e) => {
      if (e.target === overlay) fechar(null);
    };

    const keyHandler = (e) => {
      if (e.key === 'Escape') fechar(null);
      if (e.key === 'Enter') onConfirm();
    };

    btnCancel.addEventListener('click', onCancel);
    btnConfirm.addEventListener('click', onConfirm);
    overlay.addEventListener('click', overlayClick);
    document.addEventListener('keydown', keyHandler);

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      input?.focus();
      input?.select();
    }, 50);
  });
}

// Wrapper síncrono para compatibilidade
function customPrompt(mensagem, hint = '') {
  return mostrarCustomPrompt(mensagem, hint);
}

// Fechar custom alert ao clicar no overlay
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'custom-alert-overlay') {
    const overlay = document.getElementById('custom-alert-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
  if (e.target && e.target.id === 'custom-prompt-overlay') {
    const overlay = document.getElementById('custom-prompt-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
});

// Fechar custom modals com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const alertOverlay = document.getElementById('custom-alert-overlay');
    const promptOverlay = document.getElementById('custom-prompt-overlay');
    if (alertOverlay && alertOverlay.style.display === 'flex') {
      alertOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
    if (promptOverlay && promptOverlay.style.display === 'flex') {
      promptOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
});

function irParaContato() {
  fecharModal();
  setTimeout(() => {
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('contact-name')?.focus();
  }, 200);
}

// Fechar modal clicando no overlay
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'modal-overlay') {
    fecharModal();
  }
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    fecharModal();
    fecharCartModal();
    // Fechar mobile menu também
    const navLinks = document.getElementById('navbar-links');
    const hamburger = document.getElementById('hamburger');
    navLinks && navLinks.classList.remove('mobile-open');
    hamburger && hamburger.classList.remove('active');
  }
});

/* ========================================================
   7. CARRINHO MODAL — RESUMO DO PEDIDO
   ======================================================== */

function abrirCartModal() {
  const overlay = document.getElementById('cart-modal-overlay');
  if (!overlay) return;
  
  carrinho.renderCartModal();
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.getElementById('cart-modal-close')?.focus();
}

function fecharCartModal() {
  const overlay = document.getElementById('cart-modal-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function limparCarrinho() {
  carrinho.limpar();
  exibirToast('Pedido limpo.', 'info', 2000);
}

function finalizarPedido() {
  simularCompra();
}

function irParaContatoDoCart() {
  finalizarPedido();
}

// Fechar cart modal clicando no overlay
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'cart-modal-overlay') {
    fecharCartModal();
  }
});

/* ========================================================
   8. FORMULÁRIO DE CONTATO — VALIDAÇÃO
   ======================================================== */

const VALIDACOES_CONTATO = {
  'contact-name': {
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    mensagens: {
      required: 'Por favor, informe seu nome completo.',
      minLength: 'O nome deve ter pelo menos 3 caracteres.',
      maxLength: 'O nome não pode ter mais de 100 caracteres.',
      pattern: 'O nome deve conter apenas letras e espaços.',
    },
  },
  'contact-email': {
    required: true,
    maxLength: 150,
    pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/,
    mensagens: {
      required: 'Por favor, informe seu e-mail.',
      maxLength: 'O e-mail não pode ter mais de 150 caracteres.',
      pattern: 'Informe um e-mail válido (ex: nome@email.com).',
    },
  },
  'contact-phone': {
    required: true,
    pattern: /^\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4}$/,
    mensagens: {
      required: 'Por favor, informe seu telefone.',
      pattern: 'Informe um telefone válido (ex: (11) 99999-9999).',
    },
  },
  'contact-interest': {
    required: true,
    opcoes: ['ferrari', 'porsche', 'lamborghini', 'bentley', 'mclaren', 'tesla', 'outro'],
    mensagens: {
      required: 'Por favor, selecione um veículo de interesse.',
      opcoes: 'Selecione uma opção válida da lista.',
    },
  },
  'contact-message': {
    required: true,
    minLength: 10,
    maxLength: 1000,
    mensagens: {
      required: 'Por favor, escreva uma mensagem.',
      minLength: 'A mensagem deve ter pelo menos 10 caracteres.',
      maxLength: 'A mensagem não pode ter mais de 1000 caracteres.',
    },
  },
};

/**
 * Valida um campo do formulário de contato.
 * @param {string} campoId
 * @returns {boolean}
 */
function validarCampoContato(campoId) {
  const campo = document.getElementById(campoId);
  const errorEl = document.getElementById(`error-${campoId}`);
  const regras = VALIDACOES_CONTATO[campoId];

  if (!campo || !regras) return true;

  const valor = sanitizarTexto(campo.value, campo.tagName === 'TEXTAREA');
  let erro = '';

  if (regras.required && valor === '') {
    erro = regras.mensagens.required;
  } else if (valor !== '') {
    if (regras.minLength && valor.length < regras.minLength) {
      erro = regras.mensagens.minLength;
    } else if (regras.maxLength && valor.length > regras.maxLength) {
      erro = regras.mensagens.maxLength;
    } else if (regras.opcoes && !regras.opcoes.includes(valor)) {
      erro = regras.mensagens.opcoes;
    } else if (regras.pattern && !regras.pattern.test(valor)) {
      erro = regras.mensagens.pattern;
    }
  }

  if (errorEl) errorEl.textContent = erro;
  campo.classList.toggle('error', erro !== '');
  campo.classList.toggle('success', erro === '' && valor !== '');

  return erro === '';
}

/**
 * Valida o checkbox de termos.
 * @returns {boolean}
 */
function validarTermos() {
  const checkbox = document.getElementById('contact-terms');
  const errorEl = document.getElementById('error-contact-terms');

  if (!checkbox) return false;

  const marcado = checkbox.checked;
  const erro = marcado ? '' : 'Você deve aceitar os Termos de Uso para continuar.';

  if (errorEl) errorEl.textContent = erro;
  return marcado;
}

/**
 * Formata o campo telefone automaticamente enquanto digita.
 */
function formatarTelefone(input) {
  let val = input.value.replace(/\D/g, '');
  if (val.length > 11) val = val.slice(0, 11);

  if (val.length <= 10) {
    val = val.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    val = val.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }

  input.value = val;
}

function inicializarFormularioContato() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Validação em tempo real (ao sair do campo)
  Object.keys(VALIDACOES_CONTATO).forEach(campoId => {
    const campo = document.getElementById(campoId);
    if (!campo) return;

    campo.addEventListener('blur', () => validarCampoContato(campoId));
    campo.addEventListener('input', () => {
      // Limpa erro ao começar a digitar
      const errorEl = document.getElementById(`error-${campoId}`);
      const valorAtual = sanitizarTexto(campo.value, campo.tagName === 'TEXTAREA');
      if (campo.classList.contains('error') && valorAtual !== '') {
        validarCampoContato(campoId);
      }
      if (valorAtual === '' && errorEl) {
        errorEl.textContent = '';
        campo.classList.remove('error', 'success');
      }
    });
  });

  // Formatação de telefone
  const phoneInput = document.getElementById('contact-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => formatarTelefone(phoneInput));
  }

  // Contador de caracteres da mensagem
  const messageInput = document.getElementById('contact-message');
  const charCount = document.getElementById('char-count');
  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      charCount.textContent = messageInput.value.length;
      charCount.style.color = messageInput.value.length > 900 ? '#fc8181' : '';
    });
  }

  // Listeners para modais de Termos e Privacidade
  document.getElementById('terms-link')?.addEventListener('click', abrirTermosDeUso);
  document.getElementById('privacy-link')?.addEventListener('click', abrirPoliticaPrivacidade);
  document.getElementById('footer-terms-link')?.addEventListener('click', abrirTermosDeUso);
  document.getElementById('footer-privacy-link')?.addEventListener('click', abrirPoliticaPrivacidade);
  document.getElementById('footer-cookies-link')?.addEventListener('click', abrirPoliticaCookies);

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    enviarFormularioContato();
  });
}

/**
 * Envia (simula) o formulário de contato após validação completa.
 */
function enviarFormularioContato() {
  try {
    let formValido = true;

    // Valida todos os campos
    Object.keys(VALIDACOES_CONTATO).forEach(campoId => {
      if (!validarCampoContato(campoId)) {
        formValido = false;
      }
    });

    // Valida termos
    if (!validarTermos()) {
      formValido = false;
    }

    if (!formValido) {
      exibirToast('Preencha todos os campos corretamente.', 'error');
      // Foca no primeiro campo com erro
      const primeiroErro = document.querySelector('.form-input.error');
      if (primeiroErro) primeiroErro.focus();
      return;
    }

    // Normaliza os valores antes do envio (remove caracteres de controle e espaços extras)
    Object.keys(VALIDACOES_CONTATO).forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (!campo) return;
      campo.value = sanitizarTexto(campo.value, campo.tagName === 'TEXTAREA');
    });

    // Simula envio (loading state)
    const btnText = document.getElementById('btn-submit-text');
    const btnLoading = document.getElementById('btn-submit-loading');
    const btnSubmit = document.getElementById('btn-contact-submit');

    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';
    if (btnSubmit) btnSubmit.disabled = true;

    // Simula delay de rede
    setTimeout(() => {
      if (btnText) btnText.style.display = 'inline';
      if (btnLoading) btnLoading.style.display = 'none';
      if (btnSubmit) btnSubmit.disabled = false;

      // Exibe feedback de sucesso
      const feedback = document.getElementById('form-feedback');
      if (feedback) {
        feedback.style.display = 'block';
        feedback.className = 'form-feedback success';
        feedback.textContent = 'Mensagem enviada com sucesso! Nossa equipe retornará em até 24 horas.';

        // Esconde após 6s
        setTimeout(() => { feedback.style.display = 'none'; }, 6000);
      }

      // Limpa o formulário
      document.getElementById('contact-form')?.reset();
      document.getElementById('char-count') && (document.getElementById('char-count').textContent = '0');
      document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error', 'success'));
      document.querySelectorAll('.form-error').forEach(el => el.textContent = '');

      exibirToast('Mensagem enviada! Entraremos em contato em breve.', 'success', 5000);

    }, 1800);

  } catch (erro) {
    console.error('Erro ao enviar formulário:', erro);
    exibirToast('Erro ao enviar a mensagem. Tente novamente.', 'error');

    const feedback = document.getElementById('form-feedback');
    if (feedback) {
      feedback.style.display = 'block';
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Ocorreu um erro ao enviar. Por favor, tente novamente.';
    }
  }
}

/* ========================================================
   8. SCROLL REVEAL ANIMATION
   ======================================================== */

function inicializarScrollReveal() {
  const elementos = document.querySelectorAll(
    '.product-card, .step-card, .contact-item, .sim-product-row, .section__header'
  );

  elementos.forEach(el => {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elementos.forEach(el => observer.observe(el));
}

/* ========================================================
   9. SCROLL SUAVE PARA ANCORAS
   ======================================================== */

function inicializarScrollSuave() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const alvo = link.getAttribute('href');
      if (!alvo || alvo === '#') return;

      const el = document.querySelector(alvo);
      if (el) {
        e.preventDefault();
        const offset = 80; // altura da navbar
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ========================================================
   11. INICIALIZAÇÃO GERAL
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  try {
    inicializarNavbar();
    inicializarFormularioContato();
    inicializarScrollReveal();
    inicializarScrollSuave();
    
    // Inicializa botão flutuante do carrinho
    const cartBtn = document.getElementById('floating-cart');
    if (cartBtn) {
      cartBtn.addEventListener('click', abrirCartModal);
    }
    
    // Inicializa UI do carrinho
    carrinho.atualizarUI();
    
    console.log('AutoElite carregado com sucesso!');
  } catch (erro) {
    console.error('Erro ao inicializar AutoElite:', erro);
  }
});
