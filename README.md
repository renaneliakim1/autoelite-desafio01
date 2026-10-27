# AutoElite — Simulador de Compras

**Projeto:** Desafio 1 — Minha Loja: Simulador de Compras  
**Aluno:** Renã Eliakim  
**Trilha:** Trilha de Desenvolvimento Mobile  
**Entrega:** 30/10/2026

Loja fictícia de veículos premium desenvolvida com HTML, CSS e JavaScript puro. O projeto apresenta um catálogo de carros de alto padrão, permite simular a compra informando quantidades, calcula o total com desconto progressivo e exibe um resumo do pedido — tudo em uma interface responsiva, com tema claro/escuro e formulário de contato validado.

![Captura de tela da AutoElite](assets/screenshot.png)

---

## Sumário

- [Sobre a loja](#sobre-a-loja)
- [Catálogo e preços](#catálogo-e-preços)
- [Funcionalidades](#funcionalidades)
- [Como funciona a simulação](#como-funciona-a-simulação)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como executar](#como-executar)
- [Testes realizados](#testes-realizados)
- [Dificuldades e aprendizados](#dificuldades-e-aprendizados)
- [Uso de Inteligência Artificial](#uso-de-inteligência-artificial)
- [Autor](#autor)

---

## Sobre a loja

A **AutoElite** é uma loja fictícia especializada em veículos premium. A proposta da interface é transmitir sofisticação e exclusividade, com uma identidade visual escura, detalhes dourados e tipografia moderna.

A página reúne:

- Apresentação da loja com chamada para o catálogo;
- Catálogo com 6 veículos, descrições curtas, especificações e preços;
- Seção “Como Funciona” com o passo a passo da simulação;
- Carrinho/resumo do pedido com desconto progressivo;
- Formulário de contato com validação completa;
- Rodapé com informações institucionais e créditos.

> **Aviso:** esta é uma loja fictícia, criada exclusivamente para fins educacionais. Nenhuma compra real é realizada.

---

## Catálogo e preços

| Veículo | Categoria | Especificações | Preço |
|---|---|---|---|
| Ferrari F8 Tributo | Esportivo | 720 cv · 340 km/h · Gasolina | R$ 2.800.000 |
| Porsche Panamera | Executivo | 550 cv · 306 km/h · Híbrido | R$ 1.950.000 |
| Lamborghini Urus | SUV Performance | 650 cv · 305 km/h · Gasolina | R$ 2.350.000 |
| Bentley Bentayga | Ultra Luxo | 635 cv · 290 km/h · Gasolina | R$ 3.200.000 |
| McLaren 720S | Superesportivo | 720 cv · 341 km/h · Gasolina | R$ 2.100.000 |
| Tesla Model S Plaid | Elétrico | 1.020 cv · 322 km/h · Elétrico | R$ 890.000 |

Os preços exibidos no HTML são os mesmos utilizados pelo JavaScript no cálculo da compra.

### Regras de negócio

- Quantidade máxima de **10 unidades por modelo**;
- **Desconto de 5%** quando o pedido tiver **3 ou mais veículos** no total (somando as unidades de todos os modelos);
- Quantidade `0` significa que o veículo não será incluído no pedido;
- Se nenhum veículo for selecionado, o sistema informa que o pedido está vazio.

---

## Funcionalidades

### Catálogo e simulação

- Cards de produto com imagem, descrição, especificações e preço;
- Botão **“Simular compra”** em cada card, que solicita a quantidade desejada;
- Carrinho com contador flutuante e resumo detalhado;
- Cálculo de subtotal, desconto e total em tempo real;
- Possibilidade de limpar o carrinho ou finalizar o pedido;
- Modal de resumo com itens, quantidades, valores, desconto e total.

### Experiência do usuário

- Tema **claro/escuro** com persistência em `localStorage`;
- Layout responsivo (desktop, tablet e celular);
- Menu hamburger no mobile;
- Animações de entrada com `IntersectionObserver`;
- Notificações do tipo *toast* para feedback das ações;
- Modais customizados para alertas e prompts, com suporte a teclado (`Enter`/`Esc`);
- Scroll suave entre as seções.

### Formulário de contato

- Validação de nome, e-mail, telefone, veículo de interesse e mensagem;
- Máscara automática de telefone no formato `(11) 99999-9999`;
- Contador de caracteres da mensagem;
- Validação do aceite dos Termos de Uso;
- Estado de carregamento simulado no envio;
- Mensagem de sucesso e limpeza automática do formulário.

### Segurança e qualidade

- Sanitização de textos de entrada (remoção de caracteres de controle e espaços extras);
- Escape de HTML antes de inserir conteúdo dinâmico no DOM, prevenindo XSS;
- Validação de tipos e limites numéricos no simulador;
- Tratamento de erros com `try/catch` nas principais operações.

---

## Como funciona a simulação

1. O usuário clica em **“Simular compra”** em um dos veículos.
2. Um modal solicita a quantidade desejada (de `0` a `10`).
3. A quantidade é convertida para número e validada.
4. O veículo é adicionado ao carrinho, que abre automaticamente.
5. O resumo exibe subtotal, desconto (se houver) e total.
6. Ao clicar em **“Finalizar Pedido”**, o sistema valida o carrinho e apresenta o resumo final da compra.
7. O usuário pode entrar em contato pelo formulário para concluir a negociação.

> **Observação sobre o requisito do desafio:** a proposta original pedia `prompt()`, `Number()` e `alert()`. Neste projeto, essas interações foram implementadas com **modais customizados** para melhorar a experiência e a acessibilidade. A lógica exigida foi mantida: o sistema solicita a quantidade, converte o valor com `Number()`, calcula `preço × quantidade` e exibe o resumo com os itens e o total. A conversão e a validação numérica também aparecem em `lerSimulador()` e `mostrarCustomPrompt()`.

---

## Tecnologias utilizadas

- **HTML5** — estrutura semântica e acessível;
- **CSS3** — variáveis CSS, Flexbox, Grid, media queries, transições e animações;
- **JavaScript (ES6+)** — lógica do simulador, manipulação do DOM, validações e persistência;
- **Google Fonts (Outfit)** — tipografia;
- **SVG** — ícones vetoriais;
- **localStorage** — persistência do tema escolhido;
- **IntersectionObserver API** — animações de revelação ao rolar.

O projeto **não utiliza frameworks, bibliotecas de UI nem processo de build**. Basta abrir o `index.html` no navegador.

---

## Estrutura do projeto

```text
Loja Desafio 1 Trilhas/
├── index.html                  # Estrutura da página
├── README.md                   # Documentação do projeto
├── instrucoes.md               # Enunciado do desafio
└── assets/
    ├── css/
    │   └── style.css           # Estilos, temas e responsividade
    ├── js/
    │   └── script.js           # Simulador, carrinho, validações e interações
    ├── img/
    │   ├── logo.png            # Logotipo da loja
    │   ├── hero.jpg            # Imagem de fundo do hero
    │   ├── ferrari-f8-tributo.jpg
    │   ├── porsche-panamera.jpg
    │   ├── lamborghini-urus.webp
    │   ├── bentley-bentayga.webp
    │   ├── mclaren-720s.jpg
    │   └── tesla-model-s-plaid.jpg
    └── screenshot.png          # Captura de tela usada neste README
```

---

## Como executar

### Opção 1 — Abrir diretamente

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` no navegador de sua preferência.

### Opção 2 — Servidor local (recomendado)

Com o **VS Code** e a extensão **Live Server** instalados:

1. Abra a pasta do projeto no VS Code.
2. Clique com o botão direito em `index.html` e escolha **“Open with Live Server”**.

Ou, com Python instalado:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

> O projeto funciona sem servidor, mas o uso de um servidor local evita restrições de alguns navegadores ao carregar arquivos locais.

### Requisitos

- Navegador moderno (Chrome, Edge, Firefox ou Safari);
- Conexão com a internet apenas para carregar a fonte do Google Fonts (o restante funciona offline).

---

## Testes realizados

Os testes foram executados manualmente nos navegadores Chrome e Edge, em resoluções de desktop e mobile.

| # | Cenário testado | Resultado esperado | Status |
|---|---|---|---|
| 1 | Adicionar 1 veículo ao carrinho | Item aparece no resumo com quantidade e valor corretos | ✅ |
| 2 | Adicionar o mesmo veículo mais de uma vez | Quantidade é somada, respeitando o máximo de 10 | ✅ |
| 3 | Pedido com 3 ou mais veículos | Desconto de 5% é aplicado sobre o subtotal | ✅ |
| 4 | Pedido com menos de 3 veículos | Nenhum desconto é aplicado | ✅ |
| 5 | Informar quantidade `0` | Veículo não é incluído no pedido | ✅ |
| 6 | Informar texto, número negativo ou valor acima de 10 | Sistema exibe mensagem de validação e não adiciona o item | ✅ |
| 7 | Finalizar pedido com carrinho vazio | Sistema informa que nenhum veículo foi selecionado | ✅ |
| 8 | Limpar carrinho | Todos os itens são removidos e o contador volta a zero | ✅ |
| 9 | Alternar tema claro/escuro | Tema muda e permanece após recarregar a página | ✅ |
| 10 | Navegar pelo menu no celular | Menu hamburger abre, fecha e navega corretamente | ✅ |
| 11 | Enviar formulário com campos vazios | Campos inválidos são destacados com mensagens de erro | ✅ |
| 12 | Informar e-mail/telefone inválidos | Validação impede o envio e exibe mensagem específica | ✅ |
| 13 | Não aceitar os Termos de Uso | Envio é bloqueado com aviso | ✅ |
| 14 | Preencher o formulário corretamente | Mensagem de sucesso é exibida e o formulário é limpo | ✅ |
| 15 | Digitar caracteres especiais/HTML no formulário | Conteúdo é sanitizado/escapado, sem execução de script | ✅ |
| 16 | Redimensionar a janela | Layout se adapta sem quebra de elementos | ✅ |

### Verificações técnicas

- Console do navegador sem erros durante a navegação e as simulações;
- Preços do HTML conferidos com os valores definidos em `PRODUTOS` no `assets/js/script.js`;
- Cálculos conferidos manualmente, incluindo arredondamento e formatação em BRL;
- Captura de tela gerada com o Chrome em modo headless (`assets/screenshot.png`).

---

## Dificuldades e aprendizados

### Dificuldade encontrada

Uma das principais dificuldades foi conciliar o requisito acadêmico de usar `prompt()` e `alert()` com a proposta de uma interface mais moderna e agradável. Os prompts nativos do navegador são limitados, não seguem o estilo da loja e podem prejudicar a experiência do usuário. A solução foi criar modais customizados que simulam o comportamento de `prompt` e `alert`, mantendo a mesma lógica de solicitar a quantidade, converter com `Number()`, calcular os valores e exibir o resumo.

Outro ponto desafiador foi garantir que os valores e as validações ficassem consistentes entre o HTML, o carrinho e o simulador, além de tratar entradas inválidas sem quebrar a aplicação.

### O que aprendi

- Organizar melhor o código JavaScript em módulos lógicos (produtos, carrinho, utilitários, validações e inicialização);
- Manipular o DOM de forma segura, escapando conteúdo dinâmico para evitar XSS;
- Validar dados de formulários e converter valores com `Number()` e `parseInt()`;
- Trabalhar com estados (carrinho, tema, modais) e persistência com `localStorage`;
- Criar layouts responsivos com CSS Grid, Flexbox e variáveis CSS;
- Melhorar a acessibilidade com atributos ARIA, foco em modais e navegação por teclado;
- Testar cenários de erro, e não apenas o “caminho feliz”.

---

## Uso de Inteligência Artificial

A Inteligência Artificial foi utilizada como **ferramenta de apoio** durante o desenvolvimento, principalmente para:

- Revisar e refatorar o código JavaScript;
- Sugerir melhorias de acessibilidade, validação e segurança (sanitização e escape de HTML);
- Auxiliar na organização visual e na responsividade;
- Apoiar a criação e a revisão desta documentação;
- Gerar a captura de tela do projeto para o README.

**O que foi adaptado:** as sugestões foram analisadas e ajustadas ao contexto do desafio. Por exemplo, os modais customizados foram mantidos em vez de simplesmente substituir os requisitos por `prompt()`/`alert()`, e a lógica de desconto e os preços foram conferidos manualmente para garantir correspondência com o catálogo.

**Como o resultado foi verificado:** o projeto foi executado no navegador, os fluxos de compra foram testados manualmente (inclusive entradas inválidas), os preços foram comparados entre HTML e JavaScript, o console foi inspecionado em busca de erros e os cálculos de desconto foram conferidos com valores conhecidos.

> Todo o código entregue foi lido e compreendido pelo aluno, que é responsável pela implementação e pelas adaptações realizadas.

---

## Autor

**Renã Eliakim**  
Trilha de Desenvolvimento Mobile  
Projeto desenvolvido para o **Desafio 1 — Minha Loja: Simulador de Compras**.

---

© 2026 AutoElite. Todos os direitos reservados.  
Esta é uma loja fictícia criada para fins educacionais.
