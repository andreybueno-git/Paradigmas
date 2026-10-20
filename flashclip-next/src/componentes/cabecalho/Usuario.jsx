'use client';
// =========================
// USUÁRIO NO CABEÇALHO
// =========================
//
// Botão do usuário (desktop e menu do celular) e o nome completo. Antes o auth.js escrevia só no
// desktop e o cabecalho.js copiava o texto para o celular; aqui os dois leem o mesmo estado.
// Deslogado, o clique vai para o login sem recarregar a página (a música continua).
//
import { useRouter } from 'next/navigation';
import { useUsuario } from '@/componentes/usuario/estado';

const ROTA_LOGIN = '/login/';

function rotulos(usuario) {
  switch (usuario.tipo) {
    case 'logado': {
      const nome = String(usuario.nome);
      return { botao: nome.substring(0, 8), nome };
    }
    case 'deslogado':
      return { botao: 'Entrar', nome: 'Entrar' };
    case 'erro':
      return { botao: 'Usuário', nome: 'Usuário' };
    default:
      return { botao: 'U', nome: 'Usuário' };
  }
}

function useBotaoUsuario() {
  const usuario = useUsuario();
  const router = useRouter();
  const { botao, nome } = rotulos(usuario);

  // Logado (ou sem resposta ainda) o clique não faz nada, como no original.
  const aoClicar = usuario.tipo === 'deslogado' ? () => router.push(ROTA_LOGIN) : undefined;

  return { botao, nome, aoClicar };
}

// O className desses botões não muda nunca: o efeito magnético põe e tira classes neles.
export function UsuarioDesktop() {
  const { botao, nome, aoClicar } = useBotaoUsuario();

  return (
    <div className="usuario-container">
      <button className="usuario fc-magnetic" id="botaoUsuario" onClick={aoClicar}>
        {botao}
      </button>

      <div className="nome-usuario" id="nomeUsuario">
        {nome}
      </div>
    </div>
  );
}

// O original repassava o toque ao botão do desktop (botaoUsuario.click()); esse clique, fora do
// painel, também fechava o menu. `aoTocar` faz esse papel.
export function UsuarioMobile({ aoTocar }) {
  const { botao, nome, aoClicar } = useBotaoUsuario();

  const clicar = () => {
    aoTocar?.();
    aoClicar?.();
  };

  return (
    <div className="menu-usuario">
      <button className="usuario fc-magnetic" id="botaoUsuarioMobile" onClick={clicar}>
        {botao}
      </button>

      <span id="nomeUsuarioMobile">{nome}</span>
    </div>
  );
}
