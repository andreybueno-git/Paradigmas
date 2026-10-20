'use client';
// =========================
// TRANSIÇÃO DE SUCESSO (LOGIN E CADASTRO)
// =========================
//
// Tela div.transicao-cadastro que cobre a página depois de entrar ou criar a conta (o login
// reaproveita o visual do cadastro, como no original) e leva para a home após 3 s.
//
// No original ela era criada com document.createElement e anexada no fim do <body>. Aqui ela fica
// no fim do wrapper data-fc-page (o CSS dela só vale lá dentro), fora do card: o card tem
// backdrop-filter, que prenderia o position:fixed dentro dele.
//
//   <ProvedorTransicao> …cabeçalho, main, rodapé… </ProvedorTransicao>   (no page.jsx)
//   const iniciarTransicao = useTransicao();                              (no formulário)
//   iniciarTransicao({ titulo: 'Login realizado!', saudacao: 'Bem-vindo de volta ao FlashClip.' });
//
// A ida para a home é pelo router (a música continua). Se a pessoa sair antes dos 3 s, a tela
// some com a página e a navegação atrasada não acontece.
//
import { createContext, use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Vai para a Home após a animação
const TEMPO_TRANSICAO = 3000;

const ContextoTransicao = createContext(null);

export function ProvedorTransicao({ children, destino = '/' }) {
  const [transicao, setTransicao] = useState(null);

  return (
    <ContextoTransicao value={setTransicao}>
      {children}

      {transicao && <TransicaoCadastro {...transicao} destino={destino} />}
    </ContextoTransicao>
  );
}

// Devolve iniciarTransicao({ titulo, saudacao }).
export function useTransicao() {
  const iniciar = use(ContextoTransicao);

  if (!iniciar) {
    throw new Error('useTransicao precisa estar dentro de <ProvedorTransicao>.');
  }

  return iniciar;
}

function TransicaoCadastro({ titulo, saudacao, destino }) {
  const router = useRouter();
  const [ativa, setAtiva] = useState(false);

  useEffect(() => {
    // Permite que o navegador aplique o estado inicial
    const quadro = requestAnimationFrame(function () {
      setAtiva(true);
    });

    // Vai para a Home após a animação
    const espera = setTimeout(function () {
      router.push(destino);
    }, TEMPO_TRANSICAO);

    return () => {
      cancelAnimationFrame(quadro);
      clearTimeout(espera);
    };
  }, [router, destino]);

  return (
    <div className={ativa ? 'transicao-cadastro ativa' : 'transicao-cadastro'} role="status" aria-live="polite">
      <div className="transicao-cadastro-conteudo">
        <span className="transicao-cadastro-icone" aria-hidden="true">
          ✦
        </span>

        <h2>{titulo}</h2>

        <p>
          {saudacao}
          <br />
          Preparando sua entrada no evento...
        </p>

        <div className="transicao-cadastro-carregamento"></div>
      </div>
    </div>
  );
}
