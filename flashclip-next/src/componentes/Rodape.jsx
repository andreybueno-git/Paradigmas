// =========================
// RODAPÉS
// =========================
//
// Renderizados por cada página, dentro do seu wrapper data-fc-page, logo depois do conteúdo.
//
//   <Rodape pagina="sobre" />
//     Rodapé do site, com as diferenças que cada página original tinha:
//     - e-mail contato@flashclip.com: home, cursos, instrutores, sobre;
//     - e-mail contato.flashclip@gmail.com: programacao, patrocinadores, contato;
//     - home: Instagram e Facebook com target="_blank" (como no original);
//     - faq: "© 2026 FlashClip — ULBRA Palmas" com links para Contato e FAQ. Os dois usam
//       <LinkPagina/>, como o cabeçalho: "FAQ" na própria página volta ao topo (o original
//       recarregava a página) e as rotas só são buscadas quando há intenção de clicar.
//
//   <RodapeConta pagina="login" />
//     Rodapé natalino de login e cadastro (footer-login / footer-cadastro).
//     A matrícula não tem rodapé; o de Minhas inscrições é próprio e fica com a página.
//
import LinkPagina from '@/componentes/paginas/LinkPagina';

const EMAIL_FLASHCLIP = 'mailto:contato@flashclip.com';
const EMAIL_GMAIL = 'mailto:contato.flashclip@gmail.com';

const EMAIL_POR_PAGINA = {
  programacao: EMAIL_GMAIL,
  patrocinadores: EMAIL_GMAIL,
  contato: EMAIL_GMAIL,
};

export default function Rodape({ pagina }) {
  if (pagina === 'faq') {
    return (
      <footer>
        <div className="footer-conteudo">
          <p>© 2026 FlashClip — ULBRA Palmas</p>

          <div className="contatos">
            <LinkPagina href="/contato/">Contato</LinkPagina>

            <LinkPagina href="/faq/">FAQ</LinkPagina>
          </div>
        </div>
      </footer>
    );
  }

  const alvo = pagina === 'home' ? '_blank' : undefined;

  return (
    <footer>
      <div className="footer-conteudo">
        <p>© 2026/2 FlashClip. Todos os direitos reservados.</p>

        <div className="contatos">
          <a href="#" target={alvo}>Instagram</a>

          <a href="#" target={alvo}>Facebook</a>

          <a href={EMAIL_POR_PAGINA[pagina] || EMAIL_FLASHCLIP}>E-mail</a>
        </div>
      </div>
    </footer>
  );
}

export function RodapeConta({ pagina }) {
  return (
    <footer className={'footer-' + pagina}>
      <div className="footer-frase">
        <span className="footer-ornamento" aria-hidden="true">✦</span>

        <p>Transformando momentos em histórias.</p>

        <span className="footer-ornamento" aria-hidden="true">✦</span>
      </div>

      <div className="footer-base">
        <span>© 2026/2 FlashClip. Todos os direitos reservados.</span>

        <span className="footer-natal">
          <span aria-hidden="true">✧</span> Edição especial de Natal
        </span>
      </div>
    </footer>
  );
}
