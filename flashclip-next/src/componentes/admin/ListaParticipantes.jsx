// =========================
// PAINEL ADMINISTRATIVO: PARTICIPANTES DO CURSO
// =========================
//
// Porte da parte de carregarParticipantes() do admin/admin.js que desenhava a grade
// #listaParticipantes. Os avisos ("Selecione um curso...", "Carregando...", erros, vazio) são
// <p> filhos diretos da grade, como no original: ocupam só a primeira célula.
//
// O original montava cada card com innerHTML (um nome com HTML virava HTML). Aqui o React mostra
// tudo como texto. Os valores aparecem como o original os imprimia: idade vazia vira "null anos".
// Cada linha é um texto só (template string): dois nós de texto lado a lado ("Status:" e " ")
// deslocam o que vem depois em 1/64 de pixel em relação ao original.
//

// Avisos da lista, pelo estado.
const AVISOS = {
  selecione: 'Selecione um curso para visualizar as matrículas.',
  'erro-matriculas': 'Erro ao carregar as matrículas.',
  vazio: 'Nenhuma pessoa matriculada neste curso.',
  'erro-usuarios': 'Erro ao carregar os participantes.',
};

// =============================
// CARD DE CADA PARTICIPANTE
// =============================

function CardParticipante({ matricula, usuario, aoAtender }) {
  const status = matricula.status || 'Pendente';

  return (
    <div className="card-participante">
      <h3>{String(usuario.nome)}</h3>

      <div className="info-participante">{`${usuario.idade} anos`}</div>

      <div className="info-participante">{`📧 ${usuario.email || 'E-mail não informado'}`}</div>

      <div className="info-participante">{`📞 ${usuario.telefone || 'Telefone não informado'}`}</div>

      <div className="status-participante">
        {'Status: '}
        <span className={status === 'Pendente' ? 'status-pendente' : 'status-atendido'}>{String(status)}</span>
      </div>

      {/* Só mostra o botão se estiver pendente */}
      {status === 'Pendente' && (
        <button
          className="botao-atender"
          data-id={String(matricula.id)}
          onClick={() => aoAtender(String(matricula.id))}
        >
          Marcar como atendido
        </button>
      )}
    </div>
  );
}

// =============================
// GRADE DE PARTICIPANTES
// =============================
//
// lista: { estado: 'selecione' | 'carregando' | 'erro-matriculas' | 'vazio' | 'erro-usuarios' }
// ou { estado: 'lista', itens: [{ matricula, usuario }] } (grade vazia se nenhum usuário foi achado).

export default function ListaParticipantes({ lista, aoAtender }) {
  let conteudo;

  if (lista.estado === 'lista') {
    conteudo = lista.itens.map(({ matricula, usuario }, indice) => (
      <CardParticipante
        key={matricula.id ?? `indice-${indice}`}
        matricula={matricula}
        usuario={usuario}
        aoAtender={aoAtender}
      />
    ));
  } else if (lista.estado === 'carregando') {
    conteudo = <p className="carregando">Carregando participantes...</p>;
  } else {
    conteudo = <p className="sem-matriculas">{AVISOS[lista.estado] ?? AVISOS.selecione}</p>;
  }

  return (
    <div id="listaParticipantes" className="lista-participantes">
      {conteudo}
    </div>
  );
}
