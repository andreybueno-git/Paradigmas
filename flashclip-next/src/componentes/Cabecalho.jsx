// =========================
// CABEÇALHOS
// =========================
//
// Renderizados por cada página, dentro do seu wrapper data-fc-page (o CSS do cabeçalho só vale
// lá dentro). O <header> sai como filho direto do wrapper, como era do <body> no original.
//
//   <Cabecalho pagina="programacao" />
//     Cabeçalho do site: home, cursos, programacao, instrutores, patrocinadores, contato, sobre, faq.
//     `pagina` marca o link ativo (desktop e celular). Na home o visual natalino vem da classe
//     natal-theme do wrapper; `ref` (opcional) recebe o <header>, para a barra de progresso da
//     home escrever --fc-progress nele. O link "Pular para o conteúdo" da home fica com a página.
//
//   <CabecalhoConta pagina="login" />
//     Logo + "Voltar ao evento" de login, cadastro e matricula (navbar-login/-cadastro/-matricula).
//     Minhas inscrições tem um cabeçalho próprio (navbar-inscricoes), que fica com a página.
//
// Os links usam <LinkPagina/>: a rota só é buscada quando há intenção de clicar (o original não
// buscava nada depois de carregar) e o link para a própria página volta ao topo, como a recarga.
//
import LinkPagina from '@/componentes/paginas/LinkPagina';
import { asset } from '@/lib/caminho';
import { LINKS, ROTA_INSCRICOES } from '@/componentes/cabecalho/links';
import PiscaPisca from '@/componentes/cabecalho/PiscaPisca';
import { UsuarioDesktop } from '@/componentes/cabecalho/Usuario';
import MenuMobile from '@/componentes/cabecalho/MenuMobile';

export default function Cabecalho({ pagina, ref }) {
  return (
    <header className="navbar" ref={ref}>
      <PiscaPisca />

      <LinkPagina href="/" className="logo">
        <img src={asset('/imagens/logoFlash.webp')} alt="FlashClip" />
      </LinkPagina>

      <nav className="nav-links">
        {LINKS.map(link => (
          <LinkPagina key={link.pagina} href={link.href} className={link.pagina === pagina ? 'ativo' : undefined}>
            {link.rotulo}
          </LinkPagina>
        ))}
      </nav>

      <div className="nav-acoes">
        <UsuarioDesktop />

        <LinkPagina href={ROTA_INSCRICOES} className="inscricoes fc-magnetic">
          Inscrições
        </LinkPagina>
      </div>

      <MenuMobile pagina={pagina} />
    </header>
  );
}

export function CabecalhoConta({ pagina }) {
  return (
    <header className={'navbar navbar-' + pagina}>
      <LinkPagina href="/" className="logo">
        <img src={asset('/imagens/logoFlash.webp')} alt="FlashClip" />
      </LinkPagina>

      <LinkPagina href="/" className="voltar voltar-evento">
        <span className="voltar-seta" aria-hidden="true">←</span>
        <span>Voltar ao evento</span>
      </LinkPagina>
    </header>
  );
}
