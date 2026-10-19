// Layout raiz próprio do painel administrativo: sem música, sem barra de controles.
// Ir do site para o admin (e voltar) recarrega a página, como hoje com ../admin/admin.html.
export const metadata = {
  title: 'Painel Administrativo | FlashClip',
};

export default function LayoutAdmin({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
