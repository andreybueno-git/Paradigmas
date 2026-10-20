// =========================
// AGENDA DO EVENTO
// =========================
//
// Linha do tempo da página /programacao/ (html/programacao.html), 100% estática.
// O CSS decora cada card pela posição (.agenda > .evento:nth-of-type(1..4)) e zera a margem do
// último (.evento:last-child): os quatro <article> continuam irmãos diretos de .agenda, nessa
// ordem, e .linha-agenda continua sendo um <div> (não conta no nth-of-type).

// Atributos comuns de todos os ícones (iguais aos do original, sem aria-hidden).
const SVG = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.7',
};

// =========================
// ÍCONES DOS MARCADORES
// =========================

function IconeTerminal() {
  // O único com pontas e cantos arredondados.
  return (
    <svg {...SVG} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />

      <path d="m8 10 2.5 2L8 14" />

      <path d="M13 14h3" />
    </svg>
  );
}

function IconePausa() {
  return (
    <svg {...SVG}>
      <circle cx="12" cy="12" r="9" />

      <path d="M9 9v6" />
      <path d="M15 9v6" />
    </svg>
  );
}

function IconeSeta() {
  return (
    <svg {...SVG}>
      <path d="M4 12h16" />

      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function IconeXicara() {
  return (
    <svg {...SVG}>
      <path d="M4 10h13v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5Z" />

      <path d="M17 12h1a3 3 0 0 1 0 6h-2" />

      <path d="M7 5v2" />
      <path d="M11 4v3" />
      <path d="M15 5v2" />
    </svg>
  );
}

// =========================
// ÍCONES DOS DETALHES
// =========================

function IconeRelogio() {
  return (
    <svg {...SVG}>
      <circle cx="12" cy="12" r="9" />

      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function IconePredio() {
  return (
    <svg {...SVG}>
      <path d="M4 19V9l8-5 8 5v10" />

      <path d="M8 19v-6h8v6" />
    </svg>
  );
}

// =========================
// EVENTOS
// =========================
// Textos copiados literalmente do original (o FAQ fala em outro intervalo; não corrigir aqui).

const EVENTOS = [
  {
    Icone: IconeTerminal,
    tipo: 'CURSO',
    hora: '14:00',
    titulo: 'Início dos Cursos',
    texto: 'Início dos cursos com apresentação dos patrocinadores e a programação geral.',
    duracao: '80 min',
    local: 'Labins',
  },
  {
    Icone: IconePausa,
    tipo: 'INTERVALO',
    hora: '15:20',
    titulo: 'Intervalo',
    texto: 'Pausa de 10 minutos para recarregar as energias.',
    duracao: '10 min',
  },
  {
    Icone: IconeSeta,
    tipo: 'CURSO',
    hora: '15:30',
    titulo: 'Retorno às Salas',
    texto: 'Retorno ao Labins para a conclusão dos cursos.',
    duracao: '55 min',
    local: 'Labins',
  },
  {
    Icone: IconeXicara,
    tipo: 'COFFEE-BREAK',
    hora: '16:25',
    titulo: 'Coffee-break',
    texto: 'Finalização com coffee-break para networking entre participantes e instrutores.',
    duracao: '35 min',
  },
];

export default function AgendaProgramacao() {
  return (
    <section className="agenda">
      <div className="linha-agenda"></div>

      {EVENTOS.map(({ Icone, tipo, hora, titulo, texto, duracao, local }) => (
        <article className="evento" key={hora}>
          <div className="marcador">
            <Icone />
          </div>

          <div className="evento-conteudo">
            <div className="evento-topo">
              <span className="tipo">{tipo}</span>

              <strong>{hora}</strong>
            </div>

            <h2>{titulo}</h2>

            <p>{texto}</p>

            <div className="detalhes">
              <span>
                <IconeRelogio />
                {duracao}
              </span>

              {local && (
                <span>
                  <IconePredio />
                  {local}
                </span>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
