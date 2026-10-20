'use client';
// Card de um curso: mesmas classes do HTML que js/carregarCardsCursos.js montava (o CSS da home e o
// da página /cursos/ dependem delas). Os dados chegam prontos de carregarCursos().
import { memo } from 'react';
import Link from 'next/link';
import NotebookCurso from './NotebookCurso';

const DURACAO_PADRAO = '3 horas';

// "Inscrever-se" e "Entrar para se inscrever" navegam sem recarregar (a música continua).
function BotaoInscricao({ acao }) {
  if (acao.href) {
    return <Link href={acao.href} className={acao.classe}>{acao.texto}</Link>;
  }
  return <span className={acao.classe}>{acao.texto}</span>;
}

function CardCurso({ card }) {
  return (
    <article className="card-curso">
      <div className="cabecalho-curso">
        <NotebookCurso nome={card.nomeNotebook} />

        <span className="status-curso">{card.status}</span>
      </div>

      <div className="conteudo-curso">
        <h3>{card.nome}</h3>

        <p className="descricao-curso">{card.descricao}</p>

        <div className="informacoes-curso">
          <div className="info-item">
            <span className="icone-info">◷</span>

            <div>
              <small>DURAÇÃO</small>

              <strong>{DURACAO_PADRAO}</strong>
            </div>
          </div>

          <div className="info-item">
            <span className="icone-info">▣</span>

            <div>
              <small>SALA</small>

              <strong>{card.sala}</strong>
            </div>
          </div>

          <div className="info-item">
            <span className="icone-info">♙</span>

            <div>
              <small>VAGAS</small>

              <strong>{card.vagas}</strong>
            </div>
          </div>
        </div>

        <div className="instrutores-curso">
          <div className="titulo-instrutores">
            <span>INSTRUTORES</span>
          </div>

          <div className="lista-instrutores">
            <div className="avatares-instrutores">
              {card.avatares.map((imagem, indice) => (
                <div className="instrutor-avatar" key={indice}>
                  <img src={imagem} alt="Instrutor do curso" className="imagem-instrutor" />
                </div>
              ))}

              {card.restantes > 0 ? <div className="instrutor-avatar instrutores-restantes">{`+${card.restantes}`}</div> : null}
            </div>

            <span className="quantidade-instrutores">{card.textoInstrutores}</span>
          </div>
        </div>
      </div>

      <div className="rodape-curso">
        <BotaoInscricao acao={card.acao} />
      </div>
    </article>
  );
}

export default memo(CardCurso);
