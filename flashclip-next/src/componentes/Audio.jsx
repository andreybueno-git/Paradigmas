'use client';
// Botões de música e efeitos. Ficam no layout (barra fixa) e podem ser usados em qualquer página,
// como nos controles da abertura da home. Todos leem o mesmo motor.
import { useSyncExternalStore } from 'react';
import { obterMotorAudio, ESTADO_INICIAL } from '@/lib/audio/motor';

const nada = () => () => {};

function useAudio() {
  const motor = obterMotorAudio();
  const estado = useSyncExternalStore(motor ? motor.assinar : nada, motor ? motor.estado : () => ESTADO_INICIAL, () => ESTADO_INICIAL);
  return [estado, motor];
}

export function BotaoMusica() {
  const [{ musica, indisponivel }, motor] = useAudio();
  return (
    <button type="button" data-audio-music aria-pressed={musica} disabled={indisponivel} onClick={() => motor?.alternarMusica()}>
      {indisponivel ? 'Áudio indisponível' : musica ? '♫ Música ligada' : '♫ Música desligada'}
    </button>
  );
}

export function BotaoEfeitos() {
  const [{ efeitos, indisponivel }, motor] = useAudio();
  return (
    <button type="button" data-audio-effects aria-pressed={efeitos} disabled={indisponivel} onClick={() => motor?.alternarEfeitos()}>
      {indisponivel ? 'Áudio indisponível' : efeitos ? '♪ Efeitos ligados' : '♪ Efeitos desligados'}
    </button>
  );
}

export function ControleAudio() {
  return (
    <div className="fc-audio-dock" role="group" aria-label="Controles de áudio">
      <BotaoMusica />
      <BotaoEfeitos />
    </div>
  );
}
