// =========================
// PÁGINA /patrocinadores/
// =========================
//
// Porte de html/patrocinadores.html + js/patrocinadores.js. É um Server Component: o HTML
// estático já sai completo (cabeçalho, cards, agradecimento, chamada final e rodapé). Só os
// filtros por categoria (ListaPatrocinadores) rodam no navegador.
//
// O wrapper data-fc-page faz o papel do <body> original: o CSS gerado da página só vale lá dentro.
// Os elementos ficam na mesma ordem do original (header, main, footer como filhos diretos).
// O theme-color #030508 do original já vem do layout do site (vale para todas as telas).
import '@/estilos/paginas/patrocinadores.css';
import Cabecalho from '@/componentes/Cabecalho';
import Rodape from '@/componentes/Rodape';
import ListaPatrocinadores from '@/componentes/paginas/patrocinadores/ListaPatrocinadores';
import AgradecimentoPatrocinadores from '@/componentes/paginas/patrocinadores/AgradecimentoPatrocinadores';
import ChamadaPatrocinadores from '@/componentes/paginas/patrocinadores/ChamadaPatrocinadores';

export const metadata = {
  title: 'Patrocinadores | FlashClip',
};

export default function PaginaPatrocinadores() {
  return (
    <div data-fc-page="patrocinadores" style={{ display: 'contents' }}>
      <Cabecalho pagina="patrocinadores" />

      <main>
        <section className="patrocinadores-intro">
          <h1>Nossos Patrocinadores</h1>
          <p>Conheça as empresas que tornam o FlashClip possível.</p>
        </section>

        <section className="patrocinadores" aria-label="Patrocinadores do FlashClip">
          <ListaPatrocinadores />
        </section>

        <AgradecimentoPatrocinadores />

        <ChamadaPatrocinadores />
      </main>

      <Rodape pagina="patrocinadores" />
    </div>
  );
}
