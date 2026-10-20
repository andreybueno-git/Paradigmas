// =========================
// PÁGINA /login/
// =========================
//
// Porte de html/login.html + js/login.js. É um Server Component: o HTML estático já sai com o
// cabeçalho, o card, o formulário e o rodapé. Só o formulário (FormLogin) e a transição de
// sucesso rodam no navegador.
//
// O wrapper data-fc-page faz o papel do <body> original: o CSS gerado da página só vale lá dentro.
// A ordem é a do original (header, main, footer); a transição de sucesso entra depois do rodapé,
// como o div que o login.js anexava no fim do <body>.
//
// Os links não fazem prefetch: o original não buscava outra página antes do clique, e o prefetch
// pré-carrega o CSS da rota de destino, que fica sem uso aqui (aviso no console do Chrome).
import Link from 'next/link';
import '@/estilos/paginas/login.css';
import { CabecalhoConta } from '@/componentes/Cabecalho';
import { RodapeConta } from '@/componentes/Rodape';
import { ProvedorTransicao } from '@/componentes/conta/cadastro/TransicaoCadastro';
import FormLogin from '@/componentes/conta/login/FormLogin';

export const metadata = {
  title: 'Login | FlashClip',
};

export default function PaginaLogin() {
  return (
    <div data-fc-page="login" style={{ display: 'contents' }}>
      <ProvedorTransicao>
        <CabecalhoConta pagina="login" />

        <main className="login-container">
          <section className="login-card">
            <div className="login-cabecalho">
              <span className="categoria">FLASHCLIP</span>

              <h1>Bem-vindo de volta</h1>

              <p>Entre na sua conta para continuar.</p>
            </div>

            <FormLogin />

            <div className="cadastro">
              {/* O espaço entre os dois vinha da quebra de linha do HTML original. */}
              <span>Ainda não possui uma conta?</span>{' '}
              <Link href="/cadastro/" prefetch={false}>
                Criar conta
              </Link>
            </div>
          </section>
        </main>

        <RodapeConta pagina="login" />
      </ProvedorTransicao>
    </div>
  );
}
