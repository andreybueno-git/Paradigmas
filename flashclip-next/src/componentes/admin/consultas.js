// =========================
// PAINEL ADMINISTRATIVO: CONSULTAS
// =========================
//
// Porte das consultas do admin/admin.js: mesmas tabelas, mesmas colunas, mesmos filtros e a mesma
// única escrita (status "Atendido"). Em vez de escrever nos elementos da página, cada função
// devolve o resultado; quem cuida da tela é o PainelAdmin.
//
// O cliente é o mesmo do resto do site (@/lib/supabase), então a sessão é a do login. Antes o
// admin criava um cliente próprio com a mesma URL e a mesma chave.
//
// As leituras recebem um AbortSignal: uma carga nova (ou sair da página) cancela a anterior.
// Cancelada, a consulta volta com error (não lança); quem chamou confere signal.aborted.
//
// Atenção ao esquema: o admin usa usuarios.id (o UUID do login), cursos.id, matriculas.id e
// matriculas.status, enquanto o resto do site usa idUsuario, idCurso e idMatricula. Mantido
// igual ao original de propósito (ver README, "Colunas divergentes no painel administrativo").
//
import { clienteSupabase } from '@/lib/supabase';

// =============================
// VERIFICAR ADMINISTRADOR
// =============================
//
// Devolve 'sem-sessao', 'erro-permissao', 'negado' ou 'autorizado'.

export async function verificarAdministrador(signal) {
  const {
    data: { session },
    error,
  } = await clienteSupabase.auth.getSession();

  if (error || !session) {
    return 'sem-sessao';
  }

  const usuarioId = session.user.id;

  const { data: usuario, error: erroUsuario } = await clienteSupabase
    .from('usuarios')
    .select('permissao')
    .eq('id', usuarioId)
    .abortSignal(signal)
    .single();

  if (erroUsuario || !usuario) {
    return 'erro-permissao';
  }

  // Comparação estrita, como no original: a string "true" não passa.
  if (usuario.permissao !== true) {
    return 'negado';
  }

  return 'autorizado';
}

// =============================
// CURSOS DO SELECT
// =============================

export function buscarCursos(signal) {
  return clienteSupabase.from('cursos').select('id, nome').order('nome').abortSignal(signal);
}

// =============================
// MATRÍCULAS (RESUMO GERAL)
// =============================

export function buscarMatriculas(signal) {
  return clienteSupabase
    .from('matriculas')
    .select(
      `
      idUsuario,
      idCurso,
      status,
      cursos (
        nome
      )
    `,
    )
    .abortSignal(signal);
}

// =============================
// IDADES (MÉDIA)
// =============================

export function buscarIdades(idsUsuarios, signal) {
  return clienteSupabase.from('usuarios').select('id, idade').in('id', idsUsuarios).abortSignal(signal);
}

// =============================
// PARTICIPANTES DE UM CURSO
// =============================
//
// Devolve { estado } com 'erro-matriculas', 'vazio' ou 'erro-usuarios', ou
// { estado: 'lista', itens: [{ matricula, usuario }] } na ordem em que o banco devolveu as
// matrículas. Matrícula sem usuário encontrado fica de fora, sem aviso (como no original).

export async function buscarParticipantes(cursoId, signal) {
  // =============================
  // BUSCAR MATRÍCULAS DO CURSO
  // =============================

  const { data: matriculas, error: erroMatriculas } = await clienteSupabase
    .from('matriculas')
    .select('id, idUsuario, status')
    .eq('idCurso', cursoId)
    .abortSignal(signal);

  if (signal.aborted) return null;

  if (erroMatriculas) {
    console.error('Erro ao carregar matrículas:', erroMatriculas);

    return { estado: 'erro-matriculas' };
  }

  // =============================
  // NENHUMA MATRÍCULA
  // =============================

  if (!matriculas || matriculas.length === 0) {
    return { estado: 'vazio' };
  }

  // =============================
  // BUSCAR USUÁRIOS
  // =============================

  const idsUsuarios = matriculas.map(function (matricula) {
    return matricula.idUsuario;
  });

  const { data: usuarios, error: erroUsuarios } = await clienteSupabase
    .from('usuarios')
    .select('id, nome, idade, email, telefone')
    .in('id', idsUsuarios)
    .abortSignal(signal);

  if (signal.aborted) return null;

  if (erroUsuarios) {
    console.error('Erro ao carregar usuários:', erroUsuarios);

    return { estado: 'erro-usuarios' };
  }

  // =============================
  // UM CARD POR MATRÍCULA
  // =============================

  const itens = [];

  matriculas.forEach(function (matricula) {
    const usuario = (usuarios || []).find(function (usuario) {
      return usuario.id === matricula.idUsuario;
    });

    if (!usuario) return;

    itens.push({ matricula, usuario });
  });

  return { estado: 'lista', itens };
}

// =============================
// MARCAR COMO ATENDIDO
// =============================
//
// A única escrita do painel. Sem .select(), como no original: se o RLS bloquear, o Supabase
// responde sucesso com 0 linhas e o card recarregado continua "Pendente". Não é cancelável
// (uma escrita já enviada não deve ser abandonada no meio).

export function marcarAtendido(idMatricula) {
  return clienteSupabase
    .from('matriculas')
    .update({
      status: 'Atendido',
    })
    .eq('id', idMatricula);
}
