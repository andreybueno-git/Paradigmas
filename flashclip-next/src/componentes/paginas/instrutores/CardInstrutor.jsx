'use client';
// =========================
// CARD DO INSTRUTOR
// =========================
//
// Mesmo markup que o js/instrutores.js montava com innerHTML: foto, nome e o curso.
// Os textos agora entram como texto (o original interpolava no HTML sem escapar).
//
// Foto quebrada: o original trocava para a foto padrão uma única vez
// (this.onerror=null; this.src=...). Aqui o estado `falhou` faz o mesmo: depois da troca, um novo
// erro não muda mais nada.
import { useState } from 'react';
import { FOTO_PADRAO } from './agruparInstrutores';

export default function CardInstrutor({ nome, foto, curso }) {
  const [falhou, setFalhou] = useState(false);

  return (
    <article className="card-instrutor">
      <div className="foto-instrutor">
        <img src={falhou ? FOTO_PADRAO : foto} alt={nome} loading="lazy" onError={() => setFalhou(true)} />
      </div>

      <h3>{nome}</h3>

      <span className="nome-curso">{curso}</span>
    </article>
  );
}
