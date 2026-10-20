// =========================
// BLOCOS INSTITUCIONAIS
// =========================
//
// Os quatro blocos da página /sobre/ (html/sobre.html), 100% estáticos: Nossa Missão, O Que
// Oferecemos, Para Quem é o Evento e Nossos Valores. Markup igual ao original:
// section.bloco-sobre > div.cabecalho-bloco (div.icone > svg + h2) + div.conteudo-bloco.
// O CSS reconhece o bloco de valores por `.bloco-sobre:has(.valores)`, então div.valores fica
// dentro de .conteudo-bloco. Os blocos saem como filhos diretos de main.sobre (`.sobre > *`).
// Os `d` que estavam quebrados em várias linhas foram juntados numa linha só (desenho igual).

function BlocoSobre({ titulo, icone, children }) {
  return (
    <section className="bloco-sobre">
      <div className="cabecalho-bloco">
        <div className="icone">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {icone}
          </svg>
        </div>

        <h2>{titulo}</h2>
      </div>

      <div className="conteudo-bloco">{children}</div>
    </section>
  );
}

// Lista com marcador próprio (› ou ✓) num span, como no original.
function ListaSobre({ marcador, itens }) {
  return (
    <ul>
      {itens.map(item => (
        <li key={item}>
          <span>{marcador}</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

const VALORES = [
  { titulo: 'Acessibilidade', texto: 'Conhecimento ao alcance de todos.' },
  { titulo: 'Prática', texto: 'Aprender fazendo.' },
  { titulo: 'Comunidade', texto: 'Colaboração e troca de experiências.' },
  { titulo: 'Excelência', texto: 'Uma experiência de aprendizado cada vez melhor.' },
];

export default function BlocosSobre() {
  return (
    <>
      {/* NOSSA MISSÃO */}
      <BlocoSobre
        titulo="Nossa Missão"
        icone={
          <>
            <path d="M9 18h6" />
            <path d="M10 22h4" />

            <path d="M8.5 14.5 C7.5 13.6 7 12.3 7 11 a5 5 0 1 1 10 0 c0 1.3-.5 2.6-1.5 3.5 -.8.7-1.2 1.4-1.4 2.5 H9.9 c-.2-1.1-.6-1.8-1.4-2.5Z" />

            <path d="M12 3v1" />
            <path d="M4.9 5.1l.7.7" />
            <path d="M19.1 5.1l-.7.7" />
          </>
        }
      >
        <p>
          O FlashClip aproxima estudantes do mundo da tecnologia através de
          uma experiência rápida, prática e acessível de aprendizado.
        </p>
      </BlocoSobre>

      {/* O QUE OFERECEMOS */}
      <BlocoSobre
        titulo="O Que Oferecemos"
        icone={
          <>
            <rect x="3" y="4" width="18" height="13" rx="2" />

            <path d="M8 21h8" />
            <path d="M12 17v4" />

            <path d="m8 9 2 2-2 2" />
            <path d="M13 13h3" />
          </>
        }
      >
        <p>
          Cursos intensivos que combinam fundamentos e aplicações práticas em
          uma experiência objetiva e dinâmica.
        </p>

        <ListaSobre
          marcador="›"
          itens={['Conteúdo prático e objetivo', 'Certificado digital', 'Networking com outros estudantes']}
        />
      </BlocoSobre>

      {/* PARA QUEM É */}
      <BlocoSobre
        titulo="Para Quem é o Evento"
        icone={
          <>
            <circle cx="6" cy="6" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <circle cx="12" cy="18" r="2.5" />

            <path d="M8 7.2l2.5 8.2" />
            <path d="M16 7.2l-2.5 8.2" />
            <path d="M8.5 6h7" />
          </>
        }
      >
        <p>
          O FlashClip foi pensado para quem tem curiosidade sobre tecnologia e
          programação, independentemente do nível de experiência.
        </p>

        <ListaSobre
          marcador="✓"
          itens={['Estudantes universitários', 'Iniciantes em programação', 'Entusiastas de tecnologia']}
        />
      </BlocoSobre>

      {/* VALORES */}
      <BlocoSobre
        titulo="Nossos Valores"
        icone={<path d="M12 3l2.8 5.7L21 9.6 l-4.5 4.4 1.1 6.2 L12 17.3l-5.6 2.9 1.1-6.2L3 9.6 l6.2-.9L12 3Z" />}
      >
        <div className="valores">
          {VALORES.map(valor => (
            <div key={valor.titulo}>
              <h3>{valor.titulo}</h3>
              <p>{valor.texto}</p>
            </div>
          ))}
        </div>
      </BlocoSobre>
    </>
  );
}
