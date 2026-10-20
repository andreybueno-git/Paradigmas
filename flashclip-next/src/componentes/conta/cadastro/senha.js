// =========================
// FORÇA DA SENHA
// =========================
//
// Funções puras copiadas do js/cadastro.js (mesmas regras, textos e contagens). O medidor
// (MedidorSenha.jsx) só desenha o resultado, e a validação do envio usa as pendências.
//

// =========================
// AVALIAR FORÇA E CONTAGEM DA SENHA
// =========================

export function avaliarForcaSenha(valor) {
  // Conta caracteres Unicode de forma consistente
  const caracteres = Array.from(valor);
  const quantidadeCaracteres = caracteres.length;

  // Quantidade exata de cada tipo de caractere
  const maiusculas = caracteres.filter((caractere) =>
    /\p{Lu}/u.test(caractere),
  ).length;

  const minusculas = caracteres.filter((caractere) =>
    /\p{Ll}/u.test(caractere),
  ).length;

  const numeros = caracteres.filter((caractere) =>
    /\d/u.test(caractere),
  ).length;

  // Espaços e pontuação sozinhos não contam como símbolo
  const simbolos = caracteres.filter((caractere) =>
    /[^\p{L}\p{N}\s]/u.test(caractere),
  ).length;

  const temMaiuscula = maiusculas > 0;
  const temMinuscula = minusculas > 0;
  const temNumero = numeros > 0;
  const temSimbolo = simbolos > 0;

  const categorias = [temMinuscula, temMaiuscula, temNumero, temSimbolo].filter(
    Boolean,
  ).length;

  // Critérios usados na barra de força
  const criterios = [
    quantidadeCaracteres >= 8,
    quantidadeCaracteres >= 12,
    temMinuscula,
    temMaiuscula,
    temNumero,
    temSimbolo,
  ];

  const pontuacao = criterios.filter(Boolean).length;

  let nivel = 'vazia';
  let texto = 'Digite uma senha';

  if (quantidadeCaracteres > 0) {
    if (pontuacao <= 2) {
      nivel = 'muito-fraca';
      texto = 'Muito fraca';
    } else if (pontuacao === 3) {
      nivel = 'fraca';
      texto = 'Fraca';
    } else if (pontuacao === 4) {
      nivel = 'razoavel';
      texto = 'Razoável';
    } else if (pontuacao === 5) {
      nivel = 'boa';
      texto = 'Boa';
    } else {
      nivel = 'forte';
      texto = 'Forte';
    }
  }

  /*
    Regras de aceitação:
    - 8 ou mais caracteres e pelo menos 3 categorias;
    - OU 12 caracteres ou mais e pelo menos 2 categorias.
  */

  const suficiente =
    (quantidadeCaracteres >= 8 && categorias >= 3) ||
    (quantidadeCaracteres >= 12 && categorias >= 2);

  return {
    quantidadeCaracteres,
    maiusculas,
    minusculas,
    numeros,
    simbolos,
    categorias,
    pontuacao,
    nivel,
    texto,
    suficiente,
  };
}

// =========================
// EXPLICAR O QUE FALTA NA SENHA
// =========================

export function obterPendenciasSenha(valor) {
  if (!valor) {
    return ['Digite uma senha.'];
  }

  const avaliacao = avaliarForcaSenha(valor);
  const pendencias = [];

  // Verifica o comprimento mínimo
  if (avaliacao.quantidadeCaracteres < 8) {
    const faltam = 8 - avaliacao.quantidadeCaracteres;

    pendencias.push(
      `Adicione mais ${faltam} ${
        faltam === 1 ? 'caractere' : 'caracteres'
      } à senha.`,
    );
  }

  // Verifica quantos tipos de caracteres ainda são necessários
  const minimoCategorias = avaliacao.quantidadeCaracteres >= 12 ? 2 : 3;

  const faltamCategorias = minimoCategorias - avaliacao.categorias;

  if (faltamCategorias > 0) {
    const tiposAusentes = [];

    if (avaliacao.maiusculas === 0) {
      tiposAusentes.push('uma letra maiúscula');
    }

    if (avaliacao.minusculas === 0) {
      tiposAusentes.push('uma letra minúscula');
    }

    if (avaliacao.numeros === 0) {
      tiposAusentes.push('um número');
    }

    if (avaliacao.simbolos === 0) {
      tiposAusentes.push('um símbolo especial, como !');
    }

    if (faltamCategorias === 1) {
      pendencias.push(
        `Para fortalecer a senha, inclua mais um destes tipos: ${tiposAusentes.join(', ')}.`,
      );
    } else {
      pendencias.push(
        `Para fortalecer a senha, inclua mais ${faltamCategorias} tipos de caracteres, escolhendo entre: ${tiposAusentes.join(', ')}.`,
      );
    }
  }

  return pendencias;
}
