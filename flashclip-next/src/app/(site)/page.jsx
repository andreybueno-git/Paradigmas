// Provisório: a home de verdade é portada na etapa de conversão das páginas.
import '@/estilos/paginas/home.css';

export default function Home() {
  return (
    <div data-fc-page="home" className="natal-theme" data-lights="on" style={{ display: 'contents' }}>
      <header className="navbar"><div className="nav-acoes"><a className="inscricoes fc-magnetic" href="#">Inscrições</a></div></header>
      <main style={{ padding: 40 }}>Base do FlashClip em Next.js</main>
    </div>
  );
}
