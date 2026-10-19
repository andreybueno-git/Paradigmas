/*
 * Gera um CSS por página a partir dos CSS originais do site (legado/css), sem reescrevê-los à mão.
 *
 * Por quê: no site estático cada página carregava só os seus CSS. Numa SPA, depois de navegar,
 * as folhas de páginas anteriores continuam no documento, e regras como `body {}`, `main::after`
 * ou `button {}` de uma página vazariam para as outras. Aqui cada página ganha um pacote com os
 * mesmos arquivos, na mesma ordem dos <link> originais, e cada seletor só vale com a página
 * montada:
 *
 *   .x                -> :where(S) .x                (mesma especificidade de antes)
 *   .natal-theme .x   -> :where(S).natal-theme .x    (classes que moravam no <body> vão para o wrapper)
 *   html / :root      -> html:where(:has(S))         (continuam no elemento raiz de verdade)
 *   body              -> body:where(:has(S))
 *   body.natal-theme  -> body:where(:has(S.natal-theme))
 *   * / *::before     -> :where(S) *, :where(html:has(S)), :where(body:has(S))
 *
 * S = [data-fc-page~="<página>"]. A página renderiza <div data-fc-page="..." style="display:contents">.
 * Estratégia validada com 0 diferenças de estilo em 13 páginas e 2 larguras (docs/MIGRACAO.md).
 *
 * Uso: node scripts/gerar-estilos.mjs   (roda sozinho antes de `npm run dev` e `npm run build`)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import seletores from 'postcss-selector-parser';
import valores from 'postcss-value-parser';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEGADO = path.join(RAIZ, 'legado/css');
const SAIDA = path.join(RAIZ, 'src/estilos/paginas');

// Ordem exata dos <link> de cada página no site original (FAQ tem o rodapé antes da página;
// o experiencia é sempre o último; a home começa pelo estilo crítico que ficava no <head>).
const PACOTES = {
  home: ['home-inline', 'cabecalho', 'home', 'rodape', 'natal', 'course-computers', 'globo', 'entrada', 'experiencia'],
  cursos: ['cabecalho', 'cursos', 'rodape', 'course-computers', 'experiencia'],
  programacao: ['cabecalho', 'programacao', 'rodape', 'experiencia'],
  instrutores: ['cabecalho', 'instrutores', 'rodape', 'experiencia'],
  patrocinadores: ['cabecalho', 'patrocinadores', 'rodape', 'experiencia'],
  contato: ['cabecalho', 'contato', 'rodape', 'experiencia'],
  sobre: ['cabecalho', 'sobre', 'rodape', 'experiencia'],
  faq: ['cabecalho', 'rodape', 'faq', 'experiencia'],
  login: ['login', 'experiencia'],
  cadastro: ['cadastro', 'experiencia'],
  inscricoes: ['inscricoes', 'experiencia'],
  matricula: ['matricula', 'experiencia'],
  admin: ['admin'],
};

// Classes e atributos que o site original colocava no <body> e agora moram no wrapper da página.
const NO_BODY = {
  home: ['natal-theme', 'fc-paused', 'fc-hidden', 'fc-motion-ready', 'fc-entry-active', 'fc-entry-landing', 'fc-globe-open', '[data-lights]'],
};

function plugin({ pagina, noBody = [] }) {
  const classes = new Set(noBody.filter(item => !item.startsWith('[')));
  const atributos = new Set(noBody.filter(item => item.startsWith('[')).map(item => item.slice(1, -1)));
  const moravaNoBody = no => (no.type === 'class' && classes.has(no.value)) || (no.type === 'attribute' && atributos.has(no.attribute));
  const S = `[data-fc-page~="${pagina}"]`;
  const analisar = texto => seletores().astSync(texto).first;
  const onde = texto => seletores.pseudo({ value: ':where', nodes: [analisar(texto)] });

  const transformar = seletores(lista => {
    const extras = [];
    lista.each(seletor => {
      seletor.spaces.before = '';
      // Espaço depois da vírgula vira um combinador descendente no começo: remove antes de analisar.
      while (seletor.first && seletor.first.type === 'combinator' && !seletor.first.value.trim()) seletor.first.remove();
      if (seletor.first) seletor.first.spaces.before = '';
      // `body` dentro de :has()/:is()/:not() passa a significar o wrapper da página.
      seletor.walkTags(tag => { if (tag.value === 'body' && tag.parent !== seletor) tag.replaceWith(analisar(S).first); });
      const primeiro = [];
      for (const no of seletor.nodes) { if (no.type === 'combinator') break; primeiro.push(no); }
      // Pseudo-elementos do documento (::view-transition-*) ficam presos ao <html>.
      if (primeiro[0]?.type === 'pseudo' && primeiro[0].value.startsWith('::view-transition')) {
        seletor.prepend(onde(`:has(${S})`)); seletor.prepend(seletores.tag({ value: 'html' })); return;
      }
      const ancora = primeiro.find(no => (no.type === 'tag' && /^(html|body)$/i.test(no.value)) || (no.type === 'pseudo' && no.value === ':root'));
      if (ancora) {
        const movidos = primeiro.filter(moravaNoBody);
        movidos.forEach(no => no.remove());
        ancora.parent.insertAfter(ancora, onde(`:has(${S}${movidos.map(String).join('')})`));
        return;
      }
      if (primeiro.some(moravaNoBody)) { seletor.insertBefore(primeiro[0], onde(S)); return; }
      const soUniversal = primeiro.length && primeiro[0].type === 'universal' && primeiro.every(no => no.type === 'universal' || (no.type === 'pseudo' && no.value.startsWith('::')));
      if (soUniversal && seletor.nodes.length === primeiro.length) {
        // O `*` original também pegava <html> e <body> (é ele que zerava a margem do body).
        const pseudo = primeiro.filter(no => no.type === 'pseudo').map(String).join('');
        extras.push(`:where(html:has(${S}))${pseudo}`, `:where(body:has(${S}))${pseudo}`);
      }
      seletor.prepend(seletores.combinator({ value: ' ' }));
      seletor.prepend(onde(S));
    });
    for (const extra of extras) lista.append(analisar(extra));
  });

  return {
    postcssPlugin: 'fc-escopo',
    Once(raiz) {
      raiz.walkRules(regra => {
        if (regra.parent?.type === 'atrule' && /keyframes$/i.test(regra.parent.name)) return;
        regra.selector = transformar.processSync(regra.selector);
      });
      // url() com parser de valores: regex pegaria o url(%23n) que existe dentro de um data: (natal.css).
      const origem = raiz.source.input.file;
      raiz.walkDecls(declaracao => {
        if (!declaracao.value.includes('url(')) return;
        const valor = valores(declaracao.value);
        valor.walk(no => {
          if (no.type !== 'function' || no.value !== 'url' || !no.nodes[0]) return;
          const endereco = no.nodes[0].value;
          if (/^(data:|#|https?:)/.test(endereco)) return false;
          const arquivo = path.resolve(path.dirname(origem), endereco.split(/[?#]/)[0]);
          if (!fs.existsSync(arquivo)) throw new Error(`${path.relative(RAIZ, origem)}: arquivo não existe: ${endereco}`);
          no.nodes = [{ type: 'string', quote: '"', value: path.relative(SAIDA, arquivo).split(path.sep).join('/') }];
          return false;
        });
        declaracao.value = valor.toString();
      });
    },
  };
}
plugin.postcss = true;

async function gerar() {
  fs.rmSync(SAIDA, { recursive: true, force: true });
  fs.mkdirSync(SAIDA, { recursive: true });
  const resumo = [];
  for (const [pagina, arquivos] of Object.entries(PACOTES)) {
    let saida = `/* Gerado por scripts/gerar-estilos.mjs. Não edite: altere legado/css/ e rode o script.\n   Página ${pagina}: ${arquivos.join(' > ')} */\n`;
    const animacoes = new Map();
    for (const nome of arquivos) {
      const arquivo = path.join(LEGADO, `${nome}.css`);
      const resultado = await postcss([plugin({ pagina, noBody: NO_BODY[pagina] || [] })]).process(fs.readFileSync(arquivo, 'utf8'), { from: arquivo });
      // Nomes de @keyframes são globais: dois arquivos do mesmo pacote não podem divergir.
      resultado.root.walkAtRules(/keyframes$/i, regra => {
        const corpo = regra.nodes.map(String).join('');
        if (animacoes.has(regra.params) && animacoes.get(regra.params) !== corpo) throw new Error(`@keyframes ${regra.params} com corpos diferentes no pacote ${pagina}`);
        animacoes.set(regra.params, corpo);
      });
      saida += `\n/* --- legado/css/${nome}.css --- */\n${resultado.css}\n`;
    }
    fs.writeFileSync(path.join(SAIDA, `${pagina}.css`), saida);
    resumo.push(`${pagina} ${Math.round(saida.length / 1024)} KB`);
  }
  console.log(`estilos gerados em src/estilos/paginas: ${resumo.join(', ')}`);
}

gerar().catch(erro => { console.error(erro.message); process.exit(1); });
