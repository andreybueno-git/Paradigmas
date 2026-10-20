'use client';
// =========================
// FILTROS E CARDS DOS PATROCINADORES
// =========================
//
// Porte de js/patrocinadores.js. Renderiza o conteúdo de section.patrocinadores: os botões de
// categoria (div.filtros) e os cards (div.lista-patrocinadores). O HTML estático sai com "Todos"
// ativo e os três cards visíveis, como o original.
//
// Clique num filtro: só ele fica com .ativo, e os cards de outra categoria recebem display:none
// (todos continuam no DOM, como antes). O original escrevia display:flex nos visíveis; o CSS do
// card já é display:flex em todas as larguras, então deixar sem estilo dá no mesmo.
// O filtro não é guardado: voltar à página começa de novo em "Todos".
import { useState } from 'react';
import { FILTROS, PATROCINADORES } from './patrocinadores';

// Ícones dos links (mesmos traços do original).
const SVG = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.7',
  'aria-hidden': 'true',
};

function IconeSite() {
  return (
    <svg {...SVG}>
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c3 3 3 15 0 18" /><path d="M12 3c-3 3-3 15 0 18" />
    </svg>
  );
}

function IconeInstagram() {
  return (
    <svg {...SVG}>
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const LINKS = {
  site: { Icone: IconeSite, texto: 'Site' },
  instagram: { Icone: IconeInstagram, texto: 'Instagram' },
};

export default function ListaPatrocinadores() {
  const [filtro, setFiltro] = useState('todos');

  return (
    <>
      <div className="filtros" aria-label="Filtrar patrocinadores por categoria">
        {FILTROS.map(({ valor, rotulo }) => (
          <button
            key={valor}
            className={valor === filtro ? 'filtro ativo' : 'filtro'}
            type="button"
            data-filtro={valor}
            onClick={() => setFiltro(valor)}
          >
            {rotulo}
          </button>
        ))}
      </div>

      <div className="lista-patrocinadores">
        {PATROCINADORES.map(patrocinador => {
          const visivel = filtro === 'todos' || patrocinador.categoria === filtro;

          return (
            <article
              key={patrocinador.nome}
              className="card-patrocinador"
              data-categoria={patrocinador.categoria}
              style={visivel ? undefined : { display: 'none' }}
            >
              <div className={'nivel ' + patrocinador.categoria}>
                <span className="simbolo" aria-hidden="true">◆</span>
                {patrocinador.nivel}
              </div>

              <div className="logo-patrocinador">
                <img src={patrocinador.logo} alt={patrocinador.nome} loading="lazy" />
              </div>

              <div className="info-patrocinador">
                <h2>{patrocinador.nome}</h2>
                <p>{patrocinador.descricao}</p>
              </div>

              <div className="links-patrocinador">
                {patrocinador.links.map(({ tipo, href, rotulo }) => {
                  const { Icone, texto } = LINKS[tipo];

                  return (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={rotulo}>
                      <Icone />
                      {texto}
                    </a>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
