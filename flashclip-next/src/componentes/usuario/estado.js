'use client';
// Usuário logado (porte do js/auth.js). O estado mora neste módulo, fora da árvore do React:
// o cabeçalho é remontado a cada página, mas lê o valor já conhecido na hora, sem voltar ao "U".
// Quem liga a escuta do Supabase é o <ProvedorUsuario/> do layout (src/app/(site)/layout.jsx).
//
// Estados (mesmos rótulos do original no cabeçalho):
//   inicial    -> "U" / "Usuário"        (antes da primeira verificação, igual ao HTML estático)
//   deslogado  -> "Entrar" / "Entrar"    (clique leva ao login)
//   erro       -> "Usuário" / "Usuário"  (falhou a busca do nome em `usuarios`)
//   logado     -> 8 primeiros caracteres do nome / nome completo
import { useSyncExternalStore } from 'react';
import { clienteSupabase } from '@/lib/supabase';

// =========================
// CACHE DO USUÁRIO
// =========================

const CHAVE_USUARIO = 'flashclip_usuario';

export const USUARIO_INICIAL = Object.freeze({ tipo: 'inicial', nome: null, email: null });
const USUARIO_DESLOGADO = Object.freeze({ tipo: 'deslogado', nome: null, email: null });

// Modo privado ou armazenamento bloqueado não podem quebrar o cabeçalho.
function lerCache() {
  try { return localStorage.getItem(CHAVE_USUARIO); } catch { return null; }
}

function gravarCache(usuario) {
  try { localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario)); } catch {}
}

function apagarCache() {
  try { localStorage.removeItem(CHAVE_USUARIO); } catch {}
}

// =========================
// ESTADO COMPARTILHADO
// =========================

let estado = USUARIO_INICIAL;
const ouvintes = new Set();

function definir(novo) {
  if (novo.tipo === estado.tipo && novo.nome === estado.nome && novo.email === estado.email) return;
  estado = novo;
  ouvintes.forEach(avisar => avisar());
}

function assinar(avisar) {
  ouvintes.add(avisar);
  return () => ouvintes.delete(avisar);
}

export function obterUsuario() {
  return estado;
}

// No HTML exportado o cabeçalho sai sempre com "U" / "Usuário", como no site original.
const obterNoServidor = () => USUARIO_INICIAL;

// { tipo: 'inicial' | 'deslogado' | 'erro' | 'logado', nome, email }
export function useUsuario() {
  return useSyncExternalStore(assinar, obterUsuario, obterNoServidor);
}

// =========================
// CARREGAR USUÁRIO
// =========================
//
// Cada carga ganha um número; se outra começar (ou a sessão acabar) no meio do caminho,
// a resposta antiga é descartada em vez de sobrescrever a nova.
//

let geracao = 0;

export async function carregarUsuario() {
  const minha = ++geracao;

  // =========================
  // VERIFICAR SESSÃO
  // =========================

  const {
    data: { session },
    error,
  } = await clienteSupabase.auth.getSession();

  if (minha !== geracao) return;

  if (error) {
    console.error('Erro ao verificar sessão:', error);
    return;
  }

  // =========================
  // NÃO ESTÁ LOGADO
  // =========================

  if (!session) {
    apagarCache();
    definir(USUARIO_DESLOGADO);
    return;
  }

  // =========================
  // TENTAR USAR CACHE
  // =========================

  const usuarioSalvo = lerCache();

  if (usuarioSalvo) {
    try {
      const usuario = JSON.parse(usuarioSalvo);

      // Verificar se o cache pertence ao usuário atualmente logado
      if (usuario.email === session.user.email && usuario.nome) {
        definir({ tipo: 'logado', nome: usuario.nome, email: usuario.email });
        return;
      }
    } catch {
      console.warn('Cache do usuário inválido.');
      apagarCache();
    }
  }

  // =========================
  // BUSCAR USUÁRIO
  // =========================

  const emailUsuario = session.user.email;

  const { data, error: erroUsuario } = await clienteSupabase
    .from('usuarios')
    .select('nome')
    .eq('email', emailUsuario)
    .single();

  if (minha !== geracao) return;

  if (erroUsuario) {
    console.error('Erro ao buscar usuário:', erroUsuario);
    definir({ tipo: 'erro', nome: null, email: emailUsuario });
    return;
  }

  // =========================
  // SALVAR CACHE E MOSTRAR NOME
  // =========================

  const nomeCompleto = data.nome;

  gravarCache({ email: emailUsuario, nome: nomeCompleto });

  // Sem nome no banco o original parava aqui (erro ao medir o texto) e o cabeçalho ficava como estava.
  if (nomeCompleto == null) return;

  definir({ tipo: 'logado', nome: nomeCompleto, email: emailUsuario });
}

// Para quem acabou de criar o perfil em `usuarios` (cadastro): a primeira busca pode ter
// chegado antes do insert e deixado "Usuário" no cabeçalho.
export function recarregarUsuario() {
  return carregarUsuario().catch(erro => console.error('Erro ao carregar usuário:', erro));
}

// =========================
// ALTERAÇÃO DE SESSÃO
// =========================
//
// Uma única escuta para o site todo, com contagem de uso (o StrictMode do dev monta duas vezes).
//
// A primeira carga começa junto com a escuta, sem esperar o INITIAL_SESSION, como o auth.js, que
// chamava carregarUsuario() assim que o módulo carregava. Esperar o INITIAL_SESSION e mais um
// setTimeout deixava o "U" no cabeçalho bem mais tempo que no original. O INITIAL_SESSION traz a
// mesma sessão que essa carga lê (as duas esperam a inicialização do Supabase), então é ignorado;
// no original ele só repetia a mesma carga.
//

let usos = 0;
let assinatura = null;
let agendado = 0;

export function iniciarUsuario() {
  if (usos++ === 0) {
    const { data } = clienteSupabase.auth.onAuthStateChange(function (evento) {
      // =========================
      // LOGIN
      // =========================

      if (evento === 'SIGNED_IN') {
        // Fora do callback: chamar o Supabase aqui dentro pode travar a trava da sessão.
        clearTimeout(agendado);
        agendado = setTimeout(recarregarUsuario, 0);
        return;
      }

      // =========================
      // LOGOUT
      // =========================

      if (evento === 'SIGNED_OUT') {
        clearTimeout(agendado);
        geracao++;
        apagarCache();
        definir(USUARIO_DESLOGADO);
      }
    });

    assinatura = data.subscription;

    // =========================
    // INICIALIZAÇÃO
    // =========================

    recarregarUsuario();
  }

  return () => {
    if (--usos > 0) return;
    assinatura?.unsubscribe();
    assinatura = null;
    clearTimeout(agendado);
    geracao++;
  };
}
