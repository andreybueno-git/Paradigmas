'use client';
// =========================
// LINK PARA UMA PÁGINA DO SITE
// =========================
//
// <Link> do Next com dois ajustes de paridade, usado no cabeçalho (desktop e celular) e no rodapé:
//
// - Sem prefetch ao carregar. O <Link> padrão busca todas as rotas do cabeçalho assim que ele
//   aparece (dezenas de pedidos e tarefas longas no primeiro segundo, que o original não tinha).
//   Aqui a rota só é buscada quando há intenção de clicar (mouse em cima, toque ou foco), e o
//   clique continua quase imediato.
// - Link para a própria página (ex.: "FAQ" no rodapé do FAQ). No original o clique carregava a
//   página de novo e ela começava no topo; no Next a rota não muda e nada rola. Aqui rola para o
//   topo. O resto do estado da página (acordeões abertos, filtro) continua como estava.
//
// Aceita as mesmas props do <Link> (href, className, onClick...).
//
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// "/x" e "/x/" são a mesma página (trailingSlash).
const normalizar = caminho => (caminho.endsWith('/') ? caminho : caminho + '/');

function mesmaPagina(link) {
  const destino = new URL(link.href, location.href);

  return (
    !destino.hash &&
    destino.origin === location.origin &&
    destino.search === location.search &&
    normalizar(destino.pathname) === normalizar(location.pathname)
  );
}

export default function LinkPagina({ href, onClick, onMouseEnter, onTouchStart, onFocus, children, ...resto }) {
  const router = useRouter();

  // O Next guarda o que já buscou: passar o mouse de novo não repete o pedido.
  const preparar = () => router.prefetch(href);

  const clicar = evento => {
    onClick?.(evento);

    // Ctrl/Cmd/Shift/Alt ou botão do meio abrem em outra aba/janela: a página atual não mexe.
    if (
      evento.defaultPrevented ||
      evento.button !== 0 ||
      evento.metaKey ||
      evento.ctrlKey ||
      evento.shiftKey ||
      evento.altKey
    ) {
      return;
    }

    if (mesmaPagina(evento.currentTarget)) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  return (
    <Link
      href={href}
      prefetch={false}
      onClick={clicar}
      onMouseEnter={evento => {
        onMouseEnter?.(evento);
        preparar();
      }}
      onTouchStart={evento => {
        onTouchStart?.(evento);
        preparar();
      }}
      onFocus={evento => {
        onFocus?.(evento);
        preparar();
      }}
      {...resto}
    >
      {children}
    </Link>
  );
}
