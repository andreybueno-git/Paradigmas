'use client';
// Seção de cursos da home (section.cursos#cursos de index.html). A lista é a compartilhada
// (<ListaCursos variante="home">, até 11 cursos); quando ela termina de carregar, a tela de
// carregamento da home recebe report('courses') pelo contexto do <HomeRaiz>.
import { useContext } from 'react';
import ListaCursos from '@/componentes/cursos/ListaCursos';
import { ContextoHome } from './contexto';

export default function SecaoCursos() {
  const home = useContext(ContextoHome);

  return (
    <section className="cursos" id="cursos">
      <div className="titulo-cursos">
        <span>ESCOLHA SEU PRÓXIMO COMEÇO</span><h2>Conhecimento para levar<br />além deste Natal.</h2>
        <p>Confira os cursos disponíveis para inscrição.</p>
      </div>

      <ListaCursos variante="home" aoTerminar={home?.aoTerminarCursos} />
    </section>
  );
}
