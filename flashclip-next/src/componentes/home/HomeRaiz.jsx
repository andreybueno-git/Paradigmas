'use client';
// Raiz da home: o wrapper [data-fc-page="home"] (o antigo <body class="natal-theme" data-lights="on">),
// a tela de carregamento e a ligação dos módulos de src/lib/home com o ciclo de vida do React.
//
// As classes de estado que o JS original punha no <body> (fc-paused, fc-hidden, fc-motion-ready,
// fc-entry-active, fc-entry-landing, fc-globe-open) e o data-lights moram neste wrapper e são
// escritos pelos módulos (classList/dataset), como antes. O React nunca os sobrescreve: o className
// e o data-lights do JSX são constantes, e o React só toca num atributo quando a prop muda.
// O mesmo vale para os textos e atributos que os módulos trocam dentro da página (botões do globo,
// abertura): o JSX deles é estático.
//
// Ordem (a mesma dos scripts do index.html): carregamento → tema → abertura → globo 3D. O globo
// baixa o Three.js sob demanda; os outros rodam no useLayoutEffect para não piscar antes da pintura.
import { useLayoutEffect, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { criarCarregamento, SCRIPT_CARREGAMENTO } from '@/lib/home/carregamento';
import { iniciarNatal } from '@/lib/home/natal';
import { iniciarEntrada } from '@/lib/home/entrada';
import { iniciarGlobo } from '@/lib/home/globo';
import { ContextoHome } from './contexto';
import TelaCarregamento from './TelaCarregamento';

const CONTENTS = { display: 'contents' };
const nada = () => () => {};
const sim = () => true;
const nao = () => false;

function criarHome() {
  // Canal de avisos entre os módulos desta montagem (substitui os fc:* em window entre eles).
  const canal = new EventTarget();
  return { canal, boot: criarCarregamento(canal) };
}

export default function HomeRaiz({ children }) {
  const [home] = useState(criarHome);
  const refRaiz = useRef(null);

  // O <script> do carregamento só existe no HTML estático: na hidratação ele é mantido (já rodou) e
  // depois sai; numa navegação no cliente ele nem é criado (o React não executa <script>).
  const hidratando = useSyncExternalStore(nada, nao, sim);
  // Tela de carregamento uma vez por aba: na hidratação vale o HTML estático (a tela está lá e o
  // <html class="fc-loaded-before"> a esconde); depois, a decisão desta montagem.
  const jaCarregado = useSyncExternalStore(nada, home.boot.jaCarregado, nao);

  useLayoutEffect(() => home.boot.iniciar(refRaiz.current), [home]);

  useLayoutEffect(() => {
    const raiz = refRaiz.current;
    const desfazerNatal = iniciarNatal(raiz);
    const desfazerEntrada = iniciarEntrada(raiz, home);
    return () => {
      desfazerEntrada();
      desfazerNatal();
    };
  }, [home]);

  useEffect(() => {
    if (home.boot.bypassed) return;
    return iniciarGlobo(refRaiz.current, home);
  }, [home]);

  // Os cursos contam para a revelação mesmo com erro ou lista vazia (como no original).
  const contexto = useMemo(() => ({ aoTerminarCursos: () => home.boot.report('courses') }), [home]);

  return (
    <div data-fc-page="home" className="natal-theme" data-lights="on" style={CONTENTS} ref={refRaiz}>
      {hidratando && <script dangerouslySetInnerHTML={{ __html: SCRIPT_CARREGAMENTO }} />}
      {!jaCarregado && <TelaCarregamento boot={home.boot} />}
      <ContextoHome value={contexto}>{children}</ContextoHome>
    </div>
  );
}
