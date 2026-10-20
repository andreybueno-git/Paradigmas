// =========================
// PÁGINA /contato/
// =========================
//
// Porte de html/contato.html ("Fale Conosco"). Página 100% estática: é um Server Component e sai
// inteira no HTML exportado (cabeçalho, informações de contato, mapa e rodapé), sem JS próprio.
// O original não tem formulário: o contato é feito pelos links mailto:/tel: e o mapa é um iframe.
// Só as partes do cabeçalho que precisam do navegador (pisca-pisca, usuário, menu do celular) são
// client.
//
// O wrapper data-fc-page faz o papel do <body> original: o CSS gerado da página só vale lá dentro.
// Os elementos ficam na mesma ordem do original (header, main, footer como filhos diretos).
import '@/estilos/paginas/contato.css';
import Cabecalho from '@/componentes/Cabecalho';
import Rodape from '@/componentes/Rodape';
import InformacoesContato from '@/componentes/paginas/contato/InformacoesContato';
import MapaContato from '@/componentes/paginas/contato/MapaContato';

export const metadata = {
  title: 'Fale Conosco | FlashClip',
};

export default function PaginaContato() {
  return (
    <div data-fc-page="contato" style={{ display: 'contents' }}>
      <Cabecalho pagina="contato" />

      <main>
        {/* INTRO */}
        <section className="contato-intro">
          <h1>Entre em Contato</h1>

          <p>Estamos à disposição para esclarecer suas dúvidas</p>
        </section>

        {/* CONTATO */}
        <section className="contato">
          <InformacoesContato />

          {/* MAPA */}
          <MapaContato />
        </section>
      </main>

      <Rodape pagina="contato" />
    </div>
  );
}
