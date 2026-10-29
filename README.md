# AutoElite — Simulador de Compras

**Projeto:** Desafio 1 — Minha Loja: Simulador de Compras  
**Aluno:** Renã Eliakim  
**Trilha:** Trilha de Desenvolvimento Mobile  
**Entrega:** 30/10/2026

Loja fictícia de veículos premium desenvolvida com **HTML, CSS e JavaScript puro**. O site apresenta um catálogo de carros de alto padrão, permite simular a compra escolhendo o veículo e a quantidade, calcula os valores, aplica desconto progressivo e exibe o resumo do pedido em modais com a identidade visual da loja.

![Captura de tela da AutoElite](assets/screenshot.png)

> **Aviso:** esta é uma loja fictícia, criada exclusivamente para fins educacionais. Nenhuma compra real é realizada.

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

A **AutoElite** é uma loja fictícia especializada em veículos premium. A interface foi construída para transmitir sofisticação e exclusividade, com tema escuro, detalhes dourados, tipografia moderna e layout responsivo.

A página reúne:

- Apresentação da loja com chamada para o catálogo;
- Catálogo com 6 veículos, descrições curtas, especificações e preços;
- Seção “Como Funciona” com o passo a passo da simulação;
- Carrinho com contador flutuante e resumo detalhado;
- Formulário de contato com validação completa;
- Rodapé com informações institucionais e créditos.

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

Os preços exibidos no HTML são exatamente os mesmos definidos no objeto `PRODUTOS` em `assets/js/script.js`.

### Regras de negócio

- O usuário escolhe livremente qual veículo simular, clicando no botão do card correspondente;
- Cada simulação aceita de `0` a `10` unidades do modelo escolhido;
- Ao simular o mesmo modelo novamente, as quantidades são somadas no carrinho;
- Quantidade `0` significa que o veículo não será incluído no pedido;
- **Desconto de 5%** quando o pedido tiver **3 ou mais veículos** no total (somando as unidades de todos os modelos);
- Se nenhum veículo for selecionado, o sistema informa que o pedido está vazio.

---

## Funcionalidades

### Simulação e carrinho

- Cards de produto com imagem, descrição, especificações e preço;
- Botão **“Simular compra”** em cada card, que abre um modal customizado para escolher a quantidade daquele veículo;
- Cálculo de `preço × quantidade` e exibição do resultado em modal estilizado;
- Carrinho com contador flutuante e resumo detalhado;
- Cálculo de subtotal, desconto de 5% e total;
- Possibilidade de limpar o carrinho ou finalizar o pedido;
- Resumo final com itens, quantidades, valores, desconto e total.

### Experiência do usuário

- Tema **claro/escuro** com persistência em `localStorage`;
- Layout responsivo (desktop, tablet e celular);
- Menu hamburger no mobile;
- Animações de entrada com `IntersectionObserver`;
- Notificações do tipo *toast* para feedback das ações;
- Modais customizados em CSS para quantidade, alertas e resumo do pedido;
- Suporte a teclado (`Enter` e `Esc`) nos modais;
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
- Tratamento de erros com `try/catch` nas principais operações;
- Acesso ao `localStorage` protegido, para o site continuar funcionando mesmo quando o armazenamento está bloqueado.

---

## Como funciona a simulação

1. O usuário clica em **“Simular compra”** no veículo que deseja — a escolha é livre.
2. Um modal customizado (`mostrarCustomPrompt`) solicita a quantidade daquele veículo, de `0` a `10`.
3. O valor é convertido em número com `Number()` e validado.
4. O sistema calcula `preço × quantidade` e adiciona o veículo ao carrinho.
5. O resultado é exibido em um modal estilizado com CSS (`.modal--alert`), mostrando quantidade, valor e total do pedido.
6. Se a quantidade for `0`, o sistema informa que nada foi selecionado para aquele veículo.
7. Ao clicar em **“Finalizar Pedido”**, o resumo completo do carrinho é exibido no mesmo estilo customizado.

> **Observação sobre o enunciado:** o desafio pedia `prompt()` e `alert()` nativos. Para preservar a identidade visual da loja, foram usados modais customizados equivalentes: o modal de quantidade faz o papel do `prompt()`, o valor é convertido com `Number()`, calcula-se `preço × quantidade` e o modal de resultado faz o papel do `alert()`, exibindo quantidade, valor e total. A lógica pedida foi mantida, assim como o tratamento de `0` e o aviso quando nada é selecionado.

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
    │   └── style.css           # Estilos, temas, modais e responsividade
    ├── js/
    │   └── script.js           # Simulador, carrinho, validações e interações
    ├── img/
    │   ├── logo.png            # Logotipo da loja
    │   ├── hero.webp           # Imagem de fundo do hero
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

Os testes foram executados manualmente nos navegadores Chrome e Edge, em resoluções de desktop e mobile. O fluxo principal também foi validado com um teste automatizado usando um DOM simulado.

| # | Cenário testado | Resultado esperado | Status |
|---|---|---|---|
| 1 | Abrir a página | Layout carrega e o tema é aplicado | ✅ |
| 2 | Clicar em “Simular compra” em um card | Modal customizado abre com nome e preço do veículo | ✅ |
| 3 | Informar quantidade `2` | Valor calculado como `preço × quantidade` e exibido no modal | ✅ |
| 4 | Informar quantidade `0` | Modal informa que nada foi selecionado para aquele veículo | ✅ |
| 5 | Simular veículos diferentes | Itens são somados no carrinho e o contador é atualizado | ✅ |
| 6 | Pedido com 3 ou mais veículos | Desconto de 5% é aplicado sobre o subtotal | ✅ |
| 7 | Pedido com menos de 3 veículos | Nenhum desconto é aplicado | ✅ |
| 8 | Finalizar pedido com itens | Resumo completo é exibido em modal estilizado | ✅ |
| 9 | Finalizar pedido com carrinho vazio | Sistema informa que nenhum veículo foi selecionado | ✅ |
| 10 | Limpar carrinho | Itens removidos e contador volta a zero | ✅ |
| 11 | Alternar tema claro/escuro | Tema muda e permanece após recarregar a página | ✅ |
| 12 | Navegar pelo menu no celular | Menu hamburger abre, fecha e navega corretamente | ✅ |
| 13 | Enviar formulário com campos vazios | Campos inválidos são destacados com mensagens de erro | ✅ |
| 14 | Informar e-mail/telefone inválidos | Validação impede o envio e exibe mensagem específica | ✅ |
| 15 | Não aceitar os Termos de Uso | Envio é bloqueado com aviso | ✅ |
| 16 | Preencher o formulário corretamente | Mensagem de sucesso é exibida e o formulário é limpo | ✅ |
| 17 | Digitar caracteres especiais/HTML no formulário | Conteúdo é sanitizado/escapado, sem execução de script | ✅ |
| 18 | Redimensionar a janela | Layout se adapta sem quebra de elementos | ✅ |
| 19 | Abrir com `localStorage` bloqueado | O script continua funcionando normalmente | ✅ |

### Verificações técnicas

- Sintaxe do JavaScript verificada com `node --check`;
- Fluxo principal validado com teste automatizado (modal de quantidade → modal de resultado → carrinho);
- Preços do HTML conferidos com os valores definidos em `PRODUTOS` no `assets/js/script.js`;
- Cálculos conferidos manualmente, incluindo desconto e formatação em BRL;
- Console do navegador sem erros durante a navegação e as simulações;
- Captura de tela gerada com o Chrome em modo headless (`assets/screenshot.png`).

---

## Dificuldades e aprendizados

### Dificuldade encontrada

Uma das principais dificuldades foi conciliar a lógica de simulação com a identidade visual da loja. Os `prompt()` e `alert()` nativos do navegador não podem ser estilizados e obrigavam o usuário a passar por todos os produtos. Por isso, a interação passou a usar modais customizados em CSS: o usuário escolhe livremente o veículo no catálogo, informa a quantidade em uma janela estilizada e o resultado aparece no mesmo padrão visual.

Outro problema encontrado foi o acesso ao `localStorage`: quando o site é aberto diretamente como arquivo, o armazenamento pode lançar uma exceção e interromper todo o carregamento do JavaScript. A solução foi envolver esse acesso em `try/catch`, garantindo que o restante da página funcione mesmo sem persistência.

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
- Investigar o erro de `localStorage` que interrompia o carregamento;
- Apoiar a criação e a revisão desta documentação;
- Gerar a captura de tela do projeto para o README.

**O que foi adaptado:** as sugestões foram analisadas e ajustadas ao contexto do desafio. A simulação permite que o usuário escolha livremente o veículo e usa modais customizados em CSS para a quantidade e para os alertas, respeitando a identidade visual da loja. A lógica pedida (perguntar quantidade, converter com `Number()`, calcular `preço × quantidade`, exibir quantidade/valor/total e tratar `0`) foi mantida. Os preços e a regra de desconto foram conferidos manualmente.

**Como o resultado foi verificado:** o projeto foi executado no navegador, os fluxos de compra foram testados manualmente (inclusive entradas inválidas), os preços foram comparados entre HTML e JavaScript, o console foi inspecionado em busca de erros e o fluxo principal também foi validado com um teste automatizado.

> Todo o código entregue foi lido e compreendido pelo aluno, que é responsável pela implementação e pelas adaptações realizadas.

---

## Autor

**Renã Eliakim**  
Trilha de Desenvolvimento Mobile  
Projeto desenvolvido para o **Desafio 1 — Minha Loja: Simulador de Compras**.

---

© 2026 AutoElite. Todos os direitos reservados.  
Esta é uma loja fictícia criada para fins educacionais.
