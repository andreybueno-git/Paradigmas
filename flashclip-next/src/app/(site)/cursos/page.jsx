// =========================
// PÁGINA /cursos/
// =========================
//
// Porte de html/cursos.html + js/cursos.js. É um Server Component: o HTML estático já sai com o
// cabeçalho, as seções fixas, o rodapé e a lista em "Carregando cursos..." (spinner). Só a lista
// (ListaCursos, com os cards e os notebooks 3D) roda no navegador.
//
// O wrapper data-fc-page faz o papel do <body> original: o CSS gerado da página só vale lá dentro.
// Os elementos ficam na mesma ordem do original (header, main, footer como filhos diretos).
import '@/estilos/paginas/cursos.css';
import Cabecalho from '@/componentes/Cabecalho';
import Rodape from '@/componentes/Rodape';
import ListaCursos from '@/componentes/cursos/ListaCursos';
import InformacoesCursos from '@/componentes/paginas/cursos/InformacoesCursos';
import ChamadaCursos from '@/componentes/paginas/cursos/ChamadaCursos';

export const metadata = {
  title: 'Cursos | FlashClip',
};

export default function PaginaCursos() {
  return (
    <div data-fc-page="cursos" style={{ display: 'contents' }}>
      <Cabecalho pagina="cursos" />

      <main>
        {/* INTRO */}
        <section className="cursos-intro">
          <h1>Cursos</h1>

          <p>Escolha um curso, aprenda algo novo e participe do FlashClip.</p>
        </section>

        {/* CURSOS */}
        <section className="cursos">
          <div className="titulo-cursos">
            <div>
              <span> PROGRAMAÇÃO </span>

              <h2>Cursos disponíveis</h2>
            </div>

            <p>Confira os cursos disponíveis para inscrição no evento.</p>
          </div>

          {/* Todos os cursos (o original chamava carregarCursos com limite null). */}
          <ListaCursos variante="cursos" />
        </section>

        <InformacoesCursos />

        <ChamadaCursos />
      </main>

      <Rodape pagina="cursos" />
    </div>
  );
}
