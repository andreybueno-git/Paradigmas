// =========================
// PÁGINA /instrutores/
// =========================
//
// Porte de html/instrutores.html + js/instrutores.js. É um Server Component: o HTML estático já
// sai com o cabeçalho, a introdução, a chamada final, o rodapé e a lista em
// "Carregando instrutores..." (spinner). Só a lista (ListaInstrutores) busca os dados no navegador.
//
// O wrapper data-fc-page faz o papel do <body> original: o CSS gerado da página só vale lá dentro.
// Os elementos ficam na mesma ordem do original (header, main, footer como filhos diretos).
import '@/estilos/paginas/instrutores.css';
import Cabecalho from '@/componentes/Cabecalho';
import Rodape from '@/componentes/Rodape';
import ListaInstrutores from '@/componentes/paginas/instrutores/ListaInstrutores';
import ChamadaInstrutores from '@/componentes/paginas/instrutores/ChamadaInstrutores';

export const metadata = {
  title: 'Instrutores | FlashClip',
};

export default function PaginaInstrutores() {
  return (
    <div data-fc-page="instrutores" style={{ display: 'contents' }}>
      <Cabecalho pagina="instrutores" />

      <main>
        {/* INTRO */}
        <section className="instrutores-intro">
          <h1>Nossos Instrutores</h1>

          <p>
            Conheça os especialistas que irão compartilhar seus conhecimentos
            durante o evento.
          </p>
        </section>

        {/* INSTRUTORES */}
        <section className="instrutores">
          <ListaInstrutores />
        </section>

        {/* CTA */}
        <ChamadaInstrutores />
      </main>

      <Rodape pagina="instrutores" />
    </div>
  );
}
