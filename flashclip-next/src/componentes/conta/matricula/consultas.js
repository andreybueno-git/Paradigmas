// =========================
// MATRÍCULA: CONSULTAS
// =========================
//
// Porte de carregarCurso() e confirmarMatricula() do js/matricula.js: mesmas consultas ao
// Supabase, na mesma ordem, com as mesmas mensagens e os mesmos registros no console. Em vez de
// mexer na tela, cada função devolve o que mostrar; quem cuida da tela é ConfirmacaoMatricula.
// Só rodam no navegador (efeito ou clique), nunca no servidor.
//
import { clienteSupabase } from '@/lib/supabase';
import { carregarDadosCursos, carregarDadosVagas } from '@/lib/dados';
import { montarCard, normalizarPeriodo } from './curso';

// =========================
// CARREGAR CURSO
// =========================
//
// Devolve { curso, card } (curso = o cursoAtual do original; card = os textos do cartão) ou
// { erro } com a mensagem que vai no lugar do cartão.

export async function buscarCurso(cursoId) {
  if (!cursoId || !Number.isSafeInteger(Number(cursoId)) || Number(cursoId) <= 0) {
    return { erro: 'Curso não encontrado. Volte ao evento e selecione um curso válido.' };
  }

  try {
    // =========================
    // BUSCAR CURSO NO SUPABASE
    // =========================

    const { data: cursoBanco, error } = await clienteSupabase
      .from('cursos')
      .select('*')
      .eq('idCurso', Number(cursoId))
      .single();

    if (error) {
      throw error;
    }

    if (!cursoBanco) {
      return { erro: 'Curso não encontrado.' };
    }

    // =========================
    // BUSCAR DADOS COMPLEMENTARES
    // =========================

    let cursoCatalogo = null;
    let vagasAtualizadas;

    try {
      const cursos = await carregarDadosCursos();

      cursoCatalogo =
        (cursos || []).find(function (curso) {
          return Number(curso.idCurso) === Number(cursoId);
        }) || null;
    } catch (erro) {
      console.warn('Não foi possível carregar os dados complementares:', erro);
    }

    try {
      const vagas = await carregarDadosVagas();

      if (vagas && vagas[cursoId] !== undefined && vagas[cursoId] !== null) {
        vagasAtualizadas = vagas[cursoId];
      }
    } catch (erro) {
      console.warn('Não foi possível atualizar as vagas:', erro);
    }

    // =========================
    // COMBINAR OS DADOS
    // =========================

    const cursoAtual = {
      ...(cursoCatalogo || {}),
      ...cursoBanco,

      imagem: cursoBanco.imagem || cursoCatalogo?.imagem || '',

      ministrantes: cursoCatalogo?.ministrantes ?? cursoBanco.ministrantes ?? [],

      vagas: cursoBanco.vagas ?? vagasAtualizadas ?? cursoCatalogo?.vagas,
    };

    // O período é necessário para a validação,
    // mas não será exibido no cartão.
    if (!normalizarPeriodo(cursoAtual.periodo)) {
      return { erro: 'Não foi possível identificar o período deste curso.' };
    }

    return { curso: cursoAtual, card: montarCard(cursoAtual) };
  } catch (erro) {
    console.error('Erro ao buscar curso:', erro);

    return { erro: 'Não foi possível carregar os dados do curso. Tente novamente.' };
  }
}

// =========================
// CONFIRMAR MATRÍCULA
// =========================
//
// Devolve { login: true } (sem sessão: avisar e ir para o login), { concluida: true } ou
// { texto, tipo } com a mensagem do card ('erro' ou 'aviso').

function mensagem(texto, tipo = 'erro') {
  return { texto, tipo };
}

// A relação cursos pode vir como objeto ou como lista.
function cursoDaMatricula(matricula) {
  return Array.isArray(matricula.cursos) ? matricula.cursos[0] : matricula.cursos;
}

export async function realizarMatricula(cursoAtual, cursoId) {
  try {
    // =========================
    // VERIFICAR LOGIN
    // =========================

    const { data: dadosSessao, error: erroSessao } = await clienteSupabase.auth.getSession();

    if (erroSessao) {
      throw erroSessao;
    }

    const session = dadosSessao.session;

    if (!session) {
      return { login: true };
    }

    // =========================
    // BUSCAR USUÁRIO
    // =========================

    const { data: usuario, error: erroUsuario } = await clienteSupabase
      .from('usuarios')
      .select('idUsuario')
      .eq('email', session.user.email)
      .maybeSingle();

    if (erroUsuario) {
      console.error('Erro ao buscar usuário:', erroUsuario);

      return mensagem('Não foi possível identificar seu usuário. Tente novamente.');
    }

    if (!usuario) {
      return mensagem('Seu cadastro não foi localizado. Entre novamente ou contate o suporte.');
    }

    const usuarioId = usuario.idUsuario;

    // =========================
    // VALIDAR PERÍODO
    // =========================

    const periodoAtual = normalizarPeriodo(cursoAtual.periodo);

    if (!periodoAtual) {
      return mensagem('Não foi possível identificar o período deste curso.');
    }

    // =========================
    // VERIFICAR VAGAS
    // =========================
    // Com o valor lido ao abrir a página (não consulta de novo, como no original).

    if (cursoAtual.vagas === null || cursoAtual.vagas === undefined || !Number.isFinite(Number(cursoAtual.vagas))) {
      return mensagem('Não foi possível confirmar a disponibilidade de vagas. Tente novamente.', 'aviso');
    }

    if (Number(cursoAtual.vagas) <= 0) {
      return mensagem('Este curso não possui mais vagas. Escolha outro curso.', 'aviso');
    }

    // =========================
    // BUSCAR MATRÍCULAS EXISTENTES
    // =========================

    const { data: matriculas, error: erroMatriculas } = await clienteSupabase
      .from('matriculas')
      .select(
        `
        idMatricula,
        idCurso,
        cursos (
          periodo
        )
      `,
      )
      .eq('idUsuario', usuarioId);

    if (erroMatriculas) {
      console.error('Erro ao buscar matrículas:', erroMatriculas);

      throw erroMatriculas;
    }

    const listaMatriculas = matriculas || [];

    // =========================
    // VALIDAR DADOS EXISTENTES
    // =========================

    const possuiPeriodoIndefinido = listaMatriculas.some(function (matricula) {
      return !normalizarPeriodo(cursoDaMatricula(matricula)?.periodo);
    });

    if (possuiPeriodoIndefinido) {
      return mensagem(
        'Não foi possível verificar todas as suas matrículas. Atualize a página e tente novamente.',
        'aviso',
      );
    }

    // =========================
    // VERIFICAR CONFLITO
    // =========================

    const jaMatriculado = listaMatriculas.some(function (matricula) {
      return normalizarPeriodo(cursoDaMatricula(matricula).periodo) === periodoAtual;
    });

    if (jaMatriculado) {
      return mensagem(
        'Você já possui uma matrícula neste período. Cada aluno pode se inscrever em apenas um curso por período.',
        'aviso',
      );
    }

    // =========================
    // REALIZAR MATRÍCULA
    // =========================

    const { error: erroInsercao } = await clienteSupabase.from('matriculas').insert({
      idUsuario: usuarioId,
      idCurso: Number(cursoId),
      dataInscricao: new Date().toISOString(),
    });

    // =========================
    // VERIFICAR ERRO DA INSERÇÃO
    // =========================
    // As duas mensagens vêm das regras do banco; o casamento é por trecho do texto.

    if (erroInsercao) {
      console.error('Erro retornado pelo Supabase:', erroInsercao);

      const mensagemErro = String(erroInsercao.message || '').toLowerCase();

      if (mensagemErro.includes('você já possui uma matrícula neste período'.toLowerCase())) {
        return mensagem(
          'Você já possui uma matrícula neste período. Não é possível se inscrever em outro curso agora.',
          'aviso',
        );
      }

      if (mensagemErro.includes('não há vagas disponíveis para este curso'.toLowerCase())) {
        return mensagem('As vagas deste curso se esgotaram. Escolha outro curso.', 'aviso');
      }

      throw erroInsercao;
    }

    // =========================
    // MATRÍCULA CONCLUÍDA
    // =========================

    return { concluida: true };
  } catch (erro) {
    console.error('Erro ao realizar matrícula:', erro);

    return mensagem('Não foi possível realizar sua matrícula. Verifique sua conexão e tente novamente.');
  }
}
