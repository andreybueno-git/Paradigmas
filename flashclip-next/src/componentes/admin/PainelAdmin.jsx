'use client';
// =========================
// PAINEL ADMINISTRATIVO
// =========================
//
// Porte do admin/admin.js (o <main class="container"> do admin.html): verifica a sessão e a
// permissão, mostra o resumo geral (4 cartões e a hora da última atualização), lista os
// participantes do curso escolhido e marca uma matrícula como "Atendido" depois do modal.
// Mesmas consultas (consultas.js), mesmas contas (metricas.js), mesmos textos, ids e classes.
//
// O primeiro render é o HTML original ("Verificando permissões...", zeros, "--", select só com o
// placeholder, modal fechado); a data só é lida dentro dos efeitos e cliques.
//
// Diferenças em relação ao original (todas para corrigir falhas, sem mudar o visual normal):
// - O curso escolhido continua no select depois de "Atualizar dados" ou de uma confirmação. O
//   original voltava o select para "Selecione um curso" com os cards do curso ainda na tela, e a
//   confirmação seguinte recarregava a lista vazia ("Selecione um curso...").
// - Se a permissão falhar numa atualização (sessão expirada, por exemplo), a mensagem aparece e o
//   resumo some. O original trocava o texto de uma mensagem que continuava escondida.
// - Se a alteração do status falhar, o modal continua aberto como antes, mas "Confirmar" tenta de
//   novo (no original ele deixava de responder e só restava "Cancelar").
// - Uma carga nova cancela a anterior (cliques repetidos em "Atualizar dados", troca rápida de
//   curso): vale sempre a última, e nada é atualizado depois de sair da página.
// - Sem os console.log de depuração (ids e idades no console). Os console.error ficaram.
//
import { useCallback, useEffect, useRef, useState } from 'react';
import ListaParticipantes from './ListaParticipantes';
import ModalStatus from './ModalStatus';
import {
  verificarAdministrador,
  buscarCursos,
  buscarMatriculas,
  buscarIdades,
  buscarParticipantes,
  marcarAtendido,
} from './consultas';
import {
  RESUMO_INICIAL,
  pessoasInscritas,
  cursoMaisPopular,
  mediaDeIdade,
  matriculasPendentes,
  horarioAtual,
} from './metricas';

// Texto de #mensagemAcesso para cada estado do acesso. Autorizado, a mensagem só fica escondida.
const MENSAGENS = {
  verificando: 'Verificando permissões...',
  'sem-sessao': 'Você precisa estar logado para acessar esta página.',
  'erro-permissao': 'Não foi possível verificar suas permissões.',
  negado: 'Acesso negado. Esta área é exclusiva para administradores.',
  'erro-dados': 'Erro ao carregar os dados do Dashboard.',
};

const LISTA_SELECIONE = { estado: 'selecione' };
const LISTA_CARREGANDO = { estado: 'carregando' };

function classeMensagem(acesso) {
  if (acesso === 'verificando') return 'mensagem';

  if (acesso === 'autorizado') return 'mensagem oculto';

  return 'mensagem erro';
}

// =============================
// CARTÃO DO RESUMO
// =============================

function CardResumo({ icone, rotulo, id, valor }) {
  return (
    <article className="card">
      <span className="icone">{icone}</span>
      <p>{rotulo}</p>
      <h3 id={id}>{valor}</h3>
    </article>
  );
}

export default function PainelAdmin() {
  // 'verificando' | 'sem-sessao' | 'erro-permissao' | 'negado' | 'autorizado' | 'erro-dados'
  const [acesso, setAcesso] = useState('verificando');
  const [resumo, setResumo] = useState(RESUMO_INICIAL);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState('--');

  const [cursos, setCursos] = useState([]);
  const [cursoId, setCursoId] = useState('');
  const [lista, setLista] = useState(LISTA_SELECIONE);

  // Guarda a matrícula que será alterada
  const [matriculaSelecionada, setMatriculaSelecionada] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [alterando, setAlterando] = useState(false);

  // Montado? (nada de setState nem alert depois de sair da página)
  const vivo = useRef(false);
  // Carga em andamento de cada parte; uma nova cancela a anterior.
  const cargaDashboard = useRef(null);
  const cargaLista = useRef(null);
  // Curso do select no momento (a confirmação recarrega a lista deste curso).
  const cursoAtual = useRef('');

  // =============================
  // CARREGAR DASHBOARD
  // =============================
  //
  // Sessão e permissão, cursos do select e as métricas, em série como no original. Os cartões
  // mudam por etapas: total e curso popular, depois a média, depois pendentes e o horário.

  const carregarDashboard = useCallback(async function () {
    if (!vivo.current) return;

    cargaDashboard.current?.abort();
    const controle = new AbortController();
    cargaDashboard.current = controle;
    const { signal } = controle;

    try {
      const resultado = await verificarAdministrador(signal);
      if (signal.aborted) return;

      setAcesso(resultado);

      if (resultado !== 'autorizado') return;

      // =============================
      // CURSOS DO SELECT
      // =============================

      const { data: listaCursos, error: erroCursos } = await buscarCursos(signal);
      if (signal.aborted) return;

      if (erroCursos) {
        // Mantém o select como estava.
        console.error('Erro ao carregar cursos:', erroCursos);
      } else {
        const novosCursos = listaCursos || [];

        setCursos(novosCursos);

        // O curso escolhido continua; se ele não existe mais, volta para "Selecione um curso".
        const aindaExiste = novosCursos.some(function (curso) {
          return String(curso.id) === cursoAtual.current;
        });

        if (!aindaExiste) {
          cursoAtual.current = '';
          setCursoId('');
        }
      }

      // =============================
      // BUSCAR MATRÍCULAS
      // =============================

      const { data: matriculas, error: erroMatriculas } = await buscarMatriculas(signal);
      if (signal.aborted) return;

      if (erroMatriculas) {
        console.error('Erro ao carregar matrículas:', erroMatriculas);

        setAcesso('erro-dados');

        return;
      }

      // =============================
      // SEM MATRÍCULAS
      // =============================

      if (!matriculas || matriculas.length === 0) {
        setResumo(RESUMO_INICIAL);
        setUltimaAtualizacao(horarioAtual());

        return;
      }

      // =============================
      // TOTAL DE PESSOAS E CURSO MAIS POPULAR
      // =============================

      const idsUsuarios = pessoasInscritas(matriculas);
      const popular = cursoMaisPopular(matriculas);

      setResumo(function (atual) {
        return { ...atual, total: String(idsUsuarios.length), popular };
      });

      // =============================
      // MÉDIA DE IDADE, PENDENTES E HORÁRIO
      // =============================

      const { data: usuarios, error: erroUsuarios } = await buscarIdades(idsUsuarios, signal);
      if (signal.aborted) return;

      const media = erroUsuarios ? 'Erro' : mediaDeIdade(usuarios);
      const pendentes = String(matriculasPendentes(matriculas));

      setResumo(function (atual) {
        return { ...atual, media, pendentes };
      });

      setUltimaAtualizacao(horarioAtual());
    } catch (erro) {
      // O original parava aqui com a tela como estava.
      if (!signal.aborted) console.error('Erro ao carregar o Dashboard:', erro);
    }
  }, []);

  // =============================
  // CARREGAR PARTICIPANTES
  // =============================

  const carregarParticipantes = useCallback(async function (id) {
    if (!vivo.current) return;

    cargaLista.current?.abort();
    const controle = new AbortController();
    cargaLista.current = controle;

    if (!id) {
      setLista(LISTA_SELECIONE);

      return;
    }

    setLista(LISTA_CARREGANDO);

    try {
      const resultado = await buscarParticipantes(id, controle.signal);
      if (controle.signal.aborted) return;

      setLista(resultado);
    } catch (erro) {
      // O original parava aqui com "Carregando participantes..." na tela.
      if (!controle.signal.aborted) console.error('Erro ao carregar participantes:', erro);
    }
  }, []);

  // =============================
  // INICIAR DASHBOARD
  // =============================

  useEffect(() => {
    vivo.current = true;

    carregarDashboard();

    return () => {
      vivo.current = false;
      cargaDashboard.current?.abort();
      cargaLista.current?.abort();
    };
  }, [carregarDashboard]);

  // =============================
  // SELECIONAR CURSO
  // =============================

  function aoTrocarCurso(evento) {
    const id = evento.target.value;

    cursoAtual.current = id;
    setCursoId(id);

    carregarParticipantes(id);
  }

  // =============================
  // MODAL
  // =============================

  function aoAtender(idMatricula) {
    setMatriculaSelecionada(idMatricula);
    setModalAberto(true);
  }

  function aoCancelar() {
    setMatriculaSelecionada(null);
    setModalAberto(false);
  }

  // =============================
  // CONFIRMAR STATUS
  // =============================

  async function aoConfirmar() {
    const id = matriculaSelecionada;

    if (!id) return;

    setAlterando(true);

    let erro = null;

    try {
      const { error } = await marcarAtendido(id);
      erro = error;
    } catch (falha) {
      erro = falha;
    }

    // Saiu da página no meio: sem alert nem setState.
    if (!vivo.current) return;

    if (erro) {
      console.error('Erro ao alterar status:', erro);

      window.alert('Não foi possível alterar o status.');
    } else {
      // Fecha o modal
      setModalAberto(false);

      // Atualiza os cards
      await carregarParticipantes(cursoAtual.current);

      // Atualiza o número de pendentes
      await carregarDashboard();
    }

    if (!vivo.current) return;

    setAlterando(false);

    // Sucesso: zera a seleção, a menos que outra matrícula já tenha sido escolhida enquanto as
    // listas recarregavam. Erro: a seleção fica, para "Confirmar" tentar de novo.
    if (!erro) {
      setMatriculaSelecionada(function (atual) {
        return atual === id ? null : atual;
      });
    }
  }

  return (
    <main className="container">
      <div id="mensagemAcesso" className={classeMensagem(acesso)}>
        {MENSAGENS[acesso] ?? MENSAGENS.verificando}
      </div>

      <section id="conteudoDashboard" className={acesso === 'autorizado' ? undefined : 'oculto'}>
        <div className="cabecalho-secao">
          <h2>Resumo geral</h2>
          <button
            id="botaoAtualizar"
            onClick={function () {
              carregarDashboard();
            }}
          >
            Atualizar dados
          </button>
        </div>

        <section className="cards">
          <CardResumo icone="👥" rotulo="Total de pessoas inscritas" id="totalPessoas" valor={resumo.total} />

          <CardResumo icone="📚" rotulo="Curso mais popular" id="cursoPopular" valor={resumo.popular} />

          <CardResumo icone="🎂" rotulo="Média de idade" id="mediaIdade" valor={resumo.media} />

          <CardResumo icone="⏳" rotulo="Matrículas pendentes" id="matriculasPendentes" valor={resumo.pendentes} />
        </section>

        <section className="painel">
          <h2>Informações do sistema</h2>

          <div className="informacoes">
            <p>
              <strong>Última atualização:</strong>{' '}
              <span id="ultimaAtualizacao">{ultimaAtualizacao}</span>
            </p>

            <p>
              <strong>Status:</strong> <span className="status-online">Sistema conectado</span>
            </p>
          </div>
        </section>
      </section>

      {/* Fica fora do #conteudoDashboard: aparece sempre, como no original */}
      <section className="secao-matriculas">
        <div className="titulo-secao">
          <div>
            <span className="subtitulo">GERENCIAMENTO</span>
            <h2>Matrículas</h2>
          </div>
        </div>

        <div className="seletor-curso">
          <label htmlFor="selectCurso">Selecione o curso:</label>

          <select id="selectCurso" value={cursoId} onChange={aoTrocarCurso}>
            <option value="">Selecione um curso</option>

            {cursos.map((curso, indice) => (
              <option key={curso.id ?? `indice-${indice}`} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
        </div>

        <ListaParticipantes lista={lista} aoAtender={aoAtender} />
      </section>

      {/* MODAL */}
      <ModalStatus
        aberto={modalAberto}
        alterando={alterando}
        aoCancelar={aoCancelar}
        aoConfirmar={aoConfirmar}
      />
    </main>
  );
}
