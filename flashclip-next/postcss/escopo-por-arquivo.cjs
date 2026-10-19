/*
 * Isola cada folha de estilo do site original.
 *
 * No site estático cada página carregava só os seus CSS. No Next, depois de navegar, os CSS
 * de páginas anteriores continuam carregados, e regras como `body {}` ou `.navbar {}` de uma
 * página vazariam para as outras. Este plugin faz cada arquivo em src/estilos/escopo/<nome>.css
 * valer só dentro do contêiner da página que o declara:
 *
 *   <div data-estilos="cabecalho home natal"> ... </div>
 *
 *   .navbar { }               ->  [data-estilos~="cabecalho"] .navbar { }
 *   body { } / html { }       ->  [data-estilos~="home"] { }          (o contêiner faz o papel do body)
 *   body.natal-theme .x { }   ->  [data-estilos~="natal"].natal-theme .x { }
 *   @keyframes brilho         ->  @keyframes brilho--natal             (nomes não colidem entre arquivos)
 *
 * Classes e atributos que o site original punha no <body> (opção `doBody`, ex.: natal-theme,
 * data-lights) também passam para o contêiner: `.natal-theme .x` -> `[data-estilos~="natal"].natal-theme .x`.
 * Por isso o React deve colocá-los no contêiner da página, e não em document.body.
 */
const PASTA = /\/estilos\/escopo\/([\w-]+)\.css$/;
const RAIZ = /^(html|body|:root)(?![\w-])/;
const QUALIFICADORES = /^(?:[.#][\w-]+|\[[^\]]*\]|::?[\w-]+(?:\([^)]*\))?)*/;

function escopar(seletor, escopo, doBody = []) {
  let resto = seletor.trim();
  // Começa com uma classe/atributo que morava no <body>: equivale a "body.classe".
  const primeiro = resto.match(QUALIFICADORES)[0];
  if (primeiro && doBody.some(item => primeiro.startsWith(item) && !/[\w-]/.test(primeiro.charAt(item.length)))) resto = 'body' + resto;
  let alvo = escopo;
  let tocouRaiz = false;
  // html, body e :root no começo viram o contêiner; classes e atributos deles passam para ele.
  for (;;) {
    const raiz = resto.match(RAIZ);
    if (!raiz) break;
    tocouRaiz = true;
    resto = resto.slice(raiz[0].length);
    const extras = resto.match(QUALIFICADORES)[0];
    alvo += extras;
    resto = resto.slice(extras.length);
    // "html body" ou "html > body": a parte seguinte também é raiz e se funde ao contêiner.
    const proximo = resto.match(/^\s*>?\s*/)[0];
    if (RAIZ.test(resto.slice(proximo.length))) { resto = resto.slice(proximo.length); continue; }
    break;
  }
  if (tocouRaiz) return resto.trim() ? `${alvo}${/^\s*[>+~]/.test(resto) ? ' ' + resto.trim() : resto.startsWith(' ') ? resto : ' ' + resto}` : alvo;
  return `${escopo} ${resto}`;
}

module.exports = (opcoes = {}) => ({
  postcssPlugin: 'escopo-por-arquivo',
  Once(root) {
    const arquivo = (root.source && root.source.input && root.source.input.file || '').replace(/\\/g, '/');
    const encontrado = arquivo.match(PASTA);
    if (!encontrado) return;
    const nome = encontrado[1];
    const escopo = `[data-estilos~="${nome}"]`;

    const animacoes = new Map();
    root.walkAtRules(/keyframes$/i, regra => {
      const novo = `${regra.params}--${nome}`;
      animacoes.set(regra.params, novo);
      regra.params = novo;
    });

    root.walkRules(regra => {
      if (regra.parent && regra.parent.type === 'atrule' && /keyframes$/i.test(regra.parent.name)) return;
      regra.selectors = regra.selectors.map(seletor => escopar(seletor, escopo, opcoes.doBody || []));
    });

    if (animacoes.size) {
      root.walkDecls(/^(animation|animation-name)$/i, declaracao => {
        declaracao.value = declaracao.value.replace(/[\w-]+/g, palavra => animacoes.get(palavra) || palavra);
      });
    }
  },
});
module.exports.postcss = true;
module.exports.escopar = escopar;
