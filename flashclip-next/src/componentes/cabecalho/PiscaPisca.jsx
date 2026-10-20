'use client';
// =========================
// PISCA-PISCA
// =========================
//
// Fio com leves curvas na base do cabeçalho com lâmpadas coloridas penduradas (porte do
// js/cabecalho.js). Tem de ser o primeiro filho do <header>: o menu mobile fica por cima.
// É redesenhado quando a largura do cabeçalho muda; o piscar é todo em CSS (cabecalho.css).
//
import { useLayoutEffect, useRef, useState } from 'react';

const CORES_PISCA = ['vermelho', 'dourado', 'verde', 'branco'];

// Mesmas contas do original, com os números convertidos em texto do mesmo jeito.
export function gerarPisca(largura) {
  // =========================
  // FIO
  // =========================

  const alturaFio = 3;
  const curva = largura < 600 ? 5 : 7;

  const vaos = Math.max(2, Math.round(largura / 150));
  const larguraVao = largura / vaos;

  let fio = 'M 0 ' + alturaFio;

  for (let i = 0; i < vaos; i++) {
    const meio = larguraVao * (i + 0.5);
    const fim = larguraVao * (i + 1);

    fio += ' Q ' + meio + ' ' + (alturaFio + curva * 2) + ' ' + fim + ' ' + alturaFio;
  }

  // =========================
  // LÂMPADAS
  // =========================

  const lampadasPorVao = 4;
  const lampadas = [];

  let indice = 0;

  for (let i = 0; i < vaos; i++) {
    for (let j = 0; j < lampadasPorVao; j++) {
      // posição na curva (t de 0 a 1 dentro do vão)
      const t = (j + 0.5) / lampadasPorVao;

      const x = larguraVao * (i + t);
      const y = alturaFio + curva * 4 * t * (1 - t);

      // leve inclinação acompanhando o fio
      const inclinacao = (Math.atan((curva * 4 * (1 - 2 * t)) / larguraVao) * 180) / Math.PI;

      // duas fileiras que se alternam, como num pisca-pisca de verdade
      const fileira = indice % 2 ? ' alterna' : '';

      lampadas.push({
        classe: 'pisca-lampada ' + CORES_PISCA[indice % CORES_PISCA.length] + fileira,
        transform: 'translate(' + x + ' ' + y + ') rotate(' + inclinacao * 0.6 + ')',
      });

      indice++;
    }
  }

  return { fio, lampadas };
}

export default function PiscaPisca() {
  const svg = useRef(null);
  const [largura, setLargura] = useState(0);

  // Mede antes da pintura (sem piscar o fio ao trocar de página) e acompanha o tamanho depois.
  useLayoutEffect(() => {
    const navbar = svg.current?.parentElement;

    if (!navbar) return;

    const medir = () => {
      const atual = Math.round(navbar.clientWidth);

      if (atual > 0) setLargura(atual);
    };

    medir();

    if (typeof ResizeObserver !== 'function') return;

    const observador = new ResizeObserver(medir);

    observador.observe(navbar);

    return () => observador.disconnect();
  }, []);

  // Sem largura (HTML exportado e primeira pintura) o SVG fica vazio, como antes do script rodar.
  const desenho = largura > 0 ? gerarPisca(largura) : null;

  return (
    <svg
      ref={svg}
      className="pisca-pisca"
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox={desenho ? '0 0 ' + largura + ' 26' : undefined}
    >
      {desenho && <path className="pisca-fio" d={desenho.fio} />}

      {desenho?.lampadas.map((lampada, i) => (
        <g key={i} className={lampada.classe} transform={lampada.transform}>
          <rect className="pisca-soquete" x={-2.2} y={-0.5} width={4.4} height={4} rx={1} />
          <path className="pisca-vidro" d="M -2.7 3.4 C -4 6.6 -1.3 10.6 0 12.2 C 1.3 10.6 4 6.6 2.7 3.4 Z" />
          <ellipse className="pisca-reflexo" cx={-1} cy={6} rx={0.6} ry={1.5} />
        </g>
      ))}
    </svg>
  );
}
