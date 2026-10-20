'use client';
// =========================
// FORMULÁRIO DE CADASTRO
// =========================
//
// Porte do js/cadastro.js: máscara do telefone, validações (uma de cada vez, na mesma ordem),
// medidor de força da senha, mostrar/ocultar senha, signUp + insert em `usuarios` e a transição
// de sucesso para a home. Mesmas regras e mensagens.
//
// Os campos não são controlados pelo React (o valor é lido na hora, como antes, e um texto
// digitado antes de a página hidratar não se perde). O erro de cada campo fica no estado e vira
// a classe campo-invalido + o <small class="mensagem-erro"> no fim do .campo; o setCustomValidity
// continua direto no elemento, para o navegador barrar o próximo envio com a mesma mensagem até o
// campo ser corrigido (o formulário não tem noValidate, como no original).
//
import { useEffect, useRef, useState } from 'react';
import { clienteSupabase } from '@/lib/supabase';
import { recarregarUsuario } from '@/componentes/usuario/estado';
import { useTransicao } from './TransicaoCadastro';
import MedidorSenha from './MedidorSenha';
import { obterPendenciasSenha } from './senha';
import { formatarNome, formatarTelefone, mascararTelefone } from './formatar';

// =========================
// ÍCONE DO BOTÃO DA SENHA
// =========================
// Olho aberto com a senha escondida; olho riscado com a senha à mostra.

function IconeSenha({ senhaVisivel }) {
  return (
    <svg
      className="icone-senha"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {senhaVisivel ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
          <path d="M9.88 5.09A10.94 10.94 0 0 1 12 4.89c6.5 0 9.94 7.11 9.94 7.11a16.7 16.7 0 0 1-3.03 3.85" />
          <path d="M6.61 6.61C3.72 8.55 2.06 12 2.06 12s3.44 7.11 9.94 7.11a10.9 10.9 0 0 0 4.12-.8" />
        </>
      ) : (
        <>
          <path d="M2.06 12s3.44-7 9.94-7 9.94 7 9.94 7-3.44 7-9.94 7-9.94-7-9.94-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

export default function FormCadastro() {
  const iniciarTransicao = useTransicao();

  // =========================
  // FORMULÁRIO E CAMPOS
  // =========================

  const refFormulario = useRef(null);

  const refNome = useRef(null);
  const refTelefone = useRef(null);
  const refIdade = useRef(null);
  const refOrigem = useRef(null);
  const refEmail = useRef(null);
  const refSenha = useRef(null);

  const campos = {
    nome: refNome,
    telefone: refTelefone,
    idade: refIdade,
    origem: refOrigem,
    email: refEmail,
    senha: refSenha,
  };

  // { [campo]: mensagem } dos campos com erro na tela.
  const [erros, setErros] = useState({});
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const refEnviando = useRef(false);

  // Mostra as contagens desde o início (também para uma senha que o navegador já tenha posto).
  useEffect(() => {
    setSenha(refSenha.current.value);
  }, []);

  const temErro = campo => Object.hasOwn(erros, campo);

  // =========================
  // MOSTRAR ERRO
  // =========================

  function mostrarErro(campo, mensagem) {
    campos[campo].current?.setCustomValidity(mensagem);

    setErros(atuais => ({ ...atuais, [campo]: mensagem }));
  }

  // =========================
  // LIMPAR ERRO
  // =========================

  function limparErro(campo) {
    campos[campo].current?.setCustomValidity('');

    setErros(atuais => {
      if (!Object.hasOwn(atuais, campo)) return atuais;

      const restantes = { ...atuais };
      delete restantes[campo];
      return restantes;
    });
  }

  // =========================
  // VALIDAR NOME
  // =========================

  function validarNome() {
    const valor = refNome.current.value.trim();

    // Campo vazio
    if (valor === '') {
      mostrarErro('nome', 'Digite seu nome completo.');
      return false;
    }

    const partesNome = valor.split(/\s+/);

    // Nome e sobrenome
    if (partesNome.length < 2) {
      mostrarErro('nome', 'Digite seu nome e sobrenome.');
      return false;
    }

    // Somente letras
    const nomeValido = partesNome.every(function (palavra) {
      return /^[A-Za-zÀ-ÿ]{2,}$/.test(palavra);
    });

    if (!nomeValido) {
      mostrarErro('nome', 'Digite um nome válido.');
      return false;
    }

    limparErro('nome');
    return true;
  }

  // =========================
  // VALIDAR TELEFONE
  // =========================

  function validarTelefone() {
    const numeros = refTelefone.current.value.replace(/\D/g, '');

    if (numeros.length < 10 || numeros.length > 11) {
      mostrarErro('telefone', 'Digite um telefone válido com DDD.');
      return false;
    }

    limparErro('telefone');
    return true;
  }

  // =========================
  // VALIDAR IDADE
  // =========================

  function validarIdade() {
    const valor = refIdade.current.value;
    const numero = Number(valor);

    if (valor === '' || !Number.isInteger(numero) || numero < 1 || numero > 100) {
      mostrarErro('idade', 'A idade deve estar entre 1 e 100 anos.');
      return false;
    }

    limparErro('idade');
    return true;
  }

  // =========================
  // VALIDAR ORIGEM
  // =========================

  function validarOrigem() {
    if (!refOrigem.current.value) {
      mostrarErro('origem', 'Selecione sua origem.');
      return false;
    }

    limparErro('origem');
    return true;
  }

  // =========================
  // VALIDAR E-MAIL
  // =========================

  function validarEmail() {
    const email = refEmail.current;

    // Limpa a validade personalizada antes da verificação
    email.setCustomValidity('');

    const valor = email.value.trim();

    if (valor === '') {
      mostrarErro('email', 'Digite seu e-mail.');
      return false;
    }

    if (email.validity.typeMismatch) {
      mostrarErro('email', 'Digite um e-mail válido.');
      return false;
    }

    limparErro('email');
    return true;
  }

  // =========================
  // VALIDAR SENHA
  // =========================

  function validarSenha() {
    const valor = refSenha.current.value;

    if (valor === '') {
      mostrarErro('senha', 'Digite uma senha.');
      return false;
    }

    const pendencias = obterPendenciasSenha(valor);

    if (pendencias.length > 0) {
      mostrarErro('senha', `Senha ainda não é válida. ${pendencias.join(' ')}`);

      return false;
    }

    limparErro('senha');
    return true;
  }

  // =========================
  // VALIDAR FORMULÁRIO
  // =========================

  function validarFormulario() {
    if (!validarNome()) {
      return false;
    }

    if (!validarTelefone()) {
      return false;
    }

    if (!validarIdade()) {
      return false;
    }

    if (!validarOrigem()) {
      return false;
    }

    if (!validarEmail()) {
      return false;
    }

    if (!validarSenha()) {
      return false;
    }

    return true;
  }

  // =========================
  // FEEDBACK ENQUANTO DIGITA
  // =========================
  // Só revalida o campo que já está marcado com erro.

  function aoDigitarNome() {
    if (temErro('nome')) {
      validarNome();
    }
  }

  // Máscara do telefone: só números, no máximo 11, com espaço depois do DDD.
  function aoDigitarTelefone(event) {
    const telefone = event.currentTarget;

    telefone.value = mascararTelefone(telefone.value);

    // Atualiza o erro enquanto digita
    if (temErro('telefone')) {
      validarTelefone();
    }
  }

  function aoDigitarIdade() {
    if (temErro('idade')) {
      validarIdade();
    }
  }

  function aoMudarOrigem() {
    if (temErro('origem')) {
      validarOrigem();
    }
  }

  function aoDigitarEmail() {
    if (temErro('email')) {
      validarEmail();
    }
  }

  // =========================
  // FEEDBACK DA SENHA
  // =========================

  function aoDigitarSenha(event) {
    setSenha(event.currentTarget.value);

    if (temErro('senha')) {
      validarSenha();
    }
  }

  // =========================
  // ENVIO DO FORMULÁRIO
  // =========================

  async function criarConta(event) {
    event.preventDefault();

    // O botão já fica desabilitado; isto só cobre um segundo envio antes de a tela atualizar.
    if (refEnviando.current) return;

    // =========================
    // VALIDAR TUDO
    // =========================

    if (!validarFormulario()) {
      return;
    }

    // =========================
    // PEGAR DADOS
    // =========================

    const nomeDigitado = refNome.current.value;
    const telefoneDigitado = refTelefone.current.value;
    const origemDigitada = refOrigem.current.value.trim().toLowerCase();
    const idadeDigitada = Number(refIdade.current.value);
    const emailDigitado = refEmail.current.value.trim().toLowerCase();
    const senhaDigitada = refSenha.current.value;

    // =========================
    // FORMATAR DADOS
    // =========================

    const nomeFormatado = formatarNome(nomeDigitado);
    const telefoneFormatado = formatarTelefone(telefoneDigitado);

    // =========================
    // EVITAR DUPLO ENVIO
    // =========================

    refEnviando.current = true;
    setEnviando(true);

    try {
      // =========================
      // CRIAR CONTA NO SUPABASE
      // =========================

      const { data, error } = await clienteSupabase.auth.signUp({
        email: emailDigitado,
        password: senhaDigitada,
      });

      // =========================
      // ERRO NO AUTH
      // =========================

      if (error) {
        console.error('Erro ao criar conta:', error);

        const mensagem = error.message.toLowerCase();

        // E-mail já cadastrado
        if (
          mensagem.includes('already registered') ||
          mensagem.includes('already been registered')
        ) {
          mostrarErro('email', 'Este e-mail já está cadastrado.');
        } else {
          mostrarErro('email', error.message);
        }

        return;
      }

      // =========================
      // VERIFICAR USUÁRIO
      // =========================

      if (!data.user) {
        console.error('Usuário não retornado pelo Supabase.');

        mostrarErro('email', 'Não foi possível criar a conta.');

        return;
      }

      // =========================
      // SALVAR USUÁRIO
      // =========================

      const { error: erroUsuario } = await clienteSupabase
        .from('usuarios')
        .insert({
          nome: nomeFormatado,
          telefone: telefoneFormatado,
          origem: origemDigitada,
          idade: idadeDigitada,
          email: emailDigitado,
        });

      // =========================
      // ERRO AO SALVAR
      // =========================

      if (erroUsuario) {
        console.error('Erro ao salvar usuário:', erroUsuario);

        mostrarErro(
          'email',
          'A conta foi criada, mas não foi possível salvar seus dados.',
        );

        return;
      }

      // =========================
      // CADASTRO CONCLUÍDO
      // =========================

      refFormulario.current?.reset();

      // Com a sessão aberta pelo signUp, o cabeçalho pode ter procurado o nome antes deste
      // insert terminar (e ficado em "Usuário"): busca de novo agora que o perfil existe.
      recarregarUsuario();

      iniciarTransicao({
        titulo: 'Cadastro concluído!',
        saudacao: 'Bem-vindo ao FlashClip.',
      });

      // O medidor volta para "Digite uma senha"
      setSenha('');
    } catch (erro) {
      console.error('Erro inesperado:', erro);

      mostrarErro('email', 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      // Como no original, o botão volta a "Criar conta" também no sucesso (sob a transição).
      refEnviando.current = false;
      setEnviando(false);
    }
  }

  // =========================
  // MOSTRAR / OCULTAR SENHA
  // =========================

  function alternarVisibilidadeSenha() {
    setSenhaVisivel(visivel => !visivel);
  }

  const classeCampo = campo => (temErro(campo) ? 'campo-invalido' : undefined);

  const mensagemErro = campo =>
    temErro(campo) ? <small className="mensagem-erro">{erros[campo]}</small> : null;

  return (
    <form id="formCadastro" className="formulario" ref={refFormulario} onSubmit={criarConta}>
      <div className="campo">
        <label htmlFor="nome">Nome completo</label>

        <input
          type="text"
          id="nome"
          ref={refNome}
          className={classeCampo('nome')}
          placeholder="Digite seu nome completo"
          minLength={5}
          required
          onInput={aoDigitarNome}
        />

        {mensagemErro('nome')}
      </div>

      <div className="campos-duplos">
        <div className="campo">
          <label htmlFor="telefone">Telefone</label>

          <input
            type="tel"
            id="telefone"
            ref={refTelefone}
            className={classeCampo('telefone')}
            placeholder="63 992548143"
            inputMode="numeric"
            maxLength={12}
            required
            onInput={aoDigitarTelefone}
          />

          {mensagemErro('telefone')}
        </div>

        <div className="campo">
          <label htmlFor="idade">Idade</label>

          <input
            type="number"
            id="idade"
            ref={refIdade}
            className={classeCampo('idade')}
            placeholder="Sua idade"
            min="1"
            max="100"
            required
            onInput={aoDigitarIdade}
          />

          {mensagemErro('idade')}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="origem">Origem</label>

        <select
          id="origem"
          ref={refOrigem}
          className={classeCampo('origem')}
          defaultValue=""
          required
          onChange={aoMudarOrigem}
        >
          <option value="" disabled>
            Selecione sua origem
          </option>

          <option value="ulbra-ti">ULBRA - TI</option>
          <option value="ulbra-outro">ULBRA - Outro curso</option>
          <option value="outra-faculdade">Outra faculdade</option>
          <option value="externo">Externo</option>
        </select>

        {mensagemErro('origem')}
      </div>

      <div className="campo">
        <label htmlFor="email">E-mail</label>

        <input
          type="email"
          id="email"
          ref={refEmail}
          className={classeCampo('email')}
          placeholder="seu@email.com"
          required
          onInput={aoDigitarEmail}
        />

        {mensagemErro('email')}
      </div>

      <div className="campo">
        <label htmlFor="senha">Senha</label>

        <div className="senha-input-container">
          <input
            type={senhaVisivel ? 'text' : 'password'}
            id="senha"
            ref={refSenha}
            className={classeCampo('senha')}
            placeholder="Mínimo de 8 caracteres"
            minLength={8}
            autoComplete="new-password"
            required
            onInput={aoDigitarSenha}
          />

          <button
            type="button"
            id="alternarVisibilidadeSenha"
            className="botao-mostrar-senha"
            aria-label={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            aria-controls="senha"
            aria-pressed={senhaVisivel}
            onClick={alternarVisibilidadeSenha}
          >
            <IconeSenha senhaVisivel={senhaVisivel} />
          </button>
        </div>

        <MedidorSenha senha={senha} />

        {mensagemErro('senha')}
      </div>

      <button type="submit" className="botao-cadastro fc-magnetic" disabled={enviando}>
        {enviando ? 'Criando conta...' : 'Criar conta'}
      </button>
    </form>
  );
}
