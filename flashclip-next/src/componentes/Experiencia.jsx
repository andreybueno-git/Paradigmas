'use client';
// Botões magnéticos (Entrar, Inscrições, Criar conta...) e o som de toque, para o site inteiro.
// Funciona por delegação: vale para os botões de qualquer página, inclusive os que aparecem depois.
import { useEffect } from 'react';
import { obterMotorAudio } from '@/lib/audio/motor';

const SELETOR = '.navbar .inscricoes, .menu-mobile .inscricoes, #botaoUsuario, #botaoUsuarioMobile, .botao-login, .botao-cadastro, .botao-confirmar';

export default function Experiencia() {
  useEffect(() => {
    // Cria o motor de áudio já na primeira página, para os gestos serem ouvidos desde o início.
    obterMotorAudio();
    const calmo = matchMedia('(prefers-reduced-motion: reduce)');
    const mouse = matchMedia('(hover: hover) and (pointer: fine)');
    const desvio = new WeakMap();
    let cursor = null, quadro = 0;

    // O campo magnético começa um pouco fora do botão e fica mais forte perto do centro.
    function atrair() {
      quadro = 0;
      for (const botao of document.querySelectorAll(SELETOR)) {
        botao.classList.add('fc-magnetic');
        const [dx0, dy0] = desvio.get(botao) || [0, 0];
        const caixa = botao.getBoundingClientRect();
        let dx = 0, dy = 0;
        if (cursor && caixa.width && !botao.disabled) {
          // Mede a partir da posição original, sem o deslocamento já aplicado.
          const cx = caixa.left - dx0 + caixa.width / 2, cy = caixa.top - dy0 + caixa.height / 2;
          const ox = cursor.x - cx, oy = cursor.y - cy;
          const alcance = Math.max(caixa.width, caixa.height) / 2 + 46;
          const distancia = Math.hypot(ox, oy);
          if (distancia < alcance) {
            const forca = 1 - distancia / alcance;
            dx = ox * .45 * forca; dy = oy * .55 * forca;
            botao.style.setProperty('--fc-gx', `${cursor.x - (caixa.left - dx0)}px`);
            botao.style.setProperty('--fc-gy', `${cursor.y - (caixa.top - dy0)}px`);
          }
        }
        if (!dx && !dy && !desvio.has(botao)) continue;
        botao.classList.toggle('fc-atraido', dx !== 0 || dy !== 0);
        if (dx || dy) desvio.set(botao, [dx, dy]); else desvio.delete(botao);
        botao.style.setProperty('--fc-mx', `${dx.toFixed(2)}px`);
        botao.style.setProperty('--fc-my', `${dy.toFixed(2)}px`);
      }
    }
    const pedirQuadro = () => { if (!quadro) quadro = requestAnimationFrame(atrair); };
    const mover = evento => {
      if (evento.pointerType !== 'mouse' || !mouse.matches || calmo.matches) return;
      cursor = { x: evento.clientX, y: evento.clientY }; pedirQuadro();
    };
    const sair = evento => { if (!evento.relatedTarget) { cursor = null; pedirQuadro(); } };
    const desfocar = () => { cursor = null; pedirQuadro(); };
    const tocar = evento => {
      const botao = evento.target.closest?.(SELETOR);
      if (!botao || botao.disabled) return;
      const caixa = botao.getBoundingClientRect();
      botao.style.setProperty('--fc-gx', `${evento.clientX - caixa.left}px`);
      botao.style.setProperty('--fc-gy', `${evento.clientY - caixa.top}px`);
      // Reinicia a animação do toque mesmo em cliques seguidos.
      botao.classList.add('fc-magnetic'); botao.classList.remove('fc-press'); void botao.offsetWidth; botao.classList.add('fc-press');
      window.dispatchEvent(new CustomEvent('fc:ui-press'));
    };
    const fimAnimacao = evento => { if (evento.animationName.startsWith('fc-press')) evento.target.classList.remove('fc-press'); };

    document.addEventListener('pointermove', mover, { passive: true });
    document.addEventListener('mouseout', sair);
    window.addEventListener('blur', desfocar);
    document.addEventListener('pointerdown', tocar);
    document.addEventListener('animationend', fimAnimacao);
    return () => {
      cancelAnimationFrame(quadro);
      document.removeEventListener('pointermove', mover);
      document.removeEventListener('mouseout', sair);
      window.removeEventListener('blur', desfocar);
      document.removeEventListener('pointerdown', tocar);
      document.removeEventListener('animationend', fimAnimacao);
    };
  }, []);
  return null;
}
