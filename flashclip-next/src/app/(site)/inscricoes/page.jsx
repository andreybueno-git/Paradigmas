// =========================
// PÁGINA /inscricoes/
// =========================
//
// Porte de html/inscricoes.html + js/inscricoes.js ("Minhas inscrições"). É um Server Component: o
// HTML estático já sai com o cabeçalho próprio da página, o título, a lista em "Carregando suas
// inscrições...", o rodapé e os créditos. Só a lista (ListaInscricoes) roda no navegador.
//
// O wrapper data-fc-page faz o papel do <body> original: o CSS gerado da página só vale lá dentro.
// A cor da barra do navegador é a do site inteiro (no layout), como era com a moldura.
//
// Os links não fazem prefetch: o original não buscava a home antes do clique, e o prefetch dela
// pré-carrega o CSS da home e a logo do patrocinador, que ficam sem uso aqui (aviso no console).
import Link from 'next/link';
import '@/estilos/paginas/inscricoes.css';
import { asset } from '@/lib/caminho';
import ListaInscricoes from '@/componentes/conta/inscricoes/ListaInscricoes';

export const metadata = {
  title: 'Minhas inscrições | FlashClip',
};

export default function PaginaInscricoes() {
  return (
    <div data-fc-page="inscricoes" style={{ display: 'contents' }}>
      {/* HEADER */}
      <header className="navbar-inscricoes">
        <div className="navbar-conteudo">
          <Link href="/" prefetch={false} className="logo-inscricoes">
            <img src={asset('/imagens/logoFlash.webp')} alt="FlashClip" />
          </Link>

          <Link href="/" prefetch={false} className="botao-voltar" aria-label="Voltar ao evento">
            <span aria-hidden="true">←</span>
            <span>Voltar</span>
          </Link>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="pagina-inscricoes">
        <section className="cabecalho-inscricoes">
          <div className="titulo-inscricoes">
            <span className="categoria-inscricoes">ÁREA DO PARTICIPANTE</span>

            <h1>
              <span className="icone-titulo" aria-hidden="true">
                ✦
              </span>
              Minhas inscrições
            </h1>

            <p>Confira os cursos em que você está matriculado.</p>
          </div>
        </section>

        {/* OS CARDS SÃO MONTADOS NO NAVEGADOR */}
        <ListaInscricoes />

        <footer className="footer-inscricoes">
          <span className="linha-decorativa" aria-hidden="true"></span>

          <p>
            <span aria-hidden="true">✦</span>
            Seu futuro começa com um clique.
            <span aria-hidden="true">✦</span>
          </p>

          <span className="linha-decorativa" aria-hidden="true"></span>
        </footer>
      </main>

      <div className="creditos-inscricoes">
        <span>© 2026/2 FlashClip. Todos os direitos reservados.</span>
        <span className="edicao-natal">
          <span aria-hidden="true">✧</span>
          Edição especial de Natal
        </span>
      </div>
    </div>
  );
}
