# Tailwind CSS: classes e motivação

Este documento descreve as classes utilitárias usadas nas telas do Brev.ly e por que foram escolhidas para reproduzir os frames do Figma. As cores e famílias tipográficas nomeadas vêm dos tokens de `src/index.css`; valores arbitrários preservam medidas específicas do arquivo de design. Modifique este documento junto com as classes dos componentes.

## `src/pages/home-page.tsx` — layout da página inicial e marca

| Classe | Motivação |
| --- | --- |
| `min-h-dvh` | Ocupa pelo menos a altura dinâmica da janela, inclusive em navegadores mobile. |
| `bg-gray-200` | Usa o fundo cinza claro do canvas do Figma (`#E4E6EC`). |
| `px-3` | Mantém 12 px de respiro lateral no layout mobile. |
| `pb-10` | Evita que o conteúdo encoste no fim da página em telas estreitas. |
| `pt-8` | Posiciona a marca 32 px abaixo do topo, como nos frames mobile. |
| `font-open-sans` | Aplica Open Sans como fonte principal da interface. |
| `sm:px-8` | Aumenta as margens laterais para 32 px a partir do breakpoint `sm`. |
| `min-[1040px]:pt-22` | Posiciona o cabeçalho a 88 px do topo no layout desktop. |
| `mx-auto` | Centraliza o conteúdo na viewport. |
| `flex` | Ativa Flexbox para montar os grupos de conteúdo. |
| `w-full` | Permite ocupar a largura disponível antes de aplicar o limite máximo. |
| `max-w-244` | Limita o conjunto da marca e dos cartões a 976 px (244 × 4 px). |
| `flex-col` | Empilha marca e conteúdo no eixo vertical. |
| `mb-6` | Deixa 24 px entre a marca e os cartões no mobile. |
| `h-6` | Reserva 24 px de altura para a linha da marca. |
| `items-center` | Alinha verticalmente o símbolo e o nome da marca. |
| `gap-2` | Mantém 8 px entre o símbolo e o texto “brev.ly”. |
| `w-[26.667px]` | Mantém a largura intrínseca aproximada do símbolo da marca desktop/mobile em um único SVG. |
| `min-[1040px]:mb-8` | Aumenta para 32 px a distância da marca aos cartões no desktop. |
| `min-[1040px]:flex-row` | Coloca os dois cartões lado a lado em viewports desktop. |
| `min-[1040px]:items-start` | Alinha os cartões pelo topo, mesmo quando têm alturas distintas. |
| `items-stretch` | Faz os cartões empilhados preencherem a largura disponível. |
| `gap-3` | Separa os cartões empilhados por 12 px no mobile. |
| `min-[1040px]:gap-4` | Usa 16 px entre os cartões no desktop. |
| `font-quicksand` | Aplica a fonte de marca Quicksand ao logotipo textual. |
| `text-[18.667px]` | Preserva o tamanho tipográfico exato definido para a marca no Figma. |
| `font-bold` | Usa o peso forte do logotipo. |
| `leading-6` | Mantém uma linha de 24 px para a marca. |
| `text-blue-basic` | Aplica o azul institucional do Figma (`#2C46B1`). |

## `src/components/url-shortener.tsx` — cartão de criação

| Classe | Motivação |
| --- | --- |
| `flex` | Organiza o título e o formulário em uma coluna flexível. |
| `w-full` | Faz o cartão usar toda a largura disponível no mobile. |
| `shrink-0` | Impede que o cartão seja comprimido no layout horizontal desktop. |
| `flex-col` | Empilha o título e o formulário. |
| `gap-5` | Aplica 20 px entre título e formulário no mobile. |
| `rounded-lg` | Reproduz os cantos de 8 px dos cartões. |
| `bg-gray-100` | Usa a superfície clara `#F9F9FB` dos cartões. |
| `p-6` | Aplica 24 px de padding no mobile. |
| `shadow-shape` | Aplica a sombra de superfície já definida pelo projeto. |
| `sm:gap-6` | Usa 24 px entre título e formulário em telas maiores. |
| `sm:p-8` | Aumenta o padding do cartão para 32 px no desktop. |
| `min-[1040px]:w-[380px]` | Mantém a largura desktop do cartão de criação em 380 px. |
| `text-lg` | Usa o token tipográfico de 18 px do título. |
| `font-bold` | Destaca o título conforme o frame. |
| `leading-6` | Define altura de linha de 24 px. |
| `text-gray-600` | Usa a cor de texto principal `#1F2025`. |

## `src/components/url-shortener-form.tsx` — formulário e botão externo

| Classe | Motivação |
| --- | --- |
| `flex` | Organiza os controles do formulário. |
| `flex-col` | Empilha os dois campos e o botão. |
| `gap-4` | Mantém 16 px entre os campos do formulário. |
| `gap-5` | Mantém 20 px entre o formulário e o botão no mobile. |
| `min-[1040px]:gap-6` | Aumenta para 24 px o intervalo do formulário ao botão no desktop. |
| `h-12` | Define a altura de 48 px do botão, igual ao frame. |
| `w-full` | Faz o botão preencher a largura interna do cartão. |
| `rounded-lg` | Dá ao botão cantos de 8 px. |
| `bg-blue-basic` | Usa o azul de ação `#2C46B1`. |
| `px-5` | Reserva 20 px de padding horizontal para o texto do botão. |
| `disabled:opacity-50` | Atenua visualmente o botão enquanto o formulário não é válido. |
| `text-sm` | Define o texto do botão em 14 px. |
| `font-semibold` | Dá peso 600 ao rótulo da ação. |
| `leading-4.5` | Mantém a linha do texto em 18 px. |
| `text-white` | Contrasta o rótulo com o fundo azul. |

O botão está fora do elemento `<form>` por requisito de estrutura e continua associado pelo atributo HTML `form="new-short-url"`.

## `src/components/url-shortener-form-input.tsx` — campos e validação

| Classe | Motivação |
| --- | --- |
| `flex` | Transforma cada label em contêiner flexível. |
| `flex-col` | Coloca o nome do campo acima do input e a mensagem de erro abaixo. |
| `gap-2` | Separa label e input por 8 px. |
| `text-gray-500` | Usa a cor de texto secundário `#4D505C`. |
| `text-xxs` | Aplica o token customizado de 10 px nos rótulos em caixa alta. |
| `leading-3.5` | Define 14 px de altura de linha nos rótulos. |
| `h-12` | Define 48 px para a altura do input. |
| `w-full` | Faz o campo acompanhar a largura do cartão. |
| `rounded-lg` | Aplica cantos de 8 px ao campo. |
| `border` | Desenha a borda fina do controle. |
| `border-gray-300` | Usa a borda cinza `#CDCFD5`. |
| `p-4` | Mantém 16 px entre o texto e as bordas do input. |
| `text-sm` | Define 14 px para o conteúdo do campo. |
| `leading-4.5` | Define a altura de linha do texto em 18 px. |
| `text-gray-400` | Usa `#74798B` no prefixo fixo `brev.ly/` do campo de slug. |
| `text-gray-600` | Usa a cor principal `#1F2025` para o texto já digitado nos campos. |
| `placeholder:opacity-100` | Mantém a opacidade original do placeholder em todos os navegadores. |
| `placeholder:text-gray-400` | Mantém o placeholder no cinza `#74798B`, enquanto o valor digitado usa `text-gray-600`. |
| `focus-within:border-blue-basic` | Realça a borda do campo composto quando seu input recebe foco. |
| `shrink-0` | Impede que o prefixo `brev.ly/` seja comprimido pelo texto digitado. |
| `pl-4` | Alinha o prefixo dentro do campo com o padding horizontal de 16 px do design. |
| `min-w-0` | Permite ao input flexível encolher sem causar overflow. |
| `flex-1` | Dá ao input todo o espaço restante depois do prefixo. |
| `bg-transparent` | Deixa o fundo do input integrado ao contêiner com borda compartilhada. |
| `pl-0` | Evita somar padding entre o prefixo e o texto que o usuário digita. |
| `outline-none` | Evita duplicar o contorno nativo; o contêiner usa borda de foco própria. |
| `text-danger` | Usa o token de feedback de erro (`#B12C4D`) definido pelo projeto. |
| `text-xs` | Mantém mensagens de erro compactas, em 12 px. |

`aria-invalid` e `aria-describedby` são atributos de acessibilidade, não classes Tailwind: comunicam estado e mensagem de erro às tecnologias assistivas.

## Painel de links e subcomponentes

O cabeçalho e o cartão permanecem em `src/components/my-links.tsx`. Classes de lista/item foram extraídas para `src/components/short-link-list-item.tsx`, as do estado sem dados para `src/components/empty-links-state.tsx`, os botões quadrados para `src/components/icon-action-button.tsx` e a linha CSS para `src/components/links-divider.tsx`.

| Classe | Motivação |
| --- | --- |
| `flex` | Organiza cabeçalho, divisória e conteúdo do painel. |
| `w-full` | Ocupa a largura disponível no mobile. |
| `flex-col` | Empilha cabeçalho e lista. |
| `gap-4` | Separa seções internas por 16 px no mobile. |
| `rounded-lg` | Reproduz o raio de 8 px do cartão. |
| `bg-gray-100` | Usa a superfície `#F9F9FB`. |
| `p-6` | Aplica padding de 24 px no mobile. |
| `shadow-shape` | Reutiliza a sombra definida no tema do projeto. |
| `sm:gap-5` | Aumenta o espaçamento interno para 20 px em telas maiores. |
| `sm:p-8` | Usa padding desktop de 32 px. |
| `min-[1040px]:w-145` | Define largura de 580 px no desktop (145 × 4 px). |
| `items-center` | Em `my-links.tsx` alinha conteúdo do cabeçalho; em `short-link-list-item.tsx` alinha cada linha e seus controles. |
| `justify-between` | Em `my-links.tsx`, mantém título e exportação nas extremidades do cabeçalho. |
| `h-8` | Em `my-links.tsx`, define 32 px de altura ao botão CSV. |
| `justify-center` | Em `empty-links-state.tsx` centraliza o conteúdo vazio; em `icon-action-button.tsx` centraliza ícone nos botões de ação. |
| `gap-1.5` | Separa ícone e texto do botão CSV por 6 px. |
| `rounded` | Aplica o raio de 4 px ao botão CSV e aos botões de `icon-action-button.tsx`. |
| `bg-gray-200` | Usa a superfície de controle `#E4E6EC`. |
| `px-2` | Dá 8 px de padding horizontal ao botão CSV. |
| `enabled:hover:bg-gray-300` | Indica interação no hover sem mudar o botão CSV desativado. |
| `disabled:opacity-50` | Sinaliza que exportar não é possível enquanto não há links. |
| `enabled:hover:bg-gray-300` | Indica hover somente quando o botão CSV está habilitado. |
| `text-xs` | Usa texto secundário de 12 px em ações/contadores. |
| `font-semibold` | Dá peso 600 ao texto do botão CSV. |
| `leading-4` | Mantém 16 px de altura de linha no CSV. |
| `text-gray-500` | Usa a cor secundária `#4D505C`. |
| `border-0` | Remove a borda padrão do elemento `<hr>` antes de aplicar somente a linha superior. |
| `border-t` | Desenha a divisória com uma borda superior CSS de 1 px que se adapta à largura do painel. |
| `flex-col` | Empilha os links em uma lista vertical. |
| `gap-3` | Separa as divisórias e linhas por 12 px na lista mobile. |
| `sm:gap-4` | Aumenta esses intervalos para 16 px no desktop. |
| `py-0.5` | Dá 2 px acima e abaixo da linha de conteúdo, como no frame. |
| `sm:gap-5` | Ajusta o espaçamento horizontal das colunas no desktop. |
| `min-w-0` | Permite que os títulos/URLs encolham dentro do flex e sejam truncados. |
| `flex-1` | Entrega ao texto do link o espaço restante na linha. |
| `gap-1` | Separa URL encurtada e original por 4 px. |
| `truncate` | Aplica overflow, reticências e uma linha aos URLs longos. |
| `text-sm` | Usa 14 px para o URL encurtado. |
| `font-semibold` | Destaca o URL encurtado com peso 600. |
| `leading-4.5` | Preserva a altura de linha de 18 px dos nomes de link. |
| `text-blue-basic` | Usa o azul institucional para links clicáveis. |
| `hover:underline` | Indica interatividade do URL ao passar o cursor. |
| `whitespace-nowrap` | Mantém o contador de acessos em uma única linha. |
| `text-right` | Alinha o contador de acessos à direita. |
| `shrink-0` | Impede que contador e ações desapareçam quando o título é longo. |
| `gap-1` | Deixa 4 px entre os botões de copiar e excluir. |
| `size-8` | Define botões quadrados de 32 × 32 px. |
| `hover:bg-gray-300` | Fornece feedback visual nos botões de ícone em `icon-action-button.tsx`. |
| `enabled:hover:bg-gray-300` | Aplica hover apenas quando um controle estiver habilitado. |
| `disabled:cursor-not-allowed` | Indica visualmente que uma ação de exclusão está em andamento e temporariamente indisponível. |
| `disabled:opacity-50` | Atenua visualmente controles desabilitados, como exclusão em progresso. |
| `pb-6` | Reserva 24 px abaixo da ilustração do estado vazio. |
| `pt-4` | Reserva 16 px acima da ilustração. |
| `h-4.5` | Define a altura de 18 px da mensagem vazia. |
| `text-ellipsis` | Trunca o texto se ele exceder o espaço disponível. |
| `text-center` | Centraliza a mensagem vazia em `empty-links-state.tsx`. |
| `uppercase` | Reproduz a caixa alta usada no Figma para a mensagem vazia. |
| `leading-3.5` | Define altura de linha de 14 px à mensagem vazia. |
| `py-6` | Reserva espaço vertical para o estado de carregamento da lista. |
| `role="status"` | Atributo semântico (não classe) que anuncia o carregamento para tecnologias assistivas. |
| `items-start` | Alinha texto e botão de retry de erro à borda inicial do conteúdo. |
| `text-danger` | Usa o token de cor de erro para falhas de carregamento ou exclusão. |
| `hover:bg-gray-300` | Dá feedback visual ao botão para repetir a consulta da API. |
| `px-3` | Adiciona 12 px de respiro horizontal ao botão de retry. |
| `py-2` | Adiciona 8 px de respiro vertical ao botão de retry. |
| `font-semibold` | Destaca o rótulo da ação de retry. |

O componente `links-divider.tsx` aplica `w-full border-0 border-t border-gray-200`: largura total para acompanhar o painel, remove a borda padrão do `<hr>`, desenha somente a borda superior de 1 px e usa o token cinza do Figma.

Os ícones Phosphor recebem `size` e `color` por props; botões reutilizáveis recebem o rótulo acessível e a ação por props. Essas props não são classes Tailwind.

## `src/pages/redirect-page.tsx` — estado de redirecionamento

| Classe | Motivação |
| --- | --- |
| `flex` | Centraliza o cartão de status na viewport. |
| `min-h-dvh` | Faz o fundo cobrir pelo menos toda a altura dinâmica da tela. |
| `items-center` | Centraliza o conteúdo verticalmente. |
| `justify-center` | Centraliza o conteúdo horizontalmente. |
| `bg-gray-200` | Mantém o fundo cinza do restante do produto. |
| `px-3` | Evita que o cartão toque as bordas em mobile. |
| `font-open-sans` | Mantém tipografia consistente com os frames. |
| `w-full` | Permite que o cartão se ajuste à viewport. |
| `max-w-145` | Limita a largura do cartão de feedback a 580 px (145 × 4 px). |
| `translate-y-[-17.5px]` | Ajusta o centro visual vertical conforme o frame desktop. |
| `flex-col` | Empilha logo, título e mensagem. |
| `gap-6` | Mantém 24 px entre os blocos. |
| `rounded-lg` | Aplica os cantos de 8 px do cartão. |
| `bg-gray-100` | Usa a superfície clara `#F9F9FB`. |
| `px-5` | Usa 20 px de padding horizontal no mobile. |
| `py-12` | Usa 48 px de padding vertical no mobile. |
| `text-center` | Centraliza a mensagem e o título. |
| `sm:px-12` | Aumenta o padding horizontal para 48 px no desktop. |
| `sm:py-16` | Aumenta o padding vertical para 64 px no desktop. |
| `h-12` | Preserva a altura original de 48 px do SVG da marca. |
| `w-12` | Preserva a largura original de 48 px do SVG da marca. |
| `text-2xl` | Usa 24 px no título do estado. |
| `font-bold` | Destaca o título com peso 700. |
| `leading-8` | Define linha de 32 px ao título. |
| `text-gray-600` | Usa a cor principal do texto `#1F2025`. |
| `w-full` | Permite à mensagem ocupar a largura interna do cartão. |
| `flex-col` | Separa as frases em duas linhas/áreas. |
| `gap-1` | Separa as linhas de mensagem por 4 px. |
| `text-sm` | Define 14 px às mensagens. |
| `font-semibold` | Reproduz peso 600 da cópia no Figma. |
| `leading-4.5` | Define 18 px de altura de linha da mensagem. |
| `text-gray-500` | Usa a cor secundária `#4D505C`. |
Os ícones do painel são componentes de `@phosphor-icons/react`; seu tamanho e cor são passados nas props `size` e `color`, e ícones decorativos recebem `aria-hidden`.
| `text-blue-basic` | Destaca o link de ação com o azul institucional. |
| `underline` | Indica que “Acesse aqui” é um link. |

## `src/pages/short-link-page.tsx` — carregamento, erro e retry da rota curta

| Classe | Motivação |
| --- | --- |
| `flex` | Organiza e centraliza cada estado assíncrono em Flexbox. |
| `min-h-dvh` | Mantém o fundo cobrindo a altura dinâmica da viewport. |
| `items-center` | Centraliza spinner, mensagem e ação verticalmente. |
| `justify-center` | Centraliza o bloco de estado na tela. |
| `bg-gray-200` | Mantém o fundo usado pelos demais estados da aplicação. |
| `px-4` | Evita que o conteúdo de erro/loading encoste nas bordas em mobile. |
| `font-open-sans` | Mantém a tipografia padrão do produto. |
| `gap-3` | Separa spinner e texto de status por 12 px. |
| `text-sm` | Mantém mensagens assíncronas em 14 px. |
| `font-semibold` | Dá ênfase ao texto de status. |
| `text-gray-500` | Usa a cor secundária para status neutro de carregamento. |
| `animate-spin` | Gira o ícone Phosphor durante a busca na API. |
| `text-center` | Centraliza a mensagem de falha e retry. |
| `text-danger` | Comunica erro de rede/servidor pela cor de feedback. |
| `gap-4` | Separa a mensagem de erro da ação de retry por 16 px. |
| `rounded-lg` | Dá cantos de 8 px ao botão de retry. |
| `bg-blue-basic` | Usa a cor primária para a ação de tentar novamente. |
| `px-5` | Reserva 20 px de padding horizontal no botão. |
| `py-3` | Reserva 12 px de padding vertical para área de toque adequada. |
| `text-white` | Garante contraste do rótulo sobre fundo azul. |

`role="status"`, `role="alert"` e `type="button"` são atributos semânticos/HTML, não classes Tailwind.

## `src/pages/not-found-page.tsx` — estado 404

| Classe | Motivação |
| --- | --- |
| `flex` | Centraliza o cartão de erro na viewport. |
| `min-h-dvh` | Cobre a altura dinâmica mínima da tela. |
| `items-center` | Alinha o cartão verticalmente. |
| `justify-center` | Alinha o cartão horizontalmente. |
| `bg-gray-200` | Mantém o fundo comum das telas. |
| `px-3` | Preserva margem mobile de 12 px. |
| `font-open-sans` | Mantém a tipografia dos demais estados. |
| `w-full` | Faz o cartão adaptar-se a viewports menores. |
| `max-w-145` | Limita o cartão à largura desktop de 580 px (145 × 4 px). |
| `translate-y-[-17.5px]` | Ajusta a posição vertical para corresponder ao estado de redirecionamento. |
| `flex-col` | Empilha ilustração, título e explicação. |
| `gap-6` | Separa os blocos por 24 px. |
| `rounded-lg` | Mantém raio de 8 px. |
| `bg-gray-100` | Aplica o fundo `#F9F9FB` do cartão. |
| `px-5` | Usa 20 px de padding horizontal no mobile. |
| `py-12` | Usa 48 px de padding vertical no mobile. |
| `text-center` | Centraliza o conteúdo do erro. |
| `sm:px-12` | Usa 48 px de padding horizontal no desktop. |
| `sm:py-16` | Usa 64 px de padding vertical no desktop. |
| `flex` | Centraliza o SVG 404 dentro da área de ilustração. |
| `h-18` | Define a altura de 72 px da ilustração no mobile. |
| `w-41` | Define a largura de 164 px da ilustração no mobile. |
| `object-fill` | Ajusta a ilustração desktop única ao espaço dimensionado para mobile/desktop. |
| `items-center` | Alinha a ilustração ao centro de sua área. |
| `justify-center` | Centraliza horizontalmente a ilustração. |
| `sm:h-21.25` | Ajusta a altura para 85 px no frame desktop. |
| `sm:w-48.5` | Ajusta a largura para 194 px no frame desktop. |
| `text-2xl` | Usa 24 px no título 404. |
| `font-bold` | Dá peso 700 ao título. |
| `leading-8` | Define altura de linha de 32 px. |
| `text-gray-600` | Usa o texto principal `#1F2025`. |
| `w-full` | Faz a explicação usar toda a largura útil. |
| `text-center` | Centraliza a explicação. |
| `text-sm` | Define 14 px para a mensagem de erro. |
| `font-semibold` | Reproduz o peso 600 do frame. |
| `leading-4.5` | Mantém 18 px de altura de linha na mensagem. |
| `text-gray-500` | Usa o cinza secundário `#4D505C`. |
| `text-blue-basic` | Destaca o link da marca. |
| `underline` | Indica que a marca é clicável. |

## Breakpoints e classes arbitrárias

- `sm:` aplica ajustes a partir de 640 px: as referências mobile têm cartões com 24 px de padding; as desktop usam 32–48 px.
- `min-[1040px]:` ativa a composição em duas colunas somente quando há espaço para os cartões de 380 px e 580 px, além do intervalo de 16 px e margens.
- `text-[18.667px]`, `w-[380px]` e `translate-y-[-17.5px]` correspondem a medidas explícitas dos frames, não a valores arbitrários escolhidos para decoração. Marca e 404 usam uma única versão desktop e são redimensionadas por classes Tailwind; as divisórias são bordas CSS.
- Modificadores como `hover:`, `enabled:hover:`, `disabled:`, `focus-within:` e `placeholder:` preservam estados interativos, foco, estado desabilitado e comportamento nativo de cada controle.
