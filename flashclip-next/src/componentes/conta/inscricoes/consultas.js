// =========================
// MINHAS INSCRIÇÕES: CONSULTAS
// =========================
//
// Porte de carregarInscricoes() do js/inscricoes.js: mesma sessão, mesmas consultas, mesma ordem
// (inscrição mais recente primeiro), mesmos textos e padrões. Em vez de escrever no
// #listaInscricoes, devolve o que mostrar; quem cuida da tela é ListaInscricoes.
// Só roda no navegador (dentro do efeito), nunca no servidor.
//
import { clienteSupabase } from '@/lib/supabase';
import { asset } from '@/lib/caminho';

export const IMAGEM_CURSO_PADRAO = asset('/imagens/curso-padrao.png');

// ===============================
// MONTAR CAMINHO DA IMAGEM
// ===============================

function montarImagem(caminho) {
  if (!caminho || typeof caminho !== 'string' || !caminho.trim()) {
    return IMAGEM_CURSO_PADRAO;
  }

  const valor = caminho.trim();

  if (/^https?:\/\//i.test(valor)) {
    return valor;
  }

  const nomeArquivo = valor.replace(/^(?:\.\.\/|\.\/)?imagens\//i, '').replace(/^\/+/, '');

  return asset(`/imagens/${nomeArquivo}`);
}

// ===============================
// FORMATAR DATA
// ===============================

function formatarData(data) {
  if (!data) {
    return 'Não informada';
  }

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return 'Não informada';
  }

  return dataConvertida.toLocaleDateString('pt-BR');
}

// Texto como o escaparHTML do original o imprimia (null/undefined viram vazio).
function texto(valor) {
  return String(valor ?? '');
}

// ===============================
// ESTADOS DA PÁGINA
// ===============================
// tipo: 'erro' (ícone "!"), 'vazio' (ícone "✦") ou 'normal' (ícone "i").

function estado(titulo, descricao, tipo = 'normal') {
  return { estado: { titulo, descricao, tipo } };
}

// ===============================
// BUSCAR INSCRIÇÕES
// ===============================
//
// Devolve { login: true } (sem sessão), { estado: { titulo, descricao, tipo } } ou
// { inscricoes: [...] } com os textos de cada card.

export async function buscarInscricoes() {
  try {
    // ===============================
    // VERIFICAR LOGIN
    // ===============================

    const { data: dadosSessao, error: erroSessao } = await clienteSupabase.auth.getSession();

    if (erroSessao) {
      throw erroSessao;
    }

    const session = dadosSessao.session;

    if (!session) {
      return { login: true };
    }

    // ===============================
    // BUSCAR USUÁRIO
    // ===============================

    const { data: usuario, error: erroUsuario } = await clienteSupabase
      .from('usuarios')
      .select('idUsuario')
      .eq('email', session.user.email)
      .maybeSingle();

    if (erroUsuario) {
      throw erroUsuario;
    }

    if (!usuario) {
      return estado(
        'Não foi possível identificar sua conta',
        'Seu perfil não foi localizado. Entre novamente ou contate o suporte.',
        'erro',
      );
    }

    // ===============================
    // BUSCAR MATRÍCULAS
    // ===============================

    const { data: matriculas, error } = await clienteSupabase
      .from('matriculas')
      .select(
        `
        idMatricula,
        dataInscricao,
        idCurso,
        cursos (
          nome,
          descricao,
          periodo,
          sala,
          imagem
        )
      `,
      )
      .eq('idUsuario', usuario.idUsuario)
      .order('dataInscricao', {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    // ===============================
    // NENHUMA INSCRIÇÃO
    // ===============================

    if (!matriculas || matriculas.length === 0) {
      return estado(
        'Você ainda não tem inscrições',
        'Explore os cursos do evento e encontre uma nova oportunidade para aprender.',
        'vazio',
      );
    }

    // ===============================
    // MONTAR OS CARDS
    // ===============================

    const inscricoes = [];

    matriculas.forEach(function (matricula, indice) {
      const curso = Array.isArray(matricula.cursos) ? matricula.cursos[0] : matricula.cursos;

      if (!curso) {
        console.warn('Curso não encontrado para a matrícula:', matricula.idMatricula);
        return;
      }

      inscricoes.push({
        chave: matricula.idMatricula ?? `indice-${indice}`,
        nome: texto(curso.nome || 'Curso sem nome'),
        descricao: texto(curso.descricao || 'Sem descrição disponível.'),
        periodo: texto(curso.periodo || 'Não informado'),
        sala: texto(curso.sala ?? 'A definir'),
        dataInscricao: formatarData(matricula.dataInscricao),
        imagem: montarImagem(curso.imagem),
      });
    });

    // Verifica se algum card foi montado.
    if (!inscricoes.length) {
      return estado(
        'Não foi possível mostrar suas inscrições',
        'Os cursos relacionados às matrículas não foram encontrados. Tente novamente mais tarde.',
        'erro',
      );
    }

    return { inscricoes };
  } catch (erro) {
    console.error('Erro ao carregar inscrições:', erro);

    return estado('Não foi possível carregar suas inscrições', 'Verifique sua conexão e tente novamente.', 'erro');
  }
}
