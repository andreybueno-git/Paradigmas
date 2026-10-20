'use client';
// =========================
// ROLAGEM AO TROCAR DE PÁGINA
// =========================
//
// Troca de rota começa no topo, como cada tela nova do site original. O Next só rola sozinho se o
// primeiro nó da página tiver caixa (getClientRects() do Fragment); o wrapper data-fc-page é
// display:contents, então a página nova abria na altura da anterior. Ficam de fora:
// - voltar/avançar (popstate): o navegador devolve a rolagem que a página tinha;
// - links com #âncora (ex.: /#cursos): o Next rola até o elemento.
// Link para a própria página (a rota não muda) fica com o <LinkPagina/>.
//
// Fica antes das páginas no layout: os efeitos de layout rodam na ordem da árvore, então a página
// nova já monta com a rolagem no topo, como num documento recém-aberto.
//
import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function RolagemDeRota() {
  const caminho = usePathname();
  const anterior = useRef(caminho);
  const destinoHistorico = useRef(null);

  // O popstate chega antes da rota nova: marca o destino para não desfazer a posição que o
  // navegador restaura ao voltar/avançar.
  useEffect(() => {
    const marcar = () => {
      destinoHistorico.current = location.pathname;
    };

    window.addEventListener('popstate', marcar);
    return () => window.removeEventListener('popstate', marcar);
  }, []);

  useLayoutEffect(() => {
    if (anterior.current === caminho) return;

    anterior.current = caminho;

    const peloHistorico = destinoHistorico.current === location.pathname;
    destinoHistorico.current = null;

    if (peloHistorico || location.hash) return;

    // 'instant' passa por cima do scroll-behavior:smooth das páginas (como no entrada.js original).
    // Navegador que não conhece 'instant' lança TypeError: aí vai o scrollTo simples.
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [caminho]);

  return null;
}
