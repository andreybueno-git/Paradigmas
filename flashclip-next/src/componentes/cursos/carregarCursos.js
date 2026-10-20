// Sessão, matrícula no período e dados dos cursos para os cards (porte de js/carregarCardsCursos.js).
// Em vez de escrever HTML na lista, devolve o que cada card mostra; quem desenha é <ListaCursos>.
// Mesmas consultas, mesmos textos e a mesma ordem de decisão do botão de inscrição.
import { clienteSupabase } from '@/lib/supabase';
import { carregarDadosCursos, carregarDadosVagas } from '@/lib/dados';

// =========================
// CONFIGURAÇÕES
// =========================

const PERIODO_ATUAL = '2026/02';

const LIMITE_INSTRUTORES = 4;

// Rotas do Next (com barra no fim). O parâmetro continua sendo ?id=, como na matrícula original.
const CAMINHO_MATRICULA = '/matricula/';
const CAMINHO_LOGIN = '/login/';

// =========================
// FUNÇÃO PARA IMAGEM
// =========================

function montarImagem(caminho, caminhoImagens) {
  if (!caminho || caminho.trim() === '') {
    return null;
  }

  const valor = caminho.trim();

  if (valor.startsWith('http://') || valor.startsWith('https://')) {
    return valor;
  }

  return `${caminhoImagens}${valor.replace(/^\.\/imagens\//, '')}`;
}

// =========================
// MATRÍCULAS DO USUÁRIO
// =========================
// A matrícula é sempre consultada direto no Supabase (sem cache).

async function verificarInscricao() {
  const {
    data: { session },
  } = await clienteSupabase.auth.getSession();

  let temMatriculaNoPeriodo = false;

  let erroAoVerificarMatriculas = false;

  if (session) {
    const emailUsuario = session.user.email;

    // =========================
    // BUSCAR USUÁRIO
    // =========================

    const { data: usuario, error: erroUsuario } = await clienteSupabase
      .from('usuarios')
      .select('idUsuario')
      .eq('email', emailUsuario)
      .single();

    if (erroUsuario) {
      console.error('Erro ao buscar usuário:', erroUsuario);

      erroAoVerificarMatriculas = true;
    } else {
      // =========================
      // BUSCAR MATRÍCULAS
      // =========================

      const { data: matriculas, error: erroMatriculas } = await clienteSupabase
        .from('matriculas')
        .select(
          `
            idCurso,
            cursos (
              periodo
            )
          `,
        )
        .eq('idUsuario', usuario.idUsuario);

      if (erroMatriculas) {
        console.error('Erro ao buscar matrículas:', erroMatriculas);

        erroAoVerificarMatriculas = true;
      } else {
        // =========================
        // VERIFICAR MATRÍCULA
        // NO PERÍODO ATUAL
        // =========================

        const matriculasPeriodoAtual = (matriculas || []).filter(function (matricula) {
          if (!matricula.cursos) {
            return false;
          }

          const periodoMatricula = String(matricula.cursos.periodo).trim().toLowerCase();

          return periodoMatricula === PERIODO_ATUAL.trim().toLowerCase();
        });

        // =========================
        // USUÁRIO JÁ TEM MATRÍCULA
        // =========================

        temMatriculaNoPeriodo = matriculasPeriodoAtual.length > 0;
      }
    }
  }

  return {
    logado: Boolean(session),
    email: session ? session.user.email ?? null : null,
    temMatriculaNoPeriodo,
    erroAoVerificarMatriculas,
  };
}

// =========================
// BOTÃO DO CARD
// =========================
// Atenção: `vagas <= 0` é literal de propósito (null <= 0 é true, undefined <= 0 é false).

function acaoInscricao(curso, inscricao) {
  // =========================
  // USUÁRIO LOGADO
  // =========================

  if (inscricao.logado) {
    if (inscricao.erroAoVerificarMatriculas) {
      return { classe: 'curso-matriculado', texto: 'Não foi possível verificar sua inscrição' };
    }

    if (curso.vagas <= 0) {
      return { classe: 'vagas-esgotadas', texto: 'Vagas esgotadas' };
    }

    if (inscricao.temMatriculaNoPeriodo) {
      return { classe: 'curso-matriculado', texto: 'Você já está inscrito em um curso' };
    }

    return {
      classe: 'botao-curso',
      texto: 'Inscrever-se',
      href: `${CAMINHO_MATRICULA}?id=${encodeURIComponent(curso.idCurso)}`,
    };
  }

  // =========================
  // USUÁRIO NÃO LOGADO
  // =========================

  if (curso.vagas <= 0) {
    return { classe: 'vagas-esgotadas', texto: 'Vagas esgotadas' };
  }

  return { classe: 'botao-curso', texto: 'Entrar para se inscrever', href: CAMINHO_LOGIN };
}

// =========================
// DADOS DE UM CARD
// =========================
// Os campos entravam crus no innerHTML (null aparecia como "null"): String() mantém esse texto.

function montarCard(curso, indice, inscricao, caminhoImagens) {
  const ministrantes = curso.ministrantes || [];

  const quantidadeInstrutores = ministrantes.length;

  const avatares = ministrantes.slice(0, LIMITE_INSTRUTORES).map(function (ministrante) {
    return montarImagem(ministrante.referenciaFoto, caminhoImagens) || `${caminhoImagens}usuario-padrao.png`;
  });

  let textoInstrutores = 'Nenhum instrutor';

  if (quantidadeInstrutores === 1) {
    textoInstrutores = '1 instrutor';
  } else if (quantidadeInstrutores > 1) {
    textoInstrutores = `${quantidadeInstrutores} instrutores`;
  }

  // Sala ausente deve ter um rótulo legível no cartão.
  const sala = String(curso.sala ?? '').trim();
  const salaExibida = /^(?:null|undefined)?$/i.test(sala) ? 'A definir' : sala;

  return {
    chave: `${indice}-${curso.idCurso}`,
    nomeNotebook: curso.nome,
    status: String(curso.status),
    nome: String(curso.nome),
    descricao: String(curso.descricao),
    sala: salaExibida,
    vagas: String(curso.vagas),
    avatares,
    restantes: quantidadeInstrutores - LIMITE_INSTRUTORES,
    textoInstrutores,
    acao: acaoInscricao(curso, inscricao),
  };
}

// =========================
// CARREGAR CURSOS
// =========================
// Resultado: { tipo: 'pronto', email, cards } | { tipo: 'vazio' } | { tipo: 'erro' }
// (email = e-mail da sessão usada para decidir os botões, ou null sem sessão).
// Como no original, qualquer exceção vira "Erro ao carregar os cursos." (nunca rejeita).
// A sessão e os dados são buscados ao mesmo tempo; o resultado final é o mesmo da ordem em série.

export async function carregarCursos({ limite = 11, caminhoImagens = '/imagens/' } = {}) {
  try {
    const [inscricao, cursos, vagas] = await Promise.all([
      verificarInscricao(),
      carregarDadosCursos(),
      carregarDadosVagas(),
    ]);

    // =========================
    // ATUALIZAR VAGAS
    // =========================
    // Sem mexer no objeto que veio do cache.

    const cursosAtualizados = cursos.map(function (curso) {
      return vagas[curso.idCurso] !== undefined ? { ...curso, vagas: vagas[curso.idCurso] } : curso;
    });

    // =========================
    // NENHUM CURSO
    // =========================

    if (cursosAtualizados.length === 0) {
      return { tipo: 'vazio' };
    }

    // =========================
    // LIMITE
    // =========================

    const cursosExibidos = limite ? cursosAtualizados.slice(0, limite) : cursosAtualizados;

    return {
      tipo: 'pronto',
      email: inscricao.email,
      cards: cursosExibidos.map(function (curso, indice) {
        return montarCard(curso, indice, inscricao, caminhoImagens);
      }),
    };
  } catch (erro) {
    console.error('Erro ao carregar cursos:', erro);

    return { tipo: 'erro' };
  }
}
