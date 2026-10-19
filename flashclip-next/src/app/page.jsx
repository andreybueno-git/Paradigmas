// Provisório: a home de verdade é portada na etapa de conversão das páginas.
import '@/estilos/escopo/cabecalho.css';
import '@/estilos/escopo/experiencia.css';

export default function Home() {
  return (
    <div data-estilos="cabecalho experiencia">
      <header className="navbar"><div className="nav-acoes"><a className="inscricoes" href="#">Inscrições</a></div></header>
      <main style={{ padding: 40, color: '#fff' }}>Base do FlashClip em Next.js</main>
    </div>
  );
}
