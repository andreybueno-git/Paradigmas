'use client';
// =========================
// LISTA DE INSCRIÇÕES
// =========================
//
// Porte do js/inscricoes.js: section#listaInscricoes com as matrículas da pessoa (mais recente
// primeiro) ou um dos estados (sem perfil, sem inscrições, erro). Mesmos textos e regras
// (consultas.js).
//
// O HTML estático sai com o "Carregando suas inscrições...", como o original. Aqui ele fica na
// tela até a resposta chegar (o original o apagava antes de consultar e a área ficava vazia
// durante a busca).
//
// Sem sessão vai direto para o login, sem mensagem. É um replace: voltar do login não cai de novo
// aqui (que mandaria para o login outra vez).
//
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CardInscricao from './CardInscricao';
import { buscarInscricoes } from './consultas';

const CARREGANDO = {};

// ===============================
// MOSTRAR ESTADO DA PÁGINA
// ===============================

function EstadoInscricoes({ titulo, descricao, tipo }) {
  const icone = tipo === 'erro' ? '!' : tipo === 'vazio' ? '✦' : 'i';

  return (
    <div className="estado-inscricoes">
      <span className="icone-titulo" aria-hidden="true">
        {icone}
      </span>

      <h2>{titulo}</h2>

      <p>{descricao}</p>

      {/* Sem prefetch, como os outros links da página (ver page.jsx). */}
      <Link href="/#cursos" prefetch={false}>
        Ver cursos disponíveis
      </Link>
    </div>
  );
}

export default function ListaInscricoes() {
  const router = useRouter();

  // {} (carregando) | { estado: { titulo, descricao, tipo } } | { inscricoes: [...] }
  const [resultado, setResultado] = useState(CARREGANDO);

  useEffect(() => {
    let ativo = true;

    buscarInscricoes().then(function (resposta) {
      if (!ativo) return;

      if (resposta.login) {
        router.replace('/login/');
        return;
      }

      setResultado(resposta);
    });

    return () => {
      ativo = false;
    };
  }, [router]);

  let conteudo = (
    <div className="estado-inscricoes">
      <span className="carregando-inscricoes" aria-hidden="true"></span>
      <p>Carregando suas inscrições...</p>
    </div>
  );

  if (resultado.inscricoes) {
    conteudo = resultado.inscricoes.map(inscricao => <CardInscricao key={inscricao.chave} inscricao={inscricao} />);
  } else if (resultado.estado) {
    conteudo = <EstadoInscricoes {...resultado.estado} />;
  }

  return (
    <section
      id="listaInscricoes"
      className="lista-inscricoes"
      aria-label="Cursos em que você está matriculado"
      aria-live="polite"
    >
      {conteudo}
    </section>
  );
}
