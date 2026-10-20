/*
 * Tela de carregamento da home (porte do script inline de index.html + js/carregamento.js).
 * Revela a página por prontidão real (imagens, estilos, fontes, cursos, globo, trenó e cena 3D),
 * sem porcentagem, e só uma vez por aba: a chave flashclip-carregado-v1 do sessionStorage é
 * gravada na revelação; com ela, a home abre direto (sem timer, sem tela de erro e sem
 * fc:preview-visible; uma falha do 3D vira a versão estática em silêncio).
 *
 *   const home = { canal, boot: criarCarregamento(canal) };   // um por montagem da home
 *   boot.jaCarregado()        decisão da montagem: a tela nem é renderizada (lida uma vez só)
 *   boot.tela()/assinar(fn)   estado da tela para o React (useSyncExternalStore)
 *   boot.iniciar(raiz)        no useLayoutEffect: classes do <html>, timer de 45 s e recursos;
 *                             devolve a limpeza (tira fc-loading/fc-loaded-before/data-load-state)
 *   boot.report/fail/continuarLeve, boot.bypassed, boot.revealed   (o antigo window.FlashClipBoot)
 *
 * O `canal` (EventTarget da home) recebe fc:globe-unavailable, fc:load-bypass e
 * fc:preview-visible, que antes iam para window. Nada roda ao importar este módulo.
 */
import { asset } from '@/lib/caminho';

export const CHAVE_CARREGADO = 'flashclip-carregado-v1';

const TITULO_ERRO = 'Vamos tentar de novo?';
const MENSAGEM_ERRO = 'Alguns recursos não carregaram. Tente novamente ou continue com uma versão leve do evento.';
const NOTA_ERRO = 'Você pode continuar mesmo se o 3D não estiver disponível.';

export function lerCarregado() {
  try { return sessionStorage.getItem(CHAVE_CARREGADO) === '1'; } catch { return false; }
}

// Script do HTML exportado, que só roda na carga direta da home (numa navegação no cliente o React
// não executa <script>). Ele marca o <html> antes da primeira pintura, como o bootstrap do <head>
// original. Se o React nunca assumir a página (o JavaScript do site não carregou), mostra a tela de
// erro aos 45 s, com os mesmos botões; quando o React assume, chama window.__fcCarregamento().
export const SCRIPT_CARREGAMENTO = `(() => {
  const root = document.documentElement;
  // A tela de carregamento aparece só na primeira visita; ao voltar para a home, a página abre direto.
  let loadedBefore = false; try { loadedBefore = sessionStorage.getItem(${JSON.stringify(CHAVE_CARREGADO)}) === '1'; } catch {}
  if (loadedBefore) { root.classList.add('fc-loaded-before'); root.dataset.loadState = 'ready'; return; }
  root.classList.add('fc-loading'); root.dataset.loadState = 'loading';
  const clique = event => {
    if (event.target.closest('[data-loading-retry]')) location.reload();
    if (event.target.closest('[data-loading-continue]')) {
      root.classList.remove('fc-loading'); root.dataset.loadState = 'light';
      const overlay = document.getElementById('fc-loading'); if (overlay) overlay.hidden = true;
    }
  };
  const timer = setTimeout(() => {
    const overlay = document.getElementById('fc-loading'); if (!overlay) return;
    root.dataset.loadState = 'error'; overlay.dataset.state = 'error'; overlay.setAttribute('aria-busy', 'false');
    overlay.querySelector('h1').textContent = ${JSON.stringify(TITULO_ERRO)};
    overlay.querySelector('[data-loading-message]').textContent = ${JSON.stringify(MENSAGEM_ERRO)};
    overlay.querySelector('[data-loading-actions]').hidden = false;
    overlay.querySelector('[data-loading-note]').textContent = ${JSON.stringify(NOTA_ERRO)};
    document.addEventListener('click', clique);
  }, 45000);
  window.__fcCarregamento = () => { clearTimeout(timer); document.removeEventListener('click', clique); delete window.__fcCarregamento; };
})();`;

// Estado da tela igual ao HTML estático: é também o que o servidor renderiza.
export const TELA_INICIAL = Object.freeze({
  erro: false,
  ocupado: true,
  titulo: 'Preparando seu Natal.',
  mensagem: 'Carregando os detalhes do nosso pequeno mundo…',
  nota: 'A experiência aparece assim que estiver pronta.',
  etapas: null,
  saindo: false,
  oculto: false,
});

const iguais = (a, b) => a === b || (!!a && !!b && a.globe === b.globe && a.sleigh === b.sleigh && a.page === b.page);

export function criarCarregamento(canal) {
  const boot = { states: {}, error: false, revealed: false, bypassed: false };
  const ouvintes = new Set();
  let tela = TELA_INICIAL, jaCarregado, raiz = null, iniciado = false, timer = 0, timerSaida = 0;

  const emitir = nome => canal.dispatchEvent(new CustomEvent(nome));

  function mudarTela(mudancas) {
    const proxima = { ...tela, ...mudancas };
    const mudou = Object.keys(proxima).some(chave => (chave === 'etapas' ? !iguais(proxima.etapas, tela.etapas) : proxima[chave] !== tela[chave]));
    if (!mudou) return;
    tela = proxima;
    for (const ouvinte of ouvintes) ouvinte();
  }

  // Porte do sync() de carregamento.js.
  function sincronizar() {
    if (!iniciado || boot.revealed) return;
    if (boot.error) {
      mudarTela({ erro: true, ocupado: false, titulo: TITULO_ERRO, mensagem: MENSAGEM_ERRO, nota: NOTA_ERRO });
      return;
    }
    const pageReady = ['images', 'styles', 'fonts', 'courses'].every(name => boot.states[name] === 'ready');
    const etapas = { globe: boot.states.globe === 'ready', sleigh: boot.states.sleigh === 'ready', page: pageReady };
    const mensagem = !etapas.globe ? 'Preparando o globo de neve…' : !etapas.sleigh ? 'Papai Noel está preparando o trenó…' : !pageReady ? 'Preparando a imagem e os detalhes do evento…' : 'Ajustando as luzes para receber você…';
    mudarTela({ etapas, mensagem });
    if (!Object.values(etapas).every(Boolean) || boot.states.scene !== 'ready') return;
    boot.revealed = true; clearTimeout(timer);
    try { sessionStorage.setItem(CHAVE_CARREGADO, '1'); } catch {}
    const html = document.documentElement;
    html.dataset.loadState = 'ready';
    html.classList.remove('fc-loading');
    mudarTela({ ocupado: false, saindo: true });
    const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    timerSaida = setTimeout(() => { mudarTela({ oculto: true }); emitir('fc:preview-visible'); }, reduzido ? 0 : 400);
  }

  function report(name, status = 'ready') {
    boot.states[name] = status;
    sincronizar();
  }

  function fail(reason) {
    if (boot.revealed) return;
    boot.error = true; clearTimeout(timer); boot.states[reason] = 'error';
    if (iniciado) document.documentElement.dataset.loadState = 'error';
    sincronizar();
  }

  function continuarLeve() {
    if (boot.revealed) return;
    boot.bypassed = true; boot.revealed = true; clearTimeout(timer);
    const html = document.documentElement;
    html.classList.remove('fc-loading'); html.dataset.loadState = 'light';
    mudarTela({ oculto: true });
    const view = raiz?.querySelector('#globo'); if (view) view.dataset.renderer = 'fallback';
    const explore = raiz?.querySelector('[data-explore-globe]'); if (explore) explore.disabled = true;
    emitir('fc:globe-unavailable');
    emitir('fc:load-bypass');
    emitir('fc:preview-visible');
  }

  function iniciar(novaRaiz) {
    raiz = novaRaiz; iniciado = true;
    // O React assumiu a página: desliga o plano B do script inline (carga direta).
    window.__fcCarregamento?.();
    const html = document.documentElement;
    let abortado = false, imagem = null;
    const aoIndisponivel = () => fail('scene');
    canal.addEventListener('fc:globe-unavailable', aoIndisponivel);

    if (lerDecisao()) {
      boot.revealed = true;
      html.classList.add('fc-loaded-before'); html.dataset.loadState = 'ready';
    } else if (!boot.revealed) {
      html.classList.add('fc-loading'); html.dataset.loadState = boot.error ? 'error' : 'loading';
      timer = setTimeout(() => { if (!boot.revealed) fail('timeout'); }, 45000);
      // A imagem precisa estar decodificada; navegadores sem decode usam o load.
      imagem = new Image();
      imagem.onload = () => Promise.resolve().then(() => (typeof imagem.decode === 'function' ? imagem.decode() : undefined))
        .then(() => { if (!abortado) report('images'); }, () => { if (!abortado) fail('images'); });
      imagem.onerror = () => { if (!abortado) fail('images'); };
      imagem.src = asset('/imagens/logoFlash.webp');
      // No Next o CSS da rota já está aplicado quando a página monta (carga direta ou navegação).
      report('styles');
      Promise.resolve(document.fonts?.ready).then(() => { if (!abortado) report('fonts'); }, () => { if (!abortado) fail('fonts'); });
    } else {
      // Remontagem depois da revelação (Strict Mode, recarga do código no dev).
      html.dataset.loadState = boot.bypassed ? 'light' : 'ready';
      if (tela.saindo && !tela.oculto) mudarTela({ oculto: true });
    }
    sincronizar();

    return () => {
      abortado = true; iniciado = false; raiz = null;
      if (imagem) { imagem.onload = null; imagem.onerror = null; }
      clearTimeout(timer); clearTimeout(timerSaida);
      canal.removeEventListener('fc:globe-unavailable', aoIndisponivel);
      // Nada da home pode sobrar no <html>: fc-loading deixaria a próxima tela invisível.
      html.classList.remove('fc-loading', 'fc-loaded-before');
      delete html.dataset.loadState;
    };
  }

  // Lida uma vez por montagem, no navegador: depois da revelação a chave passa a existir, mas a
  // tela desta montagem continua no DOM até terminar de sair.
  function lerDecisao() {
    if (jaCarregado === undefined) jaCarregado = lerCarregado();
    return jaCarregado;
  }

  return {
    jaCarregado: lerDecisao,
    tela: () => tela,
    telaInicial: () => TELA_INICIAL,
    assinar(ouvinte) { ouvintes.add(ouvinte); return () => ouvintes.delete(ouvinte); },
    iniciar,
    report,
    fail,
    continuarLeve,
    get bypassed() { return boot.bypassed; },
    get revealed() { return boot.revealed; },
  };
}
