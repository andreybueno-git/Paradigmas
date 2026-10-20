# Migração do FlashClip para React + Next.js: convenções

Este documento vale para todo o código em `flashclip-next/`. Fonte da verdade do comportamento e do
visual: o site estático em `../FlashClip/`. A conversão foi feita por páginas e comparada com o original
(prints em 1280 e 390 px, estilos computados e comportamentos), com o Supabase simulado.

## Como rodar
```bash
cd flashclip-next
npm install
npm run dev        # http://localhost:3000 (gera os CSS por página antes)
npm run build      # gera o site estático em out/
NEXT_PUBLIC_BASE_PATH=/Paradigmas npm run build   # para publicar em https://<usuário>.github.io/Paradigmas/
```

## Objetivo
Mesmo visual e comportamento do site atual (paridade), em componentes React idiomáticos, com navegação
no cliente: o layout não desmonta, então a música continua entre as telas sem a moldura `app.html`.

## Pilha
- Next 16.4.2 (App Router, `output: 'export'`, `trailingSlash: true`, `basePath` = `NEXT_PUBLIC_BASE_PATH`),
  React 19.3.1, JavaScript/JSX (sem TypeScript). Alias `@/` = `src/`.
- `three@0.180.0` do npm (`three`, `three/examples/jsm/...`; meshopt:
  `three/examples/jsm/libs/meshopt_decoder.module.js`). `@supabase/supabase-js` do npm.
- Sem `next/font`, sem favicon novo, sem bibliotecas de UI.

## Rotas
| Original | Rota Next | Arquivo |
|---|---|---|
| `index.html` | `/` | `src/app/(site)/page.jsx` |
| `html/<nome>.html` | `/<nome>/` | `src/app/(site)/<nome>/page.jsx` (cursos, programacao, instrutores, patrocinadores, contato, sobre, faq, login, cadastro, inscricoes, matricula) |
| `admin/admin.html` | `/admin/` | `src/app/(admin)/admin/page.jsx` |

`(site)` e `(admin)` têm **layouts raiz separados**. Ir para o admin e voltar é recarga completa (sem música no admin).
`matricula` lê `?id=` (como o original e os links dos cards; `?curso=` também é aceito) com `useSearchParams()` dentro de `<Suspense>`.

## CSS: um pacote por página (não editar o CSS gerado)
- Os CSS originais estão **sem alteração** em `legado/css/` (as imagens em `legado/imagens/`).
- `npm run estilos` (roda sozinho antes de `dev`/`build`) gera `src/estilos/paginas/<pagina>.css`: os mesmos
  arquivos e na mesma ordem dos `<link>` originais, com todo seletor escopado em `[data-fc-page~="<pagina>"]`
  via `:where()` (especificidade igual à original). `html`/`body`/`:root` continuam no elemento real
  (`body:where(:has(S))`). Detalhes em `scripts/gerar-estilos.mjs`.
- Cada `page.jsx` importa **só** o seu pacote: `import '@/estilos/paginas/<pagina>.css'`.
- Cada página renderiza **um** wrapper, já no Server Component (para estar no HTML estático):
  ```jsx
  <div data-fc-page="login" style={{ display: 'contents' }}> …cabeçalho, main, rodapé, overlays… </div>
  ```
  O wrapper faz o papel do `<body>` original: as classes e atributos que o JS original punha em
  `document.body` vão **para o wrapper** (lista na home: `natal-theme`, `fc-paused`, `fc-hidden`,
  `fc-motion-ready`, `fc-entry-active`, `fc-entry-landing`, `fc-globe-open`, `data-lights`). Nada de
  estado em `document.body` (ele sobrevive às rotas). Estado em `<html>` (ex.: `fc-loading`,
  `fc-loaded-before`, `data-load-state`) só se o original fazia isso, e **sempre removido no unmount**.
- Seletores do JS original do tipo `body > x` viram filhos do wrapper (`[data-fc-page~="home"] > x`) ou refs.
- **Sem portais** para `document.body`: overlays, diálogos e animações de sucesso ficam dentro do wrapper
  (o CSS deles só casa dentro do escopo).
- CSS novo, se for indispensável: `src/estilos/global/` (só coisas fora de qualquer página, como a barra
  de áudio) ou um arquivo novo em `legado/css/` adicionado ao pacote certo em `scripts/gerar-estilos.mjs`.
  Prefira não criar CSS novo.

## Cabeçalho, rodapé, áudio, botões magnéticos
- Cabeçalho e rodapé são componentes compartilhados em `src/componentes/` e são renderizados **por cada
  página, dentro do wrapper** (não no layout). Cada página usa a variante que o seu HTML original tinha.
- A barra de música/efeitos (`<ControleAudio/>`) e os botões magnéticos (`<Experiencia/>`) já estão no
  layout `(site)`. Para outros botões de música/efeitos (ex.: controles da abertura da home) use
  `<BotaoMusica/>` e `<BotaoEfeitos/>` de `@/componentes/Audio`. Os efeitos sonoros continuam por eventos
  em `window`: `fc:entry-hit` (`detail.count`), `fc:sleigh-fly`, `fc:shake`, `fc:entry-complete`, `fc:ui-press`.
- O portão do primeiro som na home é automático: o motor procura `#globo` no momento do gesto. Mantenha
  os mesmos ids/atributos (`#globo`, `[data-entry-tap]`, `[data-explore-globe]`, `[data-replay-entry]`).
- Os botões magnéticos são `.navbar .inscricoes, .menu-mobile .inscricoes, #botaoUsuario,
  #botaoUsuarioMobile, .botao-login, .botao-cadastro, .botao-confirmar`: escreva `fc-magnetic` **no
  `className` do JSX** desses botões (o React não pode apagar a classe ao re-renderizar).
- **Nenhuma animação de troca de tela** (sem `startViewTransition`, sem `<ViewTransition>`).

## Navegação e dados
- Links internos: `next/link` com a rota nova e barra no fim (`<Link href="/cursos/">`, `href="/#cursos"`).
  Navegação por código: `useRouter().push('/inscricoes/')`. **Nunca** `window.location` nem `<a href="...html">`
  para páginas do site (recarregaria e cortaria a música). Exceção: o admin (`<a href={asset('/admin/')}>`)
  e voltar do admin para o site (recarga esperada).
- Arquivos de `public/` (imagens em `<img>`, modelos `.glb`, logos dos notebooks): sempre com
  `asset('/caminho')` de `@/lib/caminho` (acrescenta o basePath do GitHub Pages). `public/imagens/` espelha
  `../FlashClip/imagens/`; `public/models/`; `public/notebooks/{models,logos,licenses,provenance.json}`.
- Supabase: `import { clienteSupabase } from '@/lib/supabase'` (só em componentes cliente). Consultas,
  textos, regras de validação e chaves de `localStorage`/`sessionStorage` **idênticos** ao original.

## Ciclo de vida (obrigatório)
- Tudo que o original fazia ao carregar a página roda em `useEffect` e é **desfeito no cleanup**: ouvintes,
  timers, `requestAnimationFrame`, observers, contextos WebGL (`renderer.dispose()` +
  `forceContextLoss()` quando fizer sentido), geometrias/materiais/texturas, nós de áudio da página.
- Em `next dev` o React monta, desmonta e monta de novo (StrictMode): o código precisa aguentar isso sem
  duplicar nada.
- Módulos imperativos grandes (globo 3D, abertura, notebooks) podem continuar como módulos JS em
  `src/lib/`, mas expondo `iniciar(raiz, opções) → destruir()`, sem rodar nada ao serem importados e sem
  `document.querySelector` global (recebem o elemento raiz/refs).
- Three.js e módulos pesados: `import()` dinâmico dentro do `useEffect` (nunca no servidor).

## Regras para quem for mexer no código
- Não edite `src/estilos/paginas/` (é gerado): mude `legado/css/` e rode `npm run estilos`.
- Checagem rápida de sintaxe sem compilar o site: `npm run -s checar -- <arquivos>` (esbuild).
- Comentários e nomes em português, no estilo do código existente.
