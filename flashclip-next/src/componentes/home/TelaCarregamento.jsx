'use client';
// Tela de carregamento da home (section#fc-loading de index.html). O texto e os passos vêm do estado
// de src/lib/home/carregamento.js; o HTML estático sai com o estado inicial ("Preparando seu Natal.").
// O título herda o degradê branco→dourado da regra global de h1 do home.css, como no original.
import { useSyncExternalStore } from 'react';
import { asset } from '@/lib/caminho';

const ETAPAS = [['globe', 'Globo'], ['sleigh', 'Trenó'], ['page', 'Evento']];

export default function TelaCarregamento({ boot }) {
  const tela = useSyncExternalStore(boot.assinar, boot.tela, boot.telaInicial);

  return (
    <section
      id="fc-loading"
      role="region"
      aria-label="Carregamento do FlashClip"
      aria-busy={tela.ocupado ? 'true' : 'false'}
      data-state={tela.erro ? 'error' : 'loading'}
      className={tela.saindo ? 'fc-loading-leaving' : undefined}
      hidden={tela.oculto}
    >
      <div className="fc-loading-content">
        <img className="fc-loading-logo" src={asset('/imagens/logoFlash.webp')} width="146" height="50" alt="FlashClip" />
        <div className="fc-loading-orb" aria-hidden="true">
          <svg viewBox="0 0 70 85" fill="none">
            <path d="M35 15 21 38h8L17 57h36L41 38h8L35 15Z" fill="#183626" stroke="#f5bd3d" strokeWidth="1.2" />
            <path d="M35 6v7m-3.5-3.5h7M35 58v10M17 70h36" stroke="#f5bd3d" strokeWidth="1.4" strokeLinecap="round" />
            <circle className="fc-loading-flake" cx="13" cy="24" r="1.4" fill="#f2f2f2" />
            <circle className="fc-loading-flake" cx="57" cy="37" r="1.2" fill="#f2f2f2" />
            <circle className="fc-loading-flake" cx="21" cy="46" r="1" fill="#f2f2f2" />
          </svg>
        </div>
        <h1>{tela.titulo}</h1>
        <p className="fc-loading-message" data-loading-message="" role="status" aria-live="polite">{tela.mensagem}</p>
        <ol className="fc-loading-steps" aria-label="Recursos da prévia">
          {ETAPAS.map(([nome, rotulo]) => (
            <li key={nome} data-loading-step={nome} data-ready={tela.etapas ? String(tela.etapas[nome]) : undefined}>{rotulo}</li>
          ))}
        </ol>
        <p className="fc-loading-note" data-loading-note="">{tela.nota}</p>
        <div className="fc-loading-actions" data-loading-actions="" hidden={!tela.erro}>
          <button type="button" data-loading-retry="" onClick={() => window.location.reload()}>Tentar novamente</button>
          <button type="button" data-loading-continue="" onClick={boot.continuarLeve}>Continuar com versão leve</button>
        </div>
      </div>
    </section>
  );
}
