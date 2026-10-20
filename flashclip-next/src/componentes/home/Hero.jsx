// Hero da home (section.fc-hero#evento de index.html): neve em CSS, chamada, globo de neve e barra
// do evento com a contagem. Componente de servidor: o markup do globo é estático e quem lhe dá vida
// são os módulos de src/lib/home (globo.js, natal.js, entrada.js), ligados pelo <HomeRaiz>. Por isso
// os textos, `hidden` e `disabled` daqui são constantes: os módulos os trocam direto no DOM.
import Link from 'next/link';
import GloboFallback from './GloboFallback';
import Contagem from './Contagem';

// Os 23 flocos da neve da hero (--left, --size, --duration, --delay), iguais ao original.
const FLOCOS = [
  ['37.70%', '2.5px', '24.8s', '-5.8s'],
  ['87.17%', '2.1px', '13.6s', '-25.7s'],
  ['25.57%', '1.6px', '18.9s', '-15.9s'],
  ['12.44%', '2.2px', '24.7s', '-13.8s'],
  ['79.45%', '2.1px', '24.5s', '-4.9s'],
  ['35.87%', '1.9px', '14.5s', '-26.3s'],
  ['63.60%', '1.3px', '21.2s', '-11.2s'],
  ['18.94%', '1.4px', '19.5s', '-1.9s'],
  ['56.31%', '1.9px', '14.8s', '-23.6s'],
  ['4.05%', '1.4px', '24.4s', '-6.0s'],
  ['42.42%', '2.0px', '19.1s', '-13.3s'],
  ['50.47%', '1.9px', '13.8s', '-22.0s'],
  ['28.28%', '1.3px', '18.7s', '-22.0s'],
  ['62.88%', '1.8px', '19.7s', '-5.9s'],
  ['61.81%', '1.7px', '13.9s', '-3.5s'],
  ['9.26%', '2.2px', '25.4s', '-20.4s'],
  ['21.95%', '1.4px', '26.3s', '-10.1s'],
  ['16.72%', '2.0px', '21.7s', '-14.6s'],
  ['45.19%', '1.6px', '19.9s', '-12.4s'],
  ['68.13%', '1.8px', '18.0s', '-26.6s'],
  ['11.07%', '2.3px', '18.8s', '-21.7s'],
  ['70.82%', '2.0px', '21.5s', '-6.2s'],
  ['1.61%', '2.2px', '16.6s', '-3.0s'],
];

const ROTULO_GLOBO = 'Globo de neve 3D. Mova o mouse para girar; balance o cursor ou toque no globo para fazer nevar. Pelo teclado, use setas, espaço e Home.';

export default function Hero() {
  return (
    <section className="fc-hero" id="evento" aria-labelledby="fc-title">
      <div className="fc-snow" aria-hidden="true">
        {FLOCOS.map(([left, size, duration, delay], indice) => (
          <i key={indice} style={{ '--left': left, '--size': size, '--duration': duration, '--delay': delay }}></i>
        ))}
      </div>
      <div className="fc-edition">
        <p className="fc-eyebrow">Tecnologia, encontros &amp; Natal</p>
        <span>EDIÇÃO 2026 / ULBRA PALMAS</span>
      </div>
      <div className="fc-hero-grid">
        <div className="fc-hero-copy">
          <h1 id="fc-title">O Natal<br /> nas suas<br /><em>mãos.</em></h1>
          <p>Um pequeno mundo de grandes ideias. Gire, chacoalhe, descubra — e venha viver o FlashClip com a gente.</p>
          <div className="botoes">
            <Link className="botao-principal" href="/cursos/">Encontre seu curso <span aria-hidden="true">↗</span></Link>
            <a className="botao-secundario" href="#sobre">Conheça o FlashClip ↓</a>
          </div>
        </div>
        <div className="fc-globe-dock">
          <div className="fc-globe-experience" id="globo-experiencia" role="region" aria-label="Globo de neve interativo">
            <div className="fc-globe-heading">
              <span>FLASHCLIP · PEQUENOS UNIVERSOS</span>
              <button type="button" data-close-globe="" hidden aria-label="Fechar exploração">Fechar <span aria-hidden="true">×</span></button>
            </div>
            <div className="fc-globe-view" id="globo" tabIndex={0} role="group" aria-label={ROTULO_GLOBO} aria-describedby="globo-instrucao" data-renderer="loading">
              <GloboFallback />
              <div className="fc-globe-canvas"></div>
              <span className="fc-globe-orbit" aria-hidden="true"></span>
              <div className="fc-globe-loader">Preparando seu pequeno mundo…</div>
            </div>
            <p id="globo-instrucao" className="fc-globe-hint">Mova o mouse: o globo acompanha você. Balance para nevar. No celular, toque ou arraste.</p>
            <div className="fc-globe-actions">
              <button className="fc-explore" type="button" data-explore-globe="" disabled>Explorar de perto <span aria-hidden="true">↗</span></button>
            </div>
            <div className="fc-globe-options">
              <button type="button" data-toggle-lights="" aria-pressed="true"><span className="fc-light-icon" aria-hidden="true"></span><span>Apagar luzes</span></button>
              <button type="button" data-toggle-motion="" aria-pressed="false">Pausar movimento</button>
              <button type="button" data-reset-globe="">Recentrar</button>
              <button type="button" data-replay-entry="">Rever abertura</button>
            </div>
            <p className="fc-globe-status" role="status" aria-live="polite">Uma vila, infinitas possibilidades.</p>
          </div>
        </div>
      </div>
      <div className="fc-event-bar">
        <div className="fc-event-date"><strong>05 / 12</strong><div><small>GUARDE A DATA</small><p>Sábado, às 14h · 2026</p></div></div>
        <div className="fc-event-place"><small>VAMOS NOS ENCONTRAR</small><p>Ulbra Palmas, TO</p></div>
        <Contagem />
      </div>
    </section>
  );
}
