'use client';
// =========================
// CARD DE UMA INSCRIÇÃO
// =========================
//
// O article.card-inscricao que o js/inscricoes.js montava para cada matrícula, com as mesmas
// classes e a mesma ordem. Recebe os textos já prontos (consultas.js); o React escapa tudo.
//
// Imagem alternativa caso a imagem do curso falhe, em duas etapas como no original:
//   1ª falha → tenta a imagem padrão (data-tentou-padrao="true");
//   2ª falha → esconde a imagem e o cabeçalho do card (título e descrição somem junto).
// A troca para a imagem padrão monta um <img> novo: assim ela é carregada de novo mesmo quando o
// curso já usava a imagem padrão (o original reatribuía o src e o navegador tentava outra vez).
//
import { useState } from 'react';
import { IMAGEM_CURSO_PADRAO } from './consultas';

const OCULTO = { display: 'none' };

function DetalheInscricao({ icone, rotulo, valor }) {
  return (
    <div className="detalhe-inscricao">
      <span className="icone-detalhe-inscricao" aria-hidden="true">
        {icone}
      </span>

      <div className="texto-detalhe-inscricao">
        <small>{rotulo}</small>
        <strong>{valor}</strong>
      </div>
    </div>
  );
}

export default function CardInscricao({ inscricao }) {
  // 0: imagem do curso; 1: imagem padrão; 2: as duas falharam.
  const [falhas, setFalhas] = useState(0);

  const tentouPadrao = falhas > 0;
  const oculto = falhas > 1;

  function aoFalharImagem() {
    setFalhas(atual => Math.min(atual + 1, 2));
  }

  return (
    <article className="card-inscricao">
      <div className="info-curso-inscricao">
        <div className="curso-cabecalho-inscricao" style={oculto ? OCULTO : undefined}>
          <img
            key={tentouPadrao ? 'padrao' : 'curso'}
            src={tentouPadrao ? IMAGEM_CURSO_PADRAO : inscricao.imagem}
            alt={inscricao.nome}
            className="imagem-curso-inscricao"
            loading="lazy"
            data-tentou-padrao={tentouPadrao ? 'true' : undefined}
            style={oculto ? OCULTO : undefined}
            onError={aoFalharImagem}
          />

          <div className="curso-identificacao-inscricao">
            <h2>{inscricao.nome}</h2>
            <p>{inscricao.descricao}</p>
          </div>
        </div>

        <div className="detalhes-inscricao">
          <DetalheInscricao icone="◷" rotulo="PERÍODO" valor={inscricao.periodo} />
          <DetalheInscricao icone="⌖" rotulo="SALA" valor={inscricao.sala} />
          <DetalheInscricao icone="▦" rotulo="INSCRIÇÃO" valor={inscricao.dataInscricao} />
        </div>
      </div>
    </article>
  );
}
