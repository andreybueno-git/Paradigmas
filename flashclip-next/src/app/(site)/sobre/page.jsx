// =========================
// PÁGINA /sobre/
// =========================
//
// Porte de html/sobre.html. Página 100% estática: é um Server Component e sai inteira no HTML
// exportado (cabeçalho, blocos institucionais, chamada final e rodapé), sem JS próprio. Só as
// partes do cabeçalho que precisam do navegador (pisca-pisca, usuário, menu do celular) são client.
//
// Atenção: o <main> tem a classe "sobre" e o CSS da página estiliza `.sobre` (e `.sobre > *`), não
// `main`. O wrapper data-fc-page faz o papel do <body> original: o CSS gerado da página só vale lá
// dentro (inclusive o reset `* { margin:0; padding:0 }` do sobre.css). Os elementos ficam na mesma
// ordem do original (header, main, footer como filhos diretos).
import '@/estilos/paginas/sobre.css';
import Cabecalho from '@/componentes/Cabecalho';
import Rodape from '@/componentes/Rodape';
import BlocosSobre from '@/componentes/paginas/sobre/BlocosSobre';
import ChamadaSobre from '@/componentes/paginas/sobre/ChamadaSobre';

export const metadata = {
  title: 'Sobre | FlashClip',
};

export default function PaginaSobre() {
  return (
    <div data-fc-page="sobre" style={{ display: 'contents' }}>
      <Cabecalho pagina="sobre" />

      {/* CONTEÚDO */}
      <main className="sobre">
        {/* INTRO */}
        <section className="sobre-intro">
          <h1>SOBRE O FLASHCLIP</h1>

          <p>Conectando estudantes ao mundo da programação</p>
        </section>

        <BlocosSobre />

        {/* CTA */}
        <ChamadaSobre />
      </main>

      <Rodape pagina="sobre" />
    </div>
  );
}
