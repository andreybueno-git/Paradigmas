'use client';
// Lista de cursos da home e da página /cursos/ (porte de js/carregarCardsCursos.js + o carregador
// notebooks/course-computers-loader.js). Vai no lugar do antigo div.lista-cursos#listaCursos:
//
//   <ListaCursos variante="home" aoTerminar={tipo => boot.report('courses')} />   // até 11 cursos
//   <ListaCursos variante="cursos" />                                             // todos
//
// O HTML estático sai com "Carregando cursos..." (a home sem o spinner, como no original); os
// dados, a sessão e os notebooks 3D só existem no navegador. aoTerminar(tipo) é chamado quando a
// lista sai do carregamento, com 'pronto', 'vazio' ou 'erro' (o original reportava 'courses'
// pronto em qualquer caso).
//
// O botão de inscrição depende do usuário: a sessão é lida direto do Supabase a cada montagem
// (como em cada carga de página no original) e a lista se refaz se o usuário entrar, sair ou
// trocar de conta enquanto ela estiver na tela (useUsuario do cabeçalho).
import { useEffect, useMemo, useRef, useState } from 'react';
import { asset } from '@/lib/caminho';
import { useUsuario } from '@/componentes/usuario/estado';
import { carregarCursos } from './carregarCursos';
import CardCurso from './CardCurso';
import { ContextoNotebooks } from './NotebookCurso';

const LIMITE_HOME = 11;

// Sem o módulo dos notebooks em 20 s, os cards ficam na versão leve (como no carregador original).
const PRAZO_NOTEBOOKS = 20000;

const CARREGANDO = { tipo: 'carregando' };

export default function ListaCursos({ variante = 'cursos', limite, aoTerminar }) {
  const limiteEfetivo = limite !== undefined ? limite : variante === 'home' ? LIMITE_HOME : null;
  const refLista = useRef(null);
  const [estado, setEstado] = useState(CARREGANDO);
  const [versao, setVersao] = useState(0);
  const [notebooks, setNotebooks] = useState(null);
  const [indisponivel, setIndisponivel] = useState(false);

  const refAoTerminar = useRef(aoTerminar);
  useEffect(() => {
    refAoTerminar.current = aoTerminar;
  });

  // =========================
  // CURSOS
  // =========================
  // Mantém os cards na tela durante uma recarga (troca de usuário): só o rodapé muda.

  useEffect(() => {
    let ativo = true;

    carregarCursos({ limite: limiteEfetivo, caminhoImagens: asset('/imagens/') }).then(resultado => {
      if (ativo) setEstado(resultado);
    });

    return () => {
      ativo = false;
    };
  }, [limiteEfetivo, versao]);

  // Uma vez por montagem, como o report('courses') de cada carga de página.
  const terminou = useRef(false);
  useEffect(() => {
    if (estado.tipo === 'carregando' || terminou.current) return;
    terminou.current = true;
    refAoTerminar.current?.(estado.tipo);
  }, [estado]);

  // =========================
  // USUÁRIO MUDOU COM A LISTA ABERTA
  // =========================
  // undefined = o cabeçalho ainda não sabe; null = sem sessão; senão, o e-mail da sessão.

  const usuario = useUsuario();
  const emailUsuario = usuario.tipo === 'inicial' ? undefined : usuario.tipo === 'deslogado' ? null : usuario.email ?? null;
  const ultimaDivergencia = useRef('');

  useEffect(() => {
    if (emailUsuario === undefined || estado.tipo !== 'pronto' || estado.email === emailUsuario) return;
    // No máximo uma recarga para cada par diferente (evita repetir se os dois discordarem).
    const divergencia = `${estado.email}|${emailUsuario}`;
    if (ultimaDivergencia.current === divergencia) return;
    ultimaDivergencia.current = divergencia;
    setVersao(valor => valor + 1);
  }, [emailUsuario, estado]);

  // =========================
  // NOTEBOOKS 3D
  // =========================
  // Um controlador (e um único contexto WebGL) por lista, criado no mount e destruído no unmount.

  useEffect(() => {
    let ativo = true, falhou = false, controlador = null;

    function cair(erro) {
      if (!ativo || falhou) return;
      falhou = true;
      clearTimeout(timer);
      setIndisponivel(true);
      console.warn('Os notebooks continuam disponíveis na versão leve.', erro);
    }

    const timer = setTimeout(() => cair(new Error('Tempo limite ao iniciar os notebooks 3D.')), PRAZO_NOTEBOOKS);

    import('@/lib/notebooks/controlador')
      .then(({ iniciarNotebooks }) => {
        // Chegou depois do prazo: não inicia (os cards já estão na versão leve).
        if (!ativo || falhou || !refLista.current) return;
        clearTimeout(timer);
        controlador = iniciarNotebooks(refLista.current);
        setNotebooks(controlador);
      })
      .catch(cair);

    return () => {
      ativo = false;
      clearTimeout(timer);
      controlador?.destruir();
      setNotebooks(null);
    };
  }, []);

  const contexto = useMemo(() => ({ notebooks, indisponivel }), [notebooks, indisponivel]);

  // =========================
  // ESTADOS DA LISTA
  // =========================

  let conteudo;

  if (estado.tipo === 'carregando') {
    conteudo = variante === 'home' ? (
      <p>Carregando cursos...</p>
    ) : (
      <div className="estado-cursos">
        <span className="carregando"></span>

        <p>Carregando cursos...</p>
      </div>
    );
  } else if (estado.tipo === 'vazio') {
    conteudo = <p>Nenhum curso disponível.</p>;
  } else if (estado.tipo === 'erro') {
    conteudo = <p>Erro ao carregar os cursos.</p>;
  } else {
    // Os cards precisam ser filhos diretos da lista (grade e :nth-last-child do CSS): o contexto não cria elemento.
    conteudo = estado.cards.map(card => <CardCurso key={card.chave} card={card} />);
  }

  return (
    <div className="lista-cursos" id="listaCursos" ref={refLista} data-computer-unavailable={indisponivel ? 'true' : undefined}>
      <ContextoNotebooks value={contexto}>{conteudo}</ContextoNotebooks>
    </div>
  );
}
