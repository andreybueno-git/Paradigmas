// =========================
// PÁGINA /faq/
// =========================
//
// Porte de html/faq.html. Página 100% estática: é um Server Component e sai inteira no HTML
// exportado, sem JS próprio. O acordeão é o <details> nativo (ver PerguntasFaq), que já funciona
// no HTML estático, antes mesmo de o React carregar. Só as partes do cabeçalho que precisam do
// navegador (pisca-pisca, usuário, menu do celular) são client.
//
// Atenção à estrutura, diferente das outras páginas: a intro e a chamada final ficam FORA do
// <main> (section.faq-intro, main.faq e section.cta são irmãos), e o rodapé é a variante do FAQ
// ("© 2026 FlashClip — ULBRA Palmas", com links para Contato e FAQ). O wrapper data-fc-page faz o
// papel do <body> original: o CSS gerado da página só vale lá dentro, com o rodapé.css antes do
// faq.css, na ordem dos <link> originais.
import '@/estilos/paginas/faq.css';
import Cabecalho from '@/componentes/Cabecalho';
import Rodape from '@/componentes/Rodape';
import PerguntasFaq from '@/componentes/paginas/faq/PerguntasFaq';
import ChamadaFaq from '@/componentes/paginas/faq/ChamadaFaq';

export const metadata = {
  title: 'FAQ | FlashClip',
};

export default function PaginaFaq() {
  return (
    <div data-fc-page="faq" style={{ display: 'contents' }}>
      <Cabecalho pagina="faq" />

      {/* INTRO */}
      <section className="faq-intro">
        <h1>Perguntas Frequentes</h1>

        <p>Tire suas dúvidas sobre o FlashClip</p>
      </section>

      {/* PERGUNTAS */}
      <main className="faq">
        <PerguntasFaq />
      </main>

      {/* CTA */}
      <ChamadaFaq />

      {/* RODAPÉ */}
      <Rodape pagina="faq" />
    </div>
  );
}
