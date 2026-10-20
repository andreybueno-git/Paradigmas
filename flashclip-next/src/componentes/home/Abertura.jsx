// Abertura "toque 5 vezes" (section.fc-entry#abertura de index.html). Sai escondida no HTML estático;
// o entrada.js a mostra, move o globo para .fc-entry-mount e troca textos, passos e botões direto no
// DOM, por isso o JSX daqui é constante. Os botões de música e efeitos são os mesmos da barra do
// layout (<BotaoMusica/> e <BotaoEfeitos/>), ligados ao mesmo motor de áudio.
import { asset } from '@/lib/caminho';
import { BotaoMusica, BotaoEfeitos } from '@/componentes/Audio';

export default function Abertura() {
  return (
    <section className="fc-entry" id="abertura" hidden role="region" aria-label="Abertura interativa do FlashClip" data-entry-step="0">
      <div className="fc-entry-top">
        <img src={asset('/imagens/logoFlash.webp')} width="142" height="49" alt="FlashClip" />
        <span>EDIÇÃO NATAL 2026</span>
      </div>

      <div className="fc-entry-mount"></div>

      <div className="fc-entry-bottom">
        <div className="fc-entry-copy">
          <h1>Um toque de Natal.</h1>
          <p id="entrada-instrucao" data-entry-instruction="">Toque no globo 5 vezes para abrir o evento.</p>
        </div>
        <div className="fc-entry-progress" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i>
        </div>
        <button className="fc-entry-tap" type="button" data-entry-tap="">Toque para começar</button>
        <p className="fc-entry-status" data-entry-status="" role="status" aria-live="polite" aria-atomic="true">0 de 5 toques.</p>
        <div className="fc-entry-utility">
          <button type="button" data-entry-skip="">Pular abertura</button>
          <span aria-hidden="true">·</span>
          <button type="button" data-entry-pause="" aria-pressed="false">Pausar movimento</button>
          <BotaoMusica />
          <BotaoEfeitos />
        </div>
      </div>
    </section>
  );
}
