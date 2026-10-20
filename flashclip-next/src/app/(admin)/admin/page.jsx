// =========================
// PÁGINA /admin/
// =========================
//
// Porte de admin/admin.html + admin/admin.js (Dashboard Administrativo). É um Server Component: o
// HTML estático já sai com o cabeçalho, "Verificando permissões...", o resumo escondido, a seção
// de matrículas e o modal fechado. O painel (PainelAdmin) e o botão de voltar rodam no navegador.
//
// Fica no layout raiz próprio do admin (src/app/(admin)/layout.jsx): sem música, sem barra de
// controles, sem cabeçalho nem rodapé do site, como o original. Entrar e sair daqui recarrega a
// página. O wrapper data-fc-page faz o papel do <body> original: o CSS gerado só vale lá dentro
// (e pinta o <body> de verdade com o fundo #101b2b).
//
import '@/estilos/paginas/admin.css';
import BotaoVoltar from '@/componentes/admin/BotaoVoltar';
import PainelAdmin from '@/componentes/admin/PainelAdmin';

export const metadata = {
  title: 'Dashboard Administrativo',
  // Área restrita: fora dos buscadores (não muda nada na tela).
  robots: { index: false, follow: false },
};

export default function PaginaAdmin() {
  return (
    <div data-fc-page="admin" style={{ display: 'contents' }}>
      <header className="cabecalho">
        <div>
          <h1>Dashboard Administrativo</h1>
          <p>Visão geral das inscrições do FlashClip</p>
        </div>

        <BotaoVoltar />
      </header>

      <PainelAdmin />
    </div>
  );
}
