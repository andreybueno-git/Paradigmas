'use client';
// Contagem regressiva do evento (porte da primeira parte de js/script.js). O HTML estático sai com
// "00" em tudo, como o index.html; a contagem real começa no navegador e é refeita a cada segundo.
// Os dias ficam sem zero à esquerda, como no original.
import { useEffect, useState } from 'react';

const dataEvento = new Date('2026-12-05T14:00:00-03:00');
const ZERADO = { dias: '00', horas: '00', minutos: '00', segundos: '00' };

function calcular() {
  const diferenca = dataEvento - new Date();
  if (diferenca <= 0) return ZERADO;
  const totalSegundos = Math.floor(diferenca / 1000);
  return {
    dias: String(Math.floor(totalSegundos / 86400)),
    horas: String(Math.floor((totalSegundos % 86400) / 3600)).padStart(2, '0'),
    minutos: String(Math.floor((totalSegundos % 3600) / 60)).padStart(2, '0'),
    segundos: String(totalSegundos % 60).padStart(2, '0'),
  };
}

export default function Contagem() {
  const [tempo, setTempo] = useState(ZERADO);

  useEffect(() => {
    const atualizarContador = () => setTempo(calcular());
    atualizarContador();
    const intervalo = setInterval(atualizarContador, 1000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="fc-countdown" aria-label="Contagem regressiva para o evento">
      <span className="fc-countdown-label">Nos vemos em</span>
      <div className="fc-time"><strong id="dias">{tempo.dias}</strong><span>Dias</span></div>
      <div className="fc-time"><strong id="horas">{tempo.horas}</strong><span>Horas</span></div>
      <div className="fc-time"><strong id="minutos">{tempo.minutos}</strong><span>Min.</span></div>
      <div className="fc-time"><strong id="segundos">{tempo.segundos}</strong><span>Seg.</span></div>
    </div>
  );
}
