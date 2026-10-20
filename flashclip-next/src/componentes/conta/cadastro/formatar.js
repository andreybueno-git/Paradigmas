// =========================
// FORMATAÇÃO DO CADASTRO
// =========================
//
// Funções puras copiadas do js/cadastro.js: nome e telefone como são gravados em `usuarios`
// e a máscara aplicada ao telefone enquanto a pessoa digita.
//

// =========================
// FORMATAR NOME
// =========================

export function formatarNome(valor) {
  return valor
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .split(' ')
    .map(function (palavra) {
      return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    })
    .join(' ');
}

// =========================
// FORMATAR TELEFONE
// =========================

export function formatarTelefone(valor) {
  const numeros = valor.replace(/\D/g, '');

  if (numeros.length < 10 || numeros.length > 11) {
    return null;
  }

  const ddd = numeros.substring(0, 2);
  const numero = numeros.substring(2);

  return `(${ddd}) ${numero}`;
}

// =========================
// MÁSCARA DO TELEFONE
// =========================

export function mascararTelefone(valor) {
  let numeros = valor.replace(/\D/g, '');

  // Máximo de 11 números
  numeros = numeros.substring(0, 11);

  // Espaço depois do DDD
  if (numeros.length > 2) {
    numeros = numeros.substring(0, 2) + ' ' + numeros.substring(2);
  }

  return numeros;
}
