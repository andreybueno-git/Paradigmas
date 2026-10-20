// Seções estáticas da home (index.html:271-446), na ordem do original: aviso de rolagem, Sobre,
// Parceiros, Por que participar e o fechamento. Componentes de servidor. A revelação ao rolar
// (.fc-reveal/.fc-visible) é aplicada pelo natal.js, por isso os className daqui não mudam.
import Link from 'next/link';
import LogoParceiro from './LogoParceiro';

export function AvisoRolagem() {
  return (
    <div className="fc-scroll-cue"><span>01 / Um encontro de possibilidades</span><a href="#sobre">Explore o evento ↓</a></div>
  );
}

export function Sobre() {
  return (
    <section className="sobre" id="sobre">
      <div className="sobre-conteudo">
        <span className="sobre-categoria">SOBRE O EVENTO</span>

        <h2>Muito além do código.</h2>

        <p className="sobre-descricao">
          O FlashClip é um evento de tecnologia criado para aproximar
          estudantes, conhecimento e novas ideias. Um espaço para aprender,
          compartilhar experiências e se conectar com outras pessoas da área.
        </p>
      </div>
    </section>
  );
}

export function Parceiros() {
  return (
    <section className="parceiros" id="parceiros">
      <div className="parceiros-titulo">
        <span>APOIO AO EVENTO</span>
        <h2>Nossos Parceiros</h2>
        <p>
          Empresas que apoiam o FlashClip e acreditam no desenvolvimento da
          tecnologia e da educação.
        </p>
      </div>

      <div className="lista-parceiros">
        <a href="https://suainternet.com.br/" target="_blank" rel="noopener noreferrer" className="parceiro">
          <LogoParceiro />
        </a>
      </div>
    </section>
  );
}

// Ícones de traço dos quatro motivos (24×24, stroke), iguais ao original.
function Icone({ children }) {
  return (
    <div className="icone-motivo">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    </div>
  );
}

const MOTIVOS = [
  {
    numero: '01',
    icone: (
      <>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </>
    ),
    titulo: 'Introdução à Programação',
    texto: 'Aprenda os fundamentos e dê seus primeiros passos no código.',
  },
  {
    numero: '02',
    icone: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    titulo: 'Curso Rápido e Focado',
    texto: 'Apenas 3 horas de duração, com conteúdo objetivo e prático.',
  },
  {
    numero: '03',
    icone: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 21v-2a6 6 0 0 1 12 0v2" />
        <path d="M16 4.5a3 3 0 0 1 0 7" />
        <path d="M17 15a5 5 0 0 1 4 5v1" />
      </>
    ),
    titulo: 'Aprendizado Colaborativo',
    texto: 'Aprenda de forma prática e compartilhe conhecimentos com seus colegas.',
  },
  {
    numero: '04',
    icone: (
      <>
        <path d="M12 15l-3.5 2 1-4-3-2.5 4-.3L12 6l1.5 4.2 4 .3-3 2.5 1 4z" />
        <path d="M5 3h14v18l-7-4-7 4z" />
      </>
    ),
    titulo: 'Certificado Digital',
    texto: 'Receba um certificado para adicionar ao seu currículo.',
  },
];

export function Motivos() {
  return (
    <section className="motivos" id="motivos">
      <div className="titulo-motivos">
        <span>FLASHCLIP</span>
        <h2>Por que participar?</h2>
        <p>
          Uma oportunidade para aprender, compartilhar conhecimentos e
          desenvolver novas habilidades.
        </p>
      </div>

      <div className="lista-motivos">
        {MOTIVOS.map(motivo => (
          <article className="card-motivo" key={motivo.numero}>
            <span className="numero-motivo">{motivo.numero}</span>

            <Icone>{motivo.icone}</Icone>

            <h3>{motivo.titulo}</h3>
            <p>{motivo.texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Encerramento() {
  return (
    <section className="fc-closing" aria-labelledby="fc-closing-title">
      <div><p>Novas conexões. Novas possibilidades.</p><h2 id="fc-closing-title">O melhor presente?<br />Um novo começo.</h2></div>
      <Link className="botao-principal" href="/cursos/">Quero fazer parte <span aria-hidden="true">↗</span></Link>
    </section>
  );
}
