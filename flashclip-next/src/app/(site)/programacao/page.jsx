// =========================
// PÁGINA /programacao/
// =========================
//
// Porte de html/programacao.html. Página 100% estática: é um Server Component e sai inteira no
// HTML exportado (cabeçalho, agenda, informações e rodapé), sem JS próprio. Só as partes do
// cabeçalho que precisam do navegador (pisca-pisca, usuário, menu do celular) são client.
//
// O wrapper data-fc-page faz o papel do <body> original: o CSS gerado da página só vale lá dentro
// (inclusive a margem padrão de 8px do body, que só esta página mantinha). Os elementos ficam na
// mesma ordem do original (header, main, footer como filhos diretos).
import '@/estilos/paginas/programacao.css';
import Cabecalho from '@/componentes/Cabecalho';
import Rodape from '@/componentes/Rodape';
import AgendaProgramacao from '@/componentes/paginas/programacao/AgendaProgramacao';
import InformacoesProgramacao from '@/componentes/paginas/programacao/InformacoesProgramacao';

export const metadata = {
  title: 'Programação | FlashClip',
};

export default function PaginaProgramacao() {
  return (
    <div data-fc-page="programacao" style={{ display: 'contents' }}>
      <Cabecalho pagina="programacao" />

      <main>
        {/* INTRO */}
        <section className="programacao-intro">
          <h1>Programação do Evento</h1>

          <p>Confira a agenda completa do FlashClip</p>
        </section>

        {/* PROGRAMAÇÃO */}
        <AgendaProgramacao />

        {/* INFORMAÇÕES */}
        <InformacoesProgramacao />
      </main>

      <Rodape pagina="programacao" />
    </div>
  );
}
