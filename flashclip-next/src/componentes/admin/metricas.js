// =========================
// PAINEL ADMINISTRATIVO: MÉTRICAS
// =========================
//
// As contas do carregarDashboard() do admin/admin.js, em funções puras (sem Supabase nem React).
// Mesmas regras e mesmos textos do original.
//

// Valores do HTML original (antes da primeira carga e quando não há matrículas).
export const RESUMO_INICIAL = {
  total: '0',
  popular: 'Nenhum',
  media: '0 anos',
  pendentes: '0',
};

// =============================
// TOTAL DE PESSOAS
// =============================
//
// Pessoas distintas com alguma matrícula (não o total de usuários cadastrados).

export function pessoasInscritas(matriculas) {
  const pessoas = new Set();

  matriculas.forEach(function (matricula) {
    pessoas.add(matricula.idUsuario);
  });

  return Array.from(pessoas);
}

// =============================
// CURSO MAIS POPULAR
// =============================
//
// Conta pelo nome do curso. Vence o primeiro que for estritamente maior na ordem das chaves do
// objeto (empate fica com o que apareceu antes). O curso pode vir como objeto ou como lista de
// um item; o original só tratava o objeto.

export function cursoMaisPopular(matriculas) {
  const quantidadePorCurso = {};

  matriculas.forEach(function (matricula) {
    const curso = Array.isArray(matricula.cursos) ? matricula.cursos[0] : matricula.cursos;

    if (!curso) return;

    const nomeCurso = curso.nome;

    if (!quantidadePorCurso[nomeCurso]) {
      quantidadePorCurso[nomeCurso] = 0;
    }

    quantidadePorCurso[nomeCurso]++;
  });

  let nomeCursoPopular = 'Nenhum';

  let maiorQuantidade = 0;

  for (const nomeCurso in quantidadePorCurso) {
    if (quantidadePorCurso[nomeCurso] > maiorQuantidade) {
      maiorQuantidade = quantidadePorCurso[nomeCurso];

      nomeCursoPopular = nomeCurso;
    }
  }

  return nomeCursoPopular;
}

// =============================
// MÉDIA DE IDADE
// =============================
//
// Média por pessoa, só de quem tem idade. Ponto decimal, como o original ("21.5 anos").

export function mediaDeIdade(usuarios) {
  let somaIdades = 0;

  let quantidadeIdades = 0;

  (usuarios || []).forEach(function (usuario) {
    if (usuario.idade !== null && usuario.idade !== undefined) {
      somaIdades += Number(usuario.idade);

      quantidadeIdades++;
    }
  });

  if (quantidadeIdades > 0) {
    const media = somaIdades / quantidadeIdades;

    return `${media.toFixed(1)} anos`;
  }

  return 'Não disponível';
}

// =============================
// MATRÍCULAS PENDENTES
// =============================
//
// Só o status "Pendente" exato conta (status vazio não conta aqui, embora a lista o mostre como
// "Pendente"; igual ao original).

export function matriculasPendentes(matriculas) {
  return matriculas.filter(function (matricula) {
    return matricula.status === 'Pendente';
  }).length;
}

// =============================
// HORÁRIO
// =============================

export function horarioAtual() {
  return new Date().toLocaleString('pt-BR');
}
