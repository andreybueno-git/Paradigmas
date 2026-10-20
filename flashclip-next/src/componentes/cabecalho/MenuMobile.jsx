'use client';
// =========================
// MENU RESPONSIVO
// =========================
//
// Botão ☰ e painel do celular (até 1100px, só CSS). Fecha ao clicar num link do painel, ao
// clicar fora dele e com Esc, como no js/cabecalho.js. Os dois ficam lado a lado no <header>.
// Os links usam <LinkPagina/>, como os do desktop: o painel fechado continua no layout (só
// visibility:hidden), e o <Link> padrão buscaria todas as rotas assim que a página carrega.
//
import { useEffect, useRef, useState } from 'react';
import LinkPagina from '@/componentes/paginas/LinkPagina';
import { LINKS, ROTA_INSCRICOES } from './links';
import { UsuarioMobile } from './Usuario';

export default function MenuMobile({ pagina }) {
  const [aberto, setAberto] = useState(false);
  const botaoMenu = useRef(null);
  const menuMobile = useRef(null);

  const fecharMenu = () => setAberto(false);

  // =========================
  // FECHAR AO CLICAR FORA / COM ESC
  // =========================
  //
  // Só escuta o documento enquanto o painel está aberto.
  //

  useEffect(() => {
    if (!aberto) return;

    const clicar = evento => {
      if (!menuMobile.current?.contains(evento.target) && !botaoMenu.current?.contains(evento.target)) {
        setAberto(false);
      }
    };

    const tecla = evento => {
      if (evento.key === 'Escape') setAberto(false);
    };

    document.addEventListener('click', clicar);
    document.addEventListener('keydown', tecla);

    return () => {
      document.removeEventListener('click', clicar);
      document.removeEventListener('keydown', tecla);
    };
  }, [aberto]);

  return (
    <>
      <button
        ref={botaoMenu}
        className="botao-menu"
        id="botaoMenu"
        type="button"
        aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={aberto}
        onClick={() => setAberto(valor => !valor)}
      >
        {aberto ? '✕' : '☰'}
      </button>

      <div ref={menuMobile} className={aberto ? 'menu-mobile aberto' : 'menu-mobile'} id="menuMobile">
        <nav className="menu-links">
          {LINKS.map(link => (
            <LinkPagina
              key={link.pagina}
              href={link.href}
              className={link.pagina === pagina ? 'ativo' : undefined}
              onClick={fecharMenu}
            >
              {link.rotulo}
            </LinkPagina>
          ))}
        </nav>

        <div className="menu-divisor"></div>

        <UsuarioMobile aoTocar={fecharMenu} />

        <LinkPagina href={ROTA_INSCRICOES} className="inscricoes fc-magnetic" onClick={fecharMenu}>
          Inscrições
        </LinkPagina>
      </div>
    </>
  );
}
