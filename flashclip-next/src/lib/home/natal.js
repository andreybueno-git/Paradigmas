/*
 * Interações do tema natalino da home (porte de js/natal.js). Não altera autenticação nem matrículas.
 *
 *   const destruir = iniciarNatal(raiz);
 *
 * `raiz` é o wrapper [data-fc-page="home"], que faz o papel do <body> original: data-lights,
 * fc-paused, fc-hidden e fc-motion-ready moram nele. A barra de progresso escreve --fc-progress no
 * <header class="navbar"> filho do wrapper. Rodar no useLayoutEffect: as revelações ao rolar
 * escondem as seções antes da primeira pintura, como o script original.
 *
 * O resto de natal.js era código morto na home atual (não existe .fc-ornament-stage/.fc-scene):
 * inclinação por ponteiro, --fc-drift e o observer da hero não foram portados.
 * destruir() desfaz tudo e devolve a página ao estado inicial (luzes acesas, movimento ligado).
 */
const ALVOS_REVELACAO = '.fc-home .sobre-conteudo, .fc-home .card-motivo, .fc-home .titulo-cursos, .fc-closing > div';

export function iniciarNatal(raiz) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const navbar = raiz.querySelector(':scope > .navbar');
  const lightButton = raiz.querySelector('[data-toggle-lights]');
  const motionButton = raiz.querySelector('[data-toggle-motion]');
  let paused = false;
  let scrollFrame = 0;
  let scrollExtent = 0;
  let lastProgress = '';

  function alternarLuzes() {
    const on = raiz.dataset.lights !== 'on';
    raiz.dataset.lights = on ? 'on' : 'off';
    lightButton.setAttribute('aria-pressed', String(on));
    lightButton.querySelector('span:last-child').textContent = on ? 'Apagar luzes' : 'Acender luzes';
  }

  function alternarMovimento() {
    paused = !paused;
    raiz.classList.toggle('fc-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.textContent = paused ? 'Retomar movimento' : 'Pausar movimento';
    updateScroll();
  }

  lightButton?.addEventListener('click', alternarLuzes);
  motionButton?.addEventListener('click', alternarMovimento);

  // Barra dourada de progresso da rolagem no cabeçalho.
  function updateScroll() {
    scrollFrame = 0;
    const position = window.scrollY;
    const progress = (scrollExtent > 0 ? Math.max(0, Math.min(1, position / scrollExtent)) : 0).toFixed(4);
    if (navbar && progress !== lastProgress) {
      navbar.style.setProperty('--fc-progress', progress);
      lastProgress = progress;
    }
  }
  function scheduleScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }
  function measureScroll() {
    scrollExtent = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    scheduleScroll();
  }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', measureScroll, { passive: true });
  // O tamanho do documento muda quando os cursos chegam; o body só é observado (nada é escrito nele).
  const layoutObserver = 'ResizeObserver' in window ? new ResizeObserver(measureScroll) : null;
  layoutObserver?.observe(document.body);
  // Carga direta: mede de novo quando as imagens terminarem; numa navegação a página já carregou.
  const esperandoLoad = document.readyState !== 'complete';
  if (esperandoLoad) window.addEventListener('load', measureScroll, { once: true });
  measureScroll();

  // Revelação das seções ao rolar.
  const revealElements = [...raiz.querySelectorAll(ALVOS_REVELACAO)];
  let observer = null;
  if ('IntersectionObserver' in window && !reduced.matches) {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fc-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: .08 });
    raiz.classList.add('fc-motion-ready');
    revealElements.forEach(el => { el.classList.add('fc-reveal'); observer.observe(el); });
  }
  function aoMudarMovimentoReduzido() {
    if (reduced.matches) raiz.classList.remove('fc-motion-ready');
    updateScroll();
  }
  reduced.addEventListener('change', aoMudarMovimentoReduzido);
  function aoMudarVisibilidade() {
    raiz.classList.toggle('fc-hidden', document.hidden);
  }
  document.addEventListener('visibilitychange', aoMudarVisibilidade);

  return function destruir() {
    lightButton?.removeEventListener('click', alternarLuzes);
    motionButton?.removeEventListener('click', alternarMovimento);
    window.removeEventListener('scroll', scheduleScroll);
    window.removeEventListener('resize', measureScroll);
    if (esperandoLoad) window.removeEventListener('load', measureScroll);
    layoutObserver?.disconnect();
    cancelAnimationFrame(scrollFrame); scrollFrame = 0;
    observer?.disconnect();
    reduced.removeEventListener('change', aoMudarMovimentoReduzido);
    document.removeEventListener('visibilitychange', aoMudarVisibilidade);
    navbar?.style.removeProperty('--fc-progress');
    // Estado inicial de novo (o Strict Mode do dev monta a página duas vezes sobre o mesmo DOM).
    revealElements.forEach(el => el.classList.remove('fc-reveal', 'fc-visible'));
    raiz.classList.remove('fc-paused', 'fc-hidden', 'fc-motion-ready');
    raiz.dataset.lights = 'on';
    if (lightButton) {
      lightButton.setAttribute('aria-pressed', 'true');
      const rotulo = lightButton.querySelector('span:last-child'); if (rotulo) rotulo.textContent = 'Apagar luzes';
    }
    if (motionButton) {
      motionButton.setAttribute('aria-pressed', 'false');
      motionButton.textContent = 'Pausar movimento';
    }
  };
}
