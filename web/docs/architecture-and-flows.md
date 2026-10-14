# Arquitetura e fluxos do Brev.ly

## 1. Visão geral

O front-end React/TypeScript integra-se ao backend Fastify do diretório `../server`. O servidor é a fonte de verdade para links e acessos; o navegador mantém apenas estado transitório em React e não persiste links em `localStorage`.

## 2. Inicialização e build

- `index.html` contém o elemento raiz da aplicação.
- `src/main.tsx` importa o CSS global e monta `<App />` com `createRoot` dentro de `StrictMode`.
- `src/app.tsx` declara as rotas SPA com React Router DOM.
- `vite.config.ts` configura Vite com os plugins do React e Tailwind. `resolve.dedupe` força dependências que declaram React como peer (incluindo Phosphor) a usar a mesma instância de React/React DOM da aplicação, evitando chamadas de hook inválidas por cópias duplicadas.
- `.env.example` documenta as variáveis públicas necessárias. `src/config/env.ts` exporta o objeto `env`, parseado de `import.meta.env` com Zod; os defaults são `window.location.origin` para `VITE_FRONTEND_URL` e `http://localhost:3333` para `VITE_BACKEND_URL`. Valores fornecidos devem ser URLs válidas e não devem terminar em barra; strings vazias falham na inicialização. `.env` e demais `.env.*` ficam ignorados pelo Git, exceto o exemplo.
- `pnpm dev` inicia o servidor de desenvolvimento.
- `pnpm build` executa a verificação TypeScript dos projetos (`tsc -b`) e gera o bundle de produção com Vite.
- `pnpm preview` serve o bundle compilado localmente.
- `pnpm lint` está declarado, mas requer uma configuração `eslint.config.*`; sem ela, ESLint não inicia.

## 3. Componentes e responsabilidades

| Módulo | Responsabilidade |
| --- | --- |
| `src/main.tsx` | Inicializar React e carregar estilos globais. |
| `src/app.tsx` | Declarar as rotas com React Router DOM. |
| `src/pages/home-page.tsx` | Buscar links na API, exibir carregamento/erro e compor a página raiz com mutações de criação e exclusão. |
| `src/pages/redirect-page.tsx` | Mostrar instruções e redirecionar para o destino após 3 segundos. |
| `src/pages/not-found-page.tsx` | Mostrar o estado de URL inexistente. |
| `src/pages/short-link-page.tsx` | Buscar o slug na API e tratar estados de loading, 404, falha de rede e redirecionamento. |
| `src/components/url-shortener.tsx` | Renderizar o cartão de criação e conectar o formulário a callbacks. |
| `src/components/url-shortener-form.tsx` | Gerenciar os campos, validar entradas, recusar slug duplicado e reportar um novo link. |
| `src/components/url-shortener-form-input.tsx` | Campo visual reutilizável com label, prefixo opcional e erro acessível. |
| `src/components/my-links.tsx` | Renderizar o painel, cabeçalho, exportação CSV e escolher entre estado vazio ou lista. |
| `src/components/empty-links-state.tsx` | Renderizar a divisória, ícone e mensagem quando ainda não há links. |
| `src/components/short-link-list-item.tsx` | Apresentar uma linha de link, copiar a URL e delegar a exclusão ao pai. |
| `src/components/icon-action-button.tsx` | Padronizar botões quadrados de ação apenas com ícone e nome acessível. |
| `src/components/links-divider.tsx` | Reutilizar a divisória CSS entre estado vazio e itens da lista. |
| `src/services/short-url-api.ts` | Cliente HTTP tipado/validado com Zod para listar, criar, buscar e excluir links e construir o URL que incrementa acessos. |
| `src/types/short-link.ts` | Declarar tipos dos links e da resposta paginada retornada pela API. |
| `src/index.css` | Carregar fontes, Tailwind e tokens de cor/tipografia. |
| `public/assets/` | Armazenar as ilustrações e a marca originais em SVG, servidas como arquivos estáticos. |

## 4. Modelo de dados e armazenamento

Cada `ShortLink` recebido da API tem a forma:

- `id`: identificador gerado pelo backend;
- `originalUrl`: URL absoluta validada pelo backend;
- `shortCode`: slug definido para o link;
- `accessCount`: quantidade de acessos reportada pelo backend;
- `createdAt`: data de criação em formato ISO.

O banco de dados do backend é a fonte de verdade. A página inicial mantém a lista retornada pela API em estado React enquanto está montada; não usa `localStorage` para persistir links.

## 5. Fluxo de criação e validação

1. A pessoa digita a URL original e o slug no cartão “Novo link”.
2. React Hook Form acompanha os valores no modo `onChange`; `register()` conecta os campos ao estado interno do formulário.
3. `zodResolver` executa o schema Zod em cada alteração e disponibiliza erros/validade pelo `formState`.
4. URL original: é aparada; se não começar com `http://` ou `https://`, acrescenta-se `https://`; depois `z.url()` verifica a URL resultante.
5. Slug: é aparado, convertido para minúsculas, exige 1–32 caracteres e aceita somente letras minúsculas e números (`^[a-z0-9]+$`), de acordo com o contrato atual do backend.
6. O prefixo `brev.ly/` é texto visual no componente do input; o valor registrado guarda apenas o slug.
7. O botão “Salvar link” fica fora do elemento `<form>` e é associado a ele com `form="new-short-url"`. Fica desativado quando `isValid` é falso ou o formulário está enviando.
8. `POST /shortUrl` cria o link no backend. A API é a autoridade para unicidade; HTTP 409 é mostrado junto ao campo de slug.
9. Após criação, o front-end recarrega a listagem da API e limpa os campos. Falhas de rede/servidor são apresentadas pelo formulário.

Validações que ainda são importantes em um backend: reservar slugs de sistema, validar regras da URL final, impor unicidade atomicamente, proteger operações e limitar abuso. Validação apenas no cliente pode ser contornada.

## 6. Lista, ações e CSV

- Sem links, o painel mostra a ilustração e a mensagem do estado vazio; o botão CSV permanece desativado.
- Com links, cada linha mostra slug, URL original sem o esquema visual, `accessCount` do servidor e ações. **Limite atual do contrato:** o schema de resposta de `GET /shortUrls` no backend não inclui `accessCount`, embora a função de banco o selecione. Por isso, o parser do front-end aplica default zero até o schema de resposta do servidor ser ampliado.
- `MyLinks` decide qual conteúdo mostrar e mantém a responsabilidade pelo download CSV; `EmptyLinksState` contém somente a apresentação do estado vazio.
- Cada `ShortLinkListItem` apresenta um link e contém seu estado transitório de cópia; os botões Copy/Trash usam o componente comum `IconActionButton`.
- Copiar grava `VITE_FRONTEND_URL/slug` na área de transferência pelo Clipboard API; se a variável não estiver definida, usa a origem atual do browser como default. A ação anuncia o estado pelo nome acessível do botão. O navegador pode exigir contexto seguro/permissão.
- Excluir chama `DELETE /shortUrl/:shortCode`; a linha só é removida após sucesso do servidor. Em erro, mantém-se na lista e a interface informa a falha.
- CSV cria cabeçalho e uma linha por link, escapa aspas duplicando-as, cria um `Blob` UTF-8 e inicia o download `brevly-links.csv`. A URL de objeto é revogada após iniciar o download.
- A exportação cria o CSV no browser com os links retornados pela API; as URLs absolutas usam `VITE_FRONTEND_URL`, com fallback à origem atual. O backend ainda não oferece endpoint de relatório CSV.

## 7. Fluxo de slug, redirecionamento e 404

O React Router DOM classifica a URL atual:

- `/` renderiza a página principal.
- `/:shortCode` é reconhecido como rota de slug e fornece o parâmetro com `useParams`.
- Caminhos restantes, inclusive rotas aninhadas, renderizam `NotFoundPage` via rota `*`.

`ShortLinkPage` valida formato local e chama `GET /shortUrls/:shortCode`; 404 renderiza `NotFoundPage`, falhas temporárias mostram retry e sucesso renderiza `RedirectPage`. Após 3 segundos, a navegação vai para `GET /:shortCode` no backend, cujo handler incrementa atomicamente `accessCount` e redireciona para a URL original.

As rotas são declaradas em `App`: `/`, `/:shortCode` e `*`. As páginas ficam em `src/pages`; os elementos reutilizáveis da interface ficam em `src/components`. Os dados da home são obtidos e alterados por `src/services/short-url-api.ts` via `fetch`; não há estado local persistente para links.

Em produção, o host do front-end deverá servir o fallback SPA ao abrir diretamente `/:shortCode`. O destino de acesso usa o backend configurado, não a rota do próprio front-end, para que o servidor incremente acessos e execute o redirect.

## 8. Responsividade e assets

- O layout principal empilha cartões em telas pequenas e passa a duas colunas em `min-[1040px]`, largura suficiente para os cartões de 380 px e 580 px e intervalo lateral.
- As referências mobile usam cartões de 366 px com 24 px de padding; referências desktop usam as larguras e padding definidos no frame.
- A marca e a ilustração 404 mantêm uma única versão SVG desktop; classes CSS/Tailwind adaptam a largura e altura para o mobile.
- Divisórias entre registros são elementos `<hr>` com borda CSS, para a linha ocupar naturalmente a largura disponível em ambos breakpoints.
- Ícones de copiar, link, baixar e excluir vêm de `@phosphor-icons/react`; não são armazenados como SVGs separados em `public/assets/`.
- Os SVGs de marca e ilustração permanecem como assets locais do Figma, sem URLs temporárias. A ilustração 404 é redimensionada via CSS para o slot mobile/desktop.
- A justificativa utilitária classe por classe está em [tailwind-classes.md](tailwind-classes.md).

## 9. Bibliotecas e por que são usadas

### Runtime e interface

- **React**: componentes e renderização declarativa.
- **React DOM**: integração React com o DOM do browser.
- **TypeScript**: tipagem estática dos componentes, formulário e modelo de link.
- **Vite**: servidor de desenvolvimento e bundler de produção.
- **React Router DOM**: rotas client-side para home, slug curto e fallback 404.

### Estilos

- **Tailwind CSS 4**: classes utilitárias responsivas e design tokens de `@theme`.
- **`@tailwindcss/vite`**: integração do Tailwind 4 no pipeline do Vite.
- **`@phosphor-icons/react`**: componentes React para os ícones de link, download, cópia e exclusão, permitindo configurar tamanho, cor e acessibilidade diretamente via props.
- **Open Sans / Quicksand**: fontes da interface e da marca carregadas por Google Fonts em `src/index.css`.

### Ambiente

- `.env.example` lista `VITE_FRONTEND_URL` e `VITE_BACKEND_URL` com os valores locais usuais.
- `src/config/env.ts` valida as variáveis expostas pelo Vite (`import.meta.env`) usando Zod e exporta somente `env`; não usa `process.env`, que não é a interface de ambiente do browser neste projeto.
- `VITE_FRONTEND_URL` já é usado para montar URLs absolutas ao copiar e exportar; quando não está definida, o default é `window.location.origin`.
- `VITE_BACKEND_URL` tem default `http://localhost:3333`; o cliente Fetch de `src/services/short-url-api.ts` o usa como base dos endpoints.
- Variáveis com prefixo `VITE_` são públicas e incorporadas ao bundle; não colocar segredos nelas.

### Formulário, validação e HTTP

- **React Hook Form**: registro e estado dos campos, submissão e estado de validade sem manter cada input manualmente em `useState`.
- **Zod**: schema declarativo para transformar/validar valores e produzir mensagens de erro.
- **`@hookform/resolvers`**: ponte entre o schema Zod e o ciclo de validação do React Hook Form.
- **Fetch API**: chamadas HTTP nativas para o backend; o cliente central valida respostas JSON com Zod, sem biblioteca de HTTP adicional.

### Desenvolvimento

- **ESLint**, **typescript-eslint**, **eslint-plugin-react-hooks**, **eslint-plugin-react-refresh** e **@eslint/js**: dependências para lint, configuração ainda ausente no estado atual do projeto.
- **`@types/react`, `@types/react-dom`, `@types/node`**: declarações de tipos.

O roteamento usa React Router DOM; as chamadas HTTP usam Fetch API sem biblioteca de cliente. O backend Fastify fornece persistência. Phosphor Icons fornece iconografia, e APIs do navegador são usadas para clipboard, temporizador e geração de CSV.

## 10. Limites e evolução sugerida

Próximos passos: adicionar testes de integração UI/API, considerar endpoint de exportação CSV, restringir CORS às origens configuradas antes do deploy e configurar ESLint antes de tratar `pnpm lint` como verificação ativa.

## 11. Revisão contra os requisitos do front-end

Esta revisão reflete a integração atual com o backend e destaca pendências conhecidas.

| Requisito | Situação atual | Observação |
| --- | --- | --- |
| React + TypeScript + Vite, SPA sem framework | Atendido | React 19, TypeScript e Vite; não há framework de aplicação adicional. |
| Criar link | Implementado | Envia `POST /shortUrl`; após sucesso recarrega os dados da API. |
| Rejeitar encurtamento mal formatado | Implementado | Schema Zod front-end e validação correspondente no backend: slug alfanumérico minúsculo com até 32 caracteres. |
| Rejeitar encurtamento duplicado | Implementado | A API retorna `409`; a mensagem é apresentada no input de slug. |
| Deletar link | Implementado | Envia `DELETE /shortUrl/:shortCode`; item é removido somente após sucesso. |
| Resolver URL original a partir do slug | Implementado | `GET /shortUrls/:shortCode` busca na API e trata 404. |
| Listar links | Implementado | Busca todas as páginas de `GET /shortUrls` até `totalCount`. |
| Incrementar acessos | Implementado na API | `GET /:shortCode` incrementa no servidor e redireciona; a resposta atual da listagem omite o contador e a interface exibe fallback zero até corrigir o schema. |
| Baixar CSV | Implementado no front-end | Gera CSV no browser a partir dos links carregados; backend ainda não oferece endpoint de relatório. |
| Corresponder ao Figma | Parcial | As telas e os estados principais foram montados; a arte 404 desktop atualmente é forçada a dimensões diferentes no mobile com `object-fill`, podendo distorcer a proporção do asset. Fazer comparação visual final nos oito frames. |
| UX com empty/loading/bloqueio de ações | Parcial | Loading, erros/retry, conflito 409 e disabled durante mutações estão tratados; falha no Clipboard API ainda não mostra mensagem própria. |
| Responsividade desktop e mobile | Parcial/implementada | Breakpoints mobile-first e layout empilhado/horizontal existem; validar os oito frames e larguras intermediárias após assets/API. |
| `.env.example` com URLs front/back | Atendido | As duas chaves estão listadas e validadas por Zod; `VITE_FRONTEND_URL` é usada para URLs compartilháveis com fallback local. `VITE_BACKEND_URL` aguarda a camada de API. |

### Pontos restantes de integração

- O schema de resposta de `GET /shortUrls` no backend omite `accessCount`, embora a consulta ao banco selecione esse campo. O front-end usa zero como fallback até o schema da resposta ser ampliado.
- Configurar fallback SPA na hospedagem para URLs diretas `/:shortCode`.
- Restringir a configuração atual `CORS origin: "*"` no backend antes de produção.
- Confirmar a exportação CSV desejada: o endpoint atual retorna datas em seu schema de listagem, mas não há endpoint dedicado ao arquivo CSV.

### Preparação para a API

O cliente API, `VITE_BACKEND_URL` e React Router já estão implementados. Próximos passos: corrigir a omissão de `accessCount`, testar os fluxos com PostgreSQL disponível, restringir CORS e decidir se CSV permanece no browser ou migra para endpoint próprio.
