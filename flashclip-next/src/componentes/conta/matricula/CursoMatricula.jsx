// =========================
// CARTÃO DO CURSO (MATRÍCULA)
// =========================
//
// O div.info-curso que o js/matricula.js escrevia no innerHTML de #curso, com as mesmas classes e
// a mesma ordem. Recebe os textos já prontos (montarCard, em curso.js); o React escapa tudo.
//

function DetalheCurso({ icone, rotulo, valor }) {
  return (
    <div className="detalhe-curso">
      <span className="icone-detalhe-curso" aria-hidden="true">
        {icone}
      </span>

      <div className="texto-detalhe-curso">
        <small>{rotulo}</small>
        <strong>{valor}</strong>
      </div>
    </div>
  );
}

export default function CursoMatricula({ card }) {
  return (
    <div className="info-curso">
      <div className="curso-cabecalho">
        <img src={card.imagem} alt={card.nome} className="imagem-curso-matricula" />

        <div className="curso-identificacao">
          <h2>{card.nome}</h2>
          <p>{card.descricao}</p>
        </div>

        <span className="status-curso-matricula">
          <span className="status-curso-ponto" aria-hidden="true"></span>
          {card.status}
        </span>
      </div>

      <div className="detalhes-curso">
        <DetalheCurso icone="◷" rotulo="DURAÇÃO" valor={card.duracao} />
        <DetalheCurso icone="⌖" rotulo="SALA" valor={card.sala} />
        <DetalheCurso icone="♙" rotulo="VAGAS" valor={card.vagas} />
      </div>

      <div className="instrutores-matricula">
        <div className="titulo-instrutores-matricula">INSTRUTORES</div>

        <div className="linha-instrutor-matricula">
          <div className="avatares-matricula">
            {card.avatares.map(avatar => (
              <img
                key={avatar.chave}
                src={avatar.src}
                alt={avatar.alt}
                className="avatar-instrutor-matricula"
                loading={avatar.carregamento}
              />
            ))}
          </div>

          <div className="dados-instrutor-matricula">
            <strong>{card.nomePrimeiroInstrutor}</strong>

            <span>{card.quantidadeInstrutores}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
