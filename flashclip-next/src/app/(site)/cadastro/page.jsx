// =========================
// PÁGINA /cadastro/
// =========================
//
// Porte de html/cadastro.html + js/cadastro.js. É um Server Component: o HTML estático já sai com o
// cabeçalho, o card, o formulário (medidor da senha em "Digite uma senha") e o rodapé. Só o
// formulário (FormCadastro) e a transição de sucesso rodam no navegador.
//
// O wrapper data-fc-page faz o papel do <body> original: o CSS gerado da página só vale lá dentro.
// A ordem é a do original (header, main, footer); a transição de sucesso entra depois do rodapé,
// como o div que o cadastro.js anexava no fim do <body>.
//
// Os links não fazem prefetch: o original não buscava outra página antes do clique, e o prefetch
// pré-carrega o CSS da rota de destino, que fica sem uso aqui (aviso no console do Chrome).
import Link from 'next/link';
import '@/estilos/paginas/cadastro.css';
import { CabecalhoConta } from '@/componentes/Cabecalho';
import { RodapeConta } from '@/componentes/Rodape';
import { ProvedorTransicao } from '@/componentes/conta/cadastro/TransicaoCadastro';
import FormCadastro from '@/componentes/conta/cadastro/FormCadastro';

export const metadata = {
  title: 'Cadastro | FlashClip',
};

export default function PaginaCadastro() {
  return (
    <div data-fc-page="cadastro" style={{ display: 'contents' }}>
      <ProvedorTransicao>
        <CabecalhoConta pagina="cadastro" />

        <main className="cadastro-container">
          <section className="cadastro-card">
            <div className="cadastro-cabecalho">
              <span className="categoria">FLASHCLIP</span>

              <h1>Crie sua conta</h1>

              <p>Faça seu cadastro para participar do evento.</p>
            </div>

            <FormCadastro />

            <div className="login">
              {/* O espaço entre os dois vinha da quebra de linha do HTML original. */}
              <span>Já possui uma conta?</span>{' '}
              <Link href="/login/" prefetch={false}>
                Entrar
              </Link>
            </div>
          </section>
        </main>

        <RodapeConta pagina="cadastro" />
      </ProvedorTransicao>
    </div>
  );
}
