// Home (porte de index.html). Componente de servidor: o HTML estático já sai com o wrapper da
// página, a tela de carregamento, o cabeçalho, as seções, o rodapé, a abertura e o diálogo do globo.
// O <HomeRaiz> (cliente) é o wrapper [data-fc-page="home"] e liga os módulos de src/lib/home
// (carregamento, tema natalino, abertura e globo 3D) ao ciclo de vida do React.
//
// Os filhos diretos do wrapper fazem o papel dos filhos do <body> original: o link de pular, o
// cabeçalho, o main e o rodapé ficam `inert` durante a abertura, e a tela de carregamento esconde
// todos eles (CSS do pacote da home).
import '@/estilos/paginas/home.css';
import Cabecalho from '@/componentes/Cabecalho';
import Rodape from '@/componentes/Rodape';
import HomeRaiz from '@/componentes/home/HomeRaiz';
import Hero from '@/componentes/home/Hero';
import { AvisoRolagem, Sobre, Parceiros, Motivos, Encerramento } from '@/componentes/home/Secoes';
import SecaoCursos from '@/componentes/home/SecaoCursos';
import Abertura from '@/componentes/home/Abertura';

// Sem JavaScript a tela de carregamento nunca sairia: o original a escondia com este <noscript>.
const SEM_SCRIPT = '<style>#fc-loading{display:none!important}</style>';

export default function Home() {
  return (
    <HomeRaiz>
      <noscript dangerouslySetInnerHTML={{ __html: SEM_SCRIPT }} />

      <a className="fc-skip" href="#conteudo">Pular para o conteúdo</a>

      <Cabecalho pagina="home" />

      <main className="fc-home" id="conteudo">
        <Hero />
        <AvisoRolagem />
        <Sobre />
        <Parceiros />
        <Motivos />
        <SecaoCursos />
        <Encerramento />
      </main>

      <Rodape pagina="home" />

      <Abertura />

      <dialog className="fc-globe-dialog" aria-label="Explore o globo de neve" aria-modal="true"></dialog>
    </HomeRaiz>
  );
}
