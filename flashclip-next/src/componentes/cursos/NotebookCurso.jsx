'use client';
// Notebook do card de curso (porte de computerMarkup, em notebooks/course-identities.js).
// O <details> não é controlado: o clique abre e fecha de forma nativa, o controlador 3D ouve o
// "toggle" para animar a tampa e o React só troca os rótulos e o estado data-renderer:
//   pending  -> spinner "Preparando notebook…"
//   webgl    -> o canvas 2D recebe os quadros do renderer compartilhado
//   fallback -> desenho leve (notebook fechado em SVG; aberto, logo e nome em CSS)
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { asset } from '@/lib/caminho';
import { identidadeCurso, LOGO_MARCA } from '@/lib/notebooks/identidades';

// Fornecido por <ListaCursos>: o controlador (quando já carregou) e se a versão 3D ficou indisponível.
export const ContextoNotebooks = createContext({ notebooks: null, indisponivel: false });

export default function NotebookCurso({ nome }) {
  const identidade = useMemo(() => identidadeCurso(nome), [nome]);
  const { notebooks, indisponivel } = useContext(ContextoNotebooks);
  const refDetalhes = useRef(null);
  const [renderer, setRenderer] = useState('pending');
  const [aberto, setAberto] = useState(false);

  // Cada card se registra no controlador; o retorno desfaz o registro (ouvintes, observadores, cena).
  useEffect(() => {
    if (!notebooks || !refDetalhes.current) return;
    return notebooks.registrar(refDetalhes.current, identidade, setRenderer);
  }, [notebooks, identidade]);

  const estado = indisponivel ? 'fallback' : renderer;
  const acao = aberto ? 'Fechar notebook' : 'Abrir notebook';

  // Os {' '} repetem os espaços entre as tags do computerMarkup original (o textContent do <summary> fica igual).
  return (
    <details
      ref={refDetalhes}
      className="fc-course-computer"
      data-language={identidade.nome}
      data-renderer={estado}
      style={{ '--computer-accent': identidade.cor }}
      onToggle={evento => setAberto(evento.currentTarget.open)}
    >
      {' '}
      <summary className="fc-computer-trigger" aria-label={`${aberto ? 'Fechar' : 'Abrir'} notebook de ${identidade.nome}`} aria-busy={estado === 'pending'}>
        {' '}
        <canvas className="fc-computer-canvas" aria-hidden="true"></canvas>
        {' '}
        <span className="fc-computer-loading" role="status"><span className="fc-computer-loading-ring" aria-hidden="true"></span><span>Preparando notebook…</span></span>
        {' '}
        <span className="fc-computer-fallback" aria-hidden="true">
          {' '}
          <span className="fc-computer-closed">
            {' '}
            <svg viewBox="0 0 360 190" fill="none"><ellipse cx="182" cy="151" rx="133" ry="15" fill="#000" opacity=".28" /><path d="M61 64 264 47 314 126 111 148 61 74Z" fill="#263c36" stroke="#789083" /><path d="m61 64 203-17 50 79-203 19Z" fill="#344b43" stroke="#94a396" /><path d="m111 145 203-19v6l-203 21-50-73v-6Z" fill="#0c211c" stroke="#547568" /><path d="m161 144 56-6" stroke="#e6c88c" strokeWidth="2" strokeLinecap="round" /><image href={asset(LOGO_MARCA)} x=".3" y=".32" width=".4" height=".35" transform="matrix(203 -17 50 81 61 64)" /></svg>
            {' '}
          </span>
          {' '}
          <span className="fc-computer-fallback-open">
            {' '}
            {identidade.logo ? <img src={identidade.logo} alt="" loading="lazy" width="70" height="70" /> : null}
            {' '}
            <b>{identidade.nome}</b>
            {' '}
          </span>
          {' '}
        </span>
        {' '}
        <span className="fc-computer-hint"><span data-computer-action="">{acao}</span><span className="fc-computer-toggle" aria-hidden="true">{'↗︎'}</span></span>
        {' '}
      </summary>
      {' '}
      <span className="fc-computer-description">{`${identidade.rotuloLogo}. Clique no notebook novamente para fechar.`}</span>
      {' '}
    </details>
  );
}
