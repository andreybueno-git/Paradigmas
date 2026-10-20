// =========================
// MEDIDOR DE FORÇA DA SENHA
// =========================
//
// div.senha-seguranca#containerForcaSenha do cadastro, desenhado a partir da senha digitada
// (porte do atualizarForcaSenha do js/cadastro.js). O original já atualizava o medidor ao
// carregar, então o primeiro desenho usa os textos do JS, não os do HTML.
//
import { avaliarForcaSenha, obterPendenciasSenha } from './senha';

// =========================
// DICA SIMPLES DA SENHA
// =========================

function dicaSenha(valor, avaliacao) {
  if (!valor) {
    return 'Use pelo menos 8 caracteres e combine diferentes tipos de caracteres.';
  }

  if (avaliacao.suficiente) {
    return 'Senha válida! Você já pode continuar.';
  }

  return obterPendenciasSenha(valor).join(' ');
}

export default function MedidorSenha({ senha }) {
  const avaliacao = avaliarForcaSenha(senha);

  const porcentagem = (avaliacao.pontuacao / 6) * 100;

  const contagem = `${avaliacao.quantidadeCaracteres} ${
    avaliacao.quantidadeCaracteres === 1 ? 'caractere' : 'caracteres'
  }`;

  return (
    <div className="senha-seguranca" id="containerForcaSenha" data-nivel={avaliacao.nivel}>
      {/* Acessibilidade do indicador de força */}
      <div
        className="senha-barra"
        id="medidorSenha"
        role="progressbar"
        aria-label="Força da senha"
        aria-valuemin="0"
        aria-valuemax="6"
        aria-valuenow={avaliacao.pontuacao}
        aria-valuetext={`${avaliacao.texto}. ${avaliacao.quantidadeCaracteres} caracteres.`}
      >
        <span className="senha-barra-progresso" id="barraSenha" style={{ width: `${porcentagem}%` }}></span>
      </div>

      <div className="senha-status">
        <span id="textoForcaSenha">{avaliacao.texto}</span>
        <span id="contadorSenha">{contagem}</span>
      </div>

      <small className="senha-dica">{dicaSenha(senha, avaliacao)}</small>
    </div>
  );
}
