// =========================
// MATRÍCULA: FUNÇÕES PURAS
// =========================
//
// Porte das funções auxiliares de js/matricula.js, sem React e sem Supabase. As imagens saem com o
// basePath (asset), no lugar do "../imagens/" relativo do original.
//
import { asset } from '@/lib/caminho';

// =========================
// CONFIGURAÇÕES
// =========================

export const DURACAO_PADRAO = '3 horas';
export const IMAGEM_CURSO_PADRAO = asset('/imagens/curso-padrao.png');
export const IMAGEM_INSTRUTOR_PADRAO = asset('/imagens/usuario-padrao.png');

// =========================
// NORMALIZAR PERÍODO
// =========================

export function normalizarPeriodo(valor) {
  const periodo = String(valor ?? '')
    .trim()
    .toLowerCase();

  // Ex.: 2026/02, 2026/2 e 2026-2.
  const correspondencia = periodo.match(/^(\d{4})\s*[/.-]\s*0*(\d{1,2})$/);

  if (correspondencia) {
    const ano = correspondencia[1];
    const etapa = Number(correspondencia[2]);

    if (etapa >= 1 && etapa <= 12) {
      return `${ano}/${etapa}`;
    }
  }

  return periodo.replace(/\s+/g, ' ');
}

// =========================
// MONTAR CAMINHO DA IMAGEM
// =========================

export function montarImagem(caminho, imagemPadrao) {
  if (!caminho || typeof caminho !== 'string' || !caminho.trim()) {
    return imagemPadrao;
  }

  const valor = caminho.trim();

  if (/^https?:\/\//i.test(valor)) {
    return valor;
  }

  const nomeArquivo = valor.replace(/^(?:\.\.\/|\.\/)?imagens\//i, '').replace(/^\/+/, '');

  return asset(`/imagens/${nomeArquivo}`);
}

// =========================
// QUANTIDADE DE INSTRUTORES
// =========================

export function formatarQuantidadeInstrutores(quantidade) {
  return quantidade === 1 ? '1 instrutor' : `${quantidade} instrutores`;
}

// =========================
// DADOS PARA O CARD
// =========================
//
// Os mesmos valores (e os mesmos padrões) que o original escrevia no innerHTML de #curso, já como
// texto. Fica fora do componente para que um dado estranho caia no "Não foi possível carregar os
// dados do curso", como antes, em vez de quebrar a página.

// Texto como o escaparHTML do original o imprimia (null/undefined viram vazio).
function texto(valor) {
  return String(valor ?? '');
}

// O nome vem de instrutor.nome / nomeCompleto / nomeInstrutor, como no original. O catálogo de
// dados.js guarda o nome em instrutor.usuarios.nome, então hoje aparece "Instrutor do curso".
function nomeDoInstrutor(instrutor) {
  return instrutor.nome || instrutor.nomeCompleto || instrutor.nomeInstrutor || 'Instrutor do curso';
}

export function montarCard(cursoAtual) {
  // =========================
  // INSTRUTORES
  // =========================

  const instrutores = Array.isArray(cursoAtual.ministrantes) ? cursoAtual.ministrantes : [];

  const instrutoresVisiveis = instrutores.slice(0, 4);

  // Sem instrutores: um avatar padrão, sem texto alternativo e sem carregamento tardio.
  const avatares = instrutoresVisiveis.length
    ? instrutoresVisiveis.map(function (instrutor, indice) {
        return {
          chave: indice,
          src: montarImagem(instrutor.referenciaFoto, IMAGEM_INSTRUTOR_PADRAO),
          alt: texto(nomeDoInstrutor(instrutor)),
          carregamento: 'lazy',
        };
      })
    : [{ chave: 'padrao', src: IMAGEM_INSTRUTOR_PADRAO, alt: '', carregamento: undefined }];

  const primeiroInstrutor = instrutores[0];

  const nomePrimeiroInstrutor = primeiroInstrutor ? nomeDoInstrutor(primeiroInstrutor) : 'Nenhum instrutor cadastrado';

  return {
    imagem: montarImagem(cursoAtual.imagem, IMAGEM_CURSO_PADRAO),
    nome: texto(cursoAtual.nome || 'Curso sem nome'),
    descricao: texto(cursoAtual.descricao || 'Sem descrição disponível.'),
    status: texto(cursoAtual.status || 'Não informado'),
    duracao: texto(cursoAtual.duracao || cursoAtual['duração'] || DURACAO_PADRAO),
    sala: texto(cursoAtual.sala ?? 'A definir'),
    vagas: texto(cursoAtual.vagas ?? 'Não informado'),
    avatares,
    nomePrimeiroInstrutor: texto(nomePrimeiroInstrutor),
    quantidadeInstrutores: formatarQuantidadeInstrutores(instrutores.length),
  };
}
