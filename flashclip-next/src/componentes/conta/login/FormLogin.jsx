'use client';
// =========================
// FORMULÁRIO DE LOGIN
// =========================
//
// Porte do js/login.js: login no Supabase, contador de tentativas, bloqueio temporário com
// contagem regressiva e a transição de sucesso para a home. Mesmas mensagens e regras.
//
// O contador e o bloqueio valem para esta montagem da página (no original, para esta carga):
// sair e voltar ao login começa do zero, como recarregar a página. Os campos não são controlados
// pelo React; o valor é lido na hora do envio, como antes.
//
import { useEffect, useRef, useState } from 'react';
import { clienteSupabase } from '@/lib/supabase';
import { useTransicao } from '@/componentes/conta/cadastro/TransicaoCadastro';

// =========================
// CONTROLE DE TENTATIVAS
// =========================

const LIMITE_TENTATIVAS = 5;
const TEMPO_BLOQUEIO = 30_000;
const TEMPO_LIMITE_SUPABASE = 60_000;

export default function FormLogin() {
  const iniciarTransicao = useTransicao();

  const refEmail = useRef(null);
  const refSenha = useRef(null);

  // { texto, tipo: 'erro' | 'aviso' | 'sucesso' } ou null (mensagem escondida)
  const [mensagem, setMensagem] = useState(null);
  const [botaoDesabilitado, setBotaoDesabilitado] = useState(false);

  // Estado que não aparece na tela (o original guardava em variáveis do módulo).
  const controle = useRef({
    tentativasFalhas: 0,
    bloqueadoAte: 0,
    intervaloBloqueio: null,
    loginConcluido: false,
    enviando: false,
    montado: false,
  });

  // Nenhum intervalo do bloqueio sobrevive à saída da página.
  useEffect(() => {
    const atual = controle.current;
    atual.montado = true;

    return () => {
      atual.montado = false;

      if (atual.intervaloBloqueio !== null) {
        clearInterval(atual.intervaloBloqueio);
        atual.intervaloBloqueio = null;
      }
    };
  }, []);

  // =========================
  // MENSAGENS NA TELA
  // =========================

  function mostrarMensagem(texto, tipo = 'erro') {
    setMensagem({ texto, tipo });
  }

  function limparMensagem() {
    setMensagem(null);
  }

  // =========================
  // BLOQUEIO TEMPORÁRIO
  // =========================

  function atualizarBloqueio() {
    const atual = controle.current;
    const restante = atual.bloqueadoAte - Date.now();

    if (restante <= 0) {
      atual.bloqueadoAte = 0;

      if (atual.intervaloBloqueio !== null) {
        clearInterval(atual.intervaloBloqueio);
        atual.intervaloBloqueio = null;
      }

      if (!atual.loginConcluido) {
        setBotaoDesabilitado(false);
      }

      mostrarMensagem(
        'O tempo de espera terminou. Você já pode tentar novamente.',
        'sucesso'
      );

      return;
    }

    const segundos = Math.ceil(restante / 1000);

    setBotaoDesabilitado(true);

    mostrarMensagem(
      `Muitas tentativas de login. Aguarde ${segundos} segundos para tentar novamente.`,
      'aviso'
    );
  }

  function iniciarBloqueio(duracao) {
    const atual = controle.current;
    atual.bloqueadoAte = Date.now() + duracao;

    if (atual.intervaloBloqueio !== null) {
      clearInterval(atual.intervaloBloqueio);
      atual.intervaloBloqueio = null;
    }

    setBotaoDesabilitado(true);

    atualizarBloqueio();

    // A resposta pode chegar depois de a pessoa sair do login: sem página, sem contagem.
    if (!atual.montado) return;

    atual.intervaloBloqueio = window.setInterval(atualizarBloqueio, 1000);
  }

  // =========================
  // REALIZAR LOGIN
  // =========================

  async function entrar(event) {
    event.preventDefault();

    const atual = controle.current;

    // Impede novas tentativas durante o bloqueio.
    if (atual.bloqueadoAte > Date.now()) {
      atualizarBloqueio();
      return;
    }

    // O botão já fica desabilitado; isto só cobre um segundo envio antes de a tela atualizar.
    if (atual.enviando || atual.loginConcluido) return;

    const email = refEmail.current.value.trim();

    const senha = refSenha.current.value;

    limparMensagem();

    // =========================
    // VALIDAÇÃO
    // =========================

    if (!email || !senha) {
      mostrarMensagem('Preencha o e-mail e a senha para continuar.');
      return;
    }

    atual.enviando = true;
    setBotaoDesabilitado(true);

    try {
      // =========================
      // AUTENTICAÇÃO SUPABASE
      // =========================

      const { data, error } = await clienteSupabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        console.error('Erro ao fazer login:', error);

        const detalhesErro = `${error.code ?? ''} ${error.message ?? ''}`;

        const atingiuLimite =
          error.status === 429 ||
          /rate.?limit|too many requests|over_request_rate_limit/i.test(detalhesErro);

        // =========================
        // LIMITE DO SUPABASE
        // =========================

        if (atingiuLimite) {
          atual.tentativasFalhas = 0;

          iniciarBloqueio(TEMPO_LIMITE_SUPABASE);
          return;
        }

        // =========================
        // E-MAIL NÃO CONFIRMADO
        // =========================

        if (error.code === 'email_not_confirmed') {
          mostrarMensagem(
            'Seu e-mail ainda não foi confirmado. Confira sua caixa de entrada.',
            'aviso'
          );

          return;
        }

        // =========================
        // CREDENCIAIS INCORRETAS
        // =========================

        if (error.status === 400) {
          atual.tentativasFalhas++;

          if (atual.tentativasFalhas >= LIMITE_TENTATIVAS) {
            atual.tentativasFalhas = 0;

            iniciarBloqueio(TEMPO_BLOQUEIO);
            return;
          }

          mostrarMensagem(
            `E-mail ou senha incorretos. Confira os dados e tente novamente. Tentativa ${atual.tentativasFalhas} de ${LIMITE_TENTATIVAS}.`
          );

          return;
        }

        // =========================
        // OUTROS ERROS
        // =========================

        mostrarMensagem('Não foi possível realizar o login agora. Tente novamente mais tarde.');

        return;
      }

      // =========================
      // LOGIN REALIZADO
      // =========================

      atual.tentativasFalhas = 0;
      atual.loginConcluido = true;

      limparMensagem();

      console.log('Login realizado:', data.user);

      // O nome no cabeçalho vem sozinho: o Supabase avisa o SIGNED_IN ao ProvedorUsuario.
      iniciarTransicao({
        titulo: 'Login realizado!',
        saudacao: 'Bem-vindo de volta ao FlashClip.',
      });
    } catch (erro) {
      console.error('Erro inesperado:', erro);

      mostrarMensagem(
        'Não foi possível conectar ao serviço de login. Verifique sua conexão e tente novamente.'
      );
    } finally {
      atual.enviando = false;

      setBotaoDesabilitado(atual.loginConcluido || atual.bloqueadoAte > Date.now());
    }
  }

  return (
    <form id="formLogin" onSubmit={entrar}>
      <div
        id="mensagemLogin"
        className="mensagem-login"
        role="status"
        aria-live="polite"
        hidden={!mensagem}
        data-tipo={mensagem?.tipo}
      >
        {mensagem?.texto}
      </div>

      <div className="campo">
        <label htmlFor="email">E-mail</label>

        <input type="email" id="email" ref={refEmail} placeholder="seu@email.com" required />
      </div>

      <div className="campo">
        <label htmlFor="senha">Senha</label>

        <input type="password" id="senha" ref={refSenha} placeholder="Digite sua senha" required />
      </div>

      <button type="submit" className="botao-login fc-magnetic" disabled={botaoDesabilitado}>
        Entrar
      </button>
    </form>
  );
}
