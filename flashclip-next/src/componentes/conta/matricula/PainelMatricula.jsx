// =========================
// MENSAGEM, CURSO E BOTÃO DA MATRÍCULA
// =========================
//
// A parte do card que muda: #mensagemMatricula, #curso e #botaoConfirmar, com os mesmos ids,
// classes e atributos do html/matricula.html. Não tem estado próprio, então serve para os dois
// momentos da página:
//   - sem props, é o HTML estático (fallback do <Suspense> enquanto a página não leu o ?id=):
//     mensagem escondida, "Carregando curso..." e o botão desabilitado, como o original;
//   - com props, é a página funcionando (ConfirmacaoMatricula).
//
// fc-magnetic fica escrita no className do botão (os efeitos de toque mexem nas classes dele).
//
import CursoMatricula from './CursoMatricula';

// Rótulos do botão enquanto verifica e depois de confirmar (sem a seta, como no original).
const ROTULOS = {
  verificando: 'Verificando matrícula...',
  concluida: 'Matrícula confirmada',
};

const SEM_CURSO = {};

// carga: {} (carregando) | { erro } | { curso, card }
// fase: 'ocioso' | 'verificando' | 'concluida'
// mensagem: { texto, tipo: 'erro' | 'aviso' } ou null (escondida)
export default function PainelMatricula({ mensagem = null, refMensagem, carga = SEM_CURSO, fase = 'ocioso', aoConfirmar }) {
  const desabilitado = !carga.card || fase !== 'ocioso';

  let conteudo = <p className="estado-carregamento">Carregando curso...</p>;

  if (carga.card) {
    conteudo = <CursoMatricula card={carga.card} />;
  } else if (carga.erro) {
    conteudo = <p className="erro-carregamento-curso">{carga.erro}</p>;
  }

  return (
    <>
      <div
        ref={refMensagem}
        id="mensagemMatricula"
        className="mensagem-matricula"
        role="alert"
        aria-live="polite"
        hidden={!mensagem}
        data-tipo={mensagem?.tipo}
      >
        {mensagem?.texto}
      </div>

      <div id="curso" aria-live="polite">
        {conteudo}
      </div>

      <button
        type="button"
        id="botaoConfirmar"
        className="botao-confirmar fc-magnetic"
        disabled={desabilitado}
        onClick={aoConfirmar}
      >
        {fase === 'ocioso' ? (
          <>
            <span>Confirmar matrícula</span>
            <span className="seta-confirmar" aria-hidden="true">
              →
            </span>
          </>
        ) : (
          ROTULOS[fase]
        )}
      </button>
    </>
  );
}
