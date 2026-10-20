'use client';
// =========================
// CONFIRMAÇÃO DA MATRÍCULA
// =========================
//
// Porte do js/matricula.js: lê o curso da URL, carrega o curso (com instrutores e vagas) e confirma
// a matrícula. Mesmas consultas, regras, mensagens e tempos (consultas.js).
//
// O curso vem de ?id= (é o que os cards de curso mandam, como no original); ?curso= também vale.
// useSearchParams obriga o <Suspense> em volta (no page.jsx); o HTML estático mostra o fallback,
// que é o mesmo painel em "Carregando curso...".
//
// O App Router reaproveita a página quando só a busca muda (?id=1 → ?id=2). Por isso o card é
// montado com key = id: trocar de curso começa do zero (curso, mensagem, botão e esperas), como
// recarregar a página no original, e respostas do curso anterior são descartadas.
//
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PainelMatricula from './PainelMatricula';
import { useTransicaoMatricula } from './TransicaoMatricula';
import { buscarCurso, realizarMatricula } from './consultas';

// Tempo do aviso antes de ir para o login.
const TEMPO_IR_PARA_LOGIN = 1800;

const CARREGANDO = {};

export default function ConfirmacaoMatricula() {
  const parametros = useSearchParams();
  const cursoId = parametros.get('id') ?? parametros.get('curso');

  return <Confirmacao key={cursoId ?? ''} cursoId={cursoId} />;
}

function Confirmacao({ cursoId }) {
  const router = useRouter();
  const iniciarTransicao = useTransicaoMatricula();
  const refMensagem = useRef(null);

  // {} (carregando) | { erro } | { curso, card }
  const [carga, setCarga] = useState(CARREGANDO);
  // { texto, tipo } ou null (mensagem escondida)
  const [mensagem, setMensagem] = useState(null);
  // 'ocioso' | 'verificando' | 'concluida'
  const [fase, setFase] = useState('ocioso');

  // Estado que não aparece na tela (o original guardava em variáveis do módulo). Fica em ref para
  // um clique duplo rápido não começar duas matrículas.
  const controle = useRef({
    cursoAtual: null,
    matriculaEmAndamento: false,
    matriculaConcluida: false,
    esperaLogin: null,
    montado: false,
  });

  // A espera para ir ao login não sobrevive à saída da página.
  useEffect(() => {
    const atual = controle.current;
    atual.montado = true;

    return () => {
      atual.montado = false;

      if (atual.esperaLogin !== null) {
        clearTimeout(atual.esperaLogin);
        atual.esperaLogin = null;
      }
    };
  }, []);

  // =========================
  // CARREGAR CURSO
  // =========================

  useEffect(() => {
    let ativo = true;

    buscarCurso(cursoId).then(function (resultado) {
      if (!ativo) return;

      controle.current.cursoAtual = resultado.curso ?? null;
      setCarga(resultado);
    });

    return () => {
      ativo = false;
    };
  }, [cursoId]);

  // =========================
  // MENSAGENS DENTRO DO CARD
  // =========================
  // Cada mensagem nova rola a tela até ela, como o scrollIntoView do original.

  useEffect(() => {
    if (!mensagem) return;

    refMensagem.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [mensagem]);

  function mostrarMensagem(texto, tipo = 'erro') {
    setMensagem({ texto, tipo });
  }

  function limparMensagem() {
    setMensagem(null);
  }

  // =========================
  // CONFIRMAR MATRÍCULA
  // =========================

  async function confirmarMatricula() {
    const atual = controle.current;

    if (!atual.cursoAtual || atual.matriculaEmAndamento || atual.matriculaConcluida) {
      return;
    }

    atual.matriculaEmAndamento = true;

    limparMensagem();

    // Botão desabilitado com "Verificando matrícula..."
    setFase('verificando');

    const resultado = await realizarMatricula(atual.cursoAtual, cursoId);

    atual.matriculaEmAndamento = false;

    // Saiu da página (ou trocou de curso) no meio: nada de mensagem, espera ou transição.
    if (!atual.montado) return;

    if (resultado.login) {
      mostrarMensagem(
        'Você precisa entrar na sua conta para realizar a matrícula. Redirecionando para o login...',
        'aviso',
      );

      // O botão continua desabilitado com "Verificando matrícula..." até sair.
      atual.esperaLogin = setTimeout(function () {
        atual.esperaLogin = null;
        router.push('/login/');
      }, TEMPO_IR_PARA_LOGIN);

      return;
    }

    if (resultado.concluida) {
      atual.matriculaConcluida = true;

      setFase('concluida');

      iniciarTransicao({ nomeCurso: String(atual.cursoAtual?.nome || 'seu curso') });

      return;
    }

    mostrarMensagem(resultado.texto, resultado.tipo);

    // Volta o botão (com a seta), habilitado porque há curso carregado.
    setFase('ocioso');
  }

  return (
    <PainelMatricula
      mensagem={mensagem}
      refMensagem={refMensagem}
      carga={carga}
      fase={fase}
      aoConfirmar={confirmarMatricula}
    />
  );
}
