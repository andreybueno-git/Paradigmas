'use client';
// =========================
// TRANSIÇÃO DE SUCESSO (MATRÍCULA)
// =========================
//
// Tela div.transicao-matricula que cobre a página depois da matrícula e leva para "Minhas
// inscrições" após 2,6 s. Diferente da do login/cadastro, ela não tem pointer-events: none
// (bloqueia os cliques), como no original.
//
// No original ela era criada com document.createElement e anexada no fim do <body>. Aqui ela fica
// no fim do wrapper data-fc-page (o CSS dela só vale lá dentro), fora do card: o card tem
// backdrop-filter, que prenderia o position:fixed dentro dele.
//
//   <ProvedorTransicaoMatricula> …cabeçalho, main… </ProvedorTransicaoMatricula>   (no page.jsx)
//   const iniciarTransicao = useTransicaoMatricula();                            (no card)
//   iniciarTransicao({ nomeCurso: 'Python' });
//
// A ida para as inscrições é pelo router (a música continua). Se a pessoa sair antes, a tela some
// com a página e a navegação atrasada não acontece.
//
import { createContext, use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Mantém o efeito visível antes do redirecionamento.
const TEMPO_TRANSICAO = 2600;

const ContextoTransicao = createContext(null);

export function ProvedorTransicaoMatricula({ children }) {
  const [transicao, setTransicao] = useState(null);

  return (
    <ContextoTransicao value={setTransicao}>
      {children}

      {transicao && <TransicaoMatricula nomeCurso={transicao.nomeCurso} />}
    </ContextoTransicao>
  );
}

// Devolve iniciarTransicao({ nomeCurso }).
export function useTransicaoMatricula() {
  const iniciar = use(ContextoTransicao);

  if (!iniciar) {
    throw new Error('useTransicaoMatricula precisa estar dentro de <ProvedorTransicaoMatricula>.');
  }

  return iniciar;
}

function TransicaoMatricula({ nomeCurso }) {
  const router = useRouter();
  const [ativa, setAtiva] = useState(false);

  useEffect(() => {
    const quadro = requestAnimationFrame(function () {
      setAtiva(true);
    });

    // Mantém o efeito visível antes do redirecionamento.
    const espera = setTimeout(function () {
      router.push('/inscricoes/');
    }, TEMPO_TRANSICAO);

    return () => {
      cancelAnimationFrame(quadro);
      clearTimeout(espera);
    };
  }, [router]);

  return (
    <div className={ativa ? 'transicao-matricula ativa' : 'transicao-matricula'} role="status" aria-live="polite">
      <div className="transicao-matricula-conteudo">
        <span className="transicao-matricula-icone" aria-hidden="true">
          ✓
        </span>

        <h2>Matrícula realizada!</h2>

        <p>
          Sua vaga em <strong>{nomeCurso}</strong> foi registrada.
          <br />
          Preparando sua área de inscrições...
        </p>

        <div className="transicao-matricula-barra" aria-hidden="true"></div>
      </div>
    </div>
  );
}
