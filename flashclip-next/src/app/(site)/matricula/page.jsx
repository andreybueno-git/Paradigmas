// =========================
// PÁGINA /matricula/
// =========================
//
// Porte de html/matricula.html + js/matricula.js. É um Server Component: o HTML estático já sai com o
// cabeçalho, o card e, no lugar do curso, o painel em "Carregando curso..." com o botão
// desabilitado (fallback do <Suspense>). Quem lê o ?id= e fala com o Supabase é
// ConfirmacaoMatricula, no navegador. Esta página não tem rodapé, como no original.
//
// O wrapper data-fc-page faz o papel do <body> original: o CSS gerado da página só vale lá dentro.
// A transição de sucesso entra depois do main, como o div que o matricula.js anexava no fim do
// <body>.
import { Suspense } from 'react';
import '@/estilos/paginas/matricula.css';
import { CabecalhoConta } from '@/componentes/Cabecalho';
import { ProvedorTransicaoMatricula } from '@/componentes/conta/matricula/TransicaoMatricula';
import ConfirmacaoMatricula from '@/componentes/conta/matricula/ConfirmacaoMatricula';
import PainelMatricula from '@/componentes/conta/matricula/PainelMatricula';

export const metadata = {
  title: 'Confirmar matrícula - FlashClip',
};

export default function PaginaMatricula() {
  return (
    <div data-fc-page="matricula" style={{ display: 'contents' }}>
      <ProvedorTransicaoMatricula>
        <CabecalhoConta pagina="matricula" />

        <main className="pagina-matricula">
          <section className="card-matricula">
            <div className="cabecalho-matricula">
              <span className="categoria-matricula">CONFIRMAR MATRÍCULA</span>

              <h1>Curso selecionado</h1>

              <p>Confira as informações do curso antes de confirmar sua matrícula.</p>
            </div>

            <Suspense fallback={<PainelMatricula />}>
              <ConfirmacaoMatricula />
            </Suspense>
          </section>
        </main>
      </ProvedorTransicaoMatricula>
    </div>
  );
}
